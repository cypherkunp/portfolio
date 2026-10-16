#!/usr/bin/env node
/**
 * Chat edit gate.
 * `mark` records agent file edits. `stop` runs `pnpm lint` and `pnpm test`
 * once the agent loop ends, and asks the agent to fix failures.
 */
import { execFileSync, spawn } from 'node:child_process';
import {
  closeSync,
  constants,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const COMMAND_TIMEOUT_MS = 8 * 60 * 1000;
const OUTPUT_TAIL = 4000;
const HOOKS_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(HOOKS_DIR, '..', '..');

function readStdin() {
  return readFileSync(0, 'utf8');
}

function emit(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

async function finish(payload) {
  emit(payload);
  await new Promise(resolve => setTimeout(resolve, 80));
}

function repoRoot(input) {
  const roots = Array.isArray(input.workspace_roots) ? input.workspace_roots : [];
  for (const root of roots) {
    if (typeof root === 'string' && existsSync(join(root, 'package.json'))) return root;
  }
  return REPO_ROOT;
}

function stateDir(root) {
  return join(root, '.cursor', 'hooks', 'state');
}

function withLock(dir, fn) {
  mkdirSync(dir, { recursive: true });
  const lockPath = join(dir, 'edits.lock');
  const started = Date.now();
  let fd;
  while (fd === undefined) {
    try {
      fd = openSync(lockPath, constants.O_CREAT | constants.O_EXCL | constants.O_WRONLY);
    } catch (error) {
      if (error && error.code !== 'EEXIST') throw error;
      if (Date.now() - started > 5000) {
        try {
          unlinkSync(lockPath);
        } catch {
          // Another process removed the stale lock.
        }
      }
      sleep(25);
    }
  }
  try {
    return fn();
  } finally {
    closeSync(fd);
    try {
      unlinkSync(lockPath);
    } catch {
      // Lock already released.
    }
  }
}

function logPath(dir) {
  return join(dir, 'edits.log');
}

function isProjectFile(root, filePath) {
  return filePath === root || filePath.startsWith(`${root}/`);
}

function markEdit(input) {
  const conversationId = input.conversation_id || 'unknown';
  const filePath = typeof input.file_path === 'string' ? input.file_path : '';
  if (!filePath || filePath.includes('\n') || filePath.includes('\t')) return;
  if (!isProjectFile(repoRoot(input), filePath)) return;

  const dir = stateDir(repoRoot(input));
  withLock(dir, () => {
    writeFileSync(logPath(dir), `${conversationId}\t${filePath}\n`, { flag: 'a' });
  });
}

function takeEdits(input) {
  const conversationId = input.conversation_id || 'unknown';
  const dir = stateDir(repoRoot(input));
  return withLock(dir, () => {
    const path = logPath(dir);
    let raw = '';
    try {
      raw = readFileSync(path, 'utf8');
    } catch {
      return [];
    }

    const keep = [];
    const mine = [];
    for (const line of raw.split('\n')) {
      if (!line) continue;
      const tab = line.indexOf('\t');
      if (tab === -1) continue;
      const id = line.slice(0, tab);
      const file = line.slice(tab + 1);
      if (id === conversationId) mine.push(file);
      else keep.push(line);
    }

    writeFileSync(path, keep.length > 0 ? `${keep.join('\n')}\n` : '');
    return [...new Set(mine)];
  });
}

function resolvePnpm() {
  const pathEntries = (process.env.PATH || '').split(':').filter(Boolean);
  for (const entry of pathEntries) {
    const candidate = join(entry, 'pnpm');
    if (existsSync(candidate)) return candidate;
  }

  try {
    const found = execFileSync('/bin/zsh', ['-lic', 'command -v pnpm'], {
      encoding: 'utf8',
      timeout: 15000,
    }).trim();
    if (found && existsSync(found.split('\n').pop())) return found.split('\n').pop();
  } catch {
    // Login shell could not resolve pnpm.
  }

  return null;
}

function killProcessTree(pid, signal) {
  try {
    process.kill(-pid, signal);
  } catch {
    try {
      process.kill(pid, signal);
    } catch {
      // Already gone.
    }
  }
}

function runCommand(command, args, cwd) {
  return new Promise(resolve => {
    const child = spawn(command, args, {
      cwd,
      env: process.env,
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let settled = false;
    let timedOut = false;
    let killTimer;
    let output = '';
    const append = chunk => {
      output += chunk.toString();
      if (output.length > 80_000) output = output.slice(-60_000);
    };
    child.stdout.on('data', append);
    child.stderr.on('data', append);

    const settle = result => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      clearTimeout(killTimer);
      resolve(result);
    };

    const timer = setTimeout(() => {
      timedOut = true;
      killProcessTree(child.pid, 'SIGTERM');
      killTimer = setTimeout(() => {
        killProcessTree(child.pid, 'SIGKILL');
        child.stdout.destroy();
        child.stderr.destroy();
        settle({
          code: 124,
          output: `${output}\n[timed out after ${COMMAND_TIMEOUT_MS}ms]\n`,
        });
      }, 2000);
    }, COMMAND_TIMEOUT_MS);

    child.on('error', error => {
      settle({ code: 127, output: String(error) });
    });
    child.on('close', code => {
      if (timedOut) {
        settle({
          code: 124,
          output: `${output}\n[timed out after ${COMMAND_TIMEOUT_MS}ms]\n`,
        });
        return;
      }
      settle({ code: code ?? 1, output });
    });
  });
}

function tail(text) {
  const trimmed = text.trim();
  if (trimmed.length <= OUTPUT_TAIL) return trimmed;
  return trimmed.slice(-OUTPUT_TAIL);
}

async function stop(input) {
  if (input.status && input.status !== 'completed') {
    await finish({});
    return;
  }

  const root = repoRoot(input);
  const files = takeEdits(input).filter(file => isProjectFile(root, file));
  if (files.length === 0) {
    await finish({});
    return;
  }

  const pnpm = resolvePnpm();
  if (!pnpm) {
    await finish({
      followup_message:
        'Chat edited files, but `pnpm` is not on PATH, so lint and tests did not run. Install pnpm and run `pnpm lint` and `pnpm test`.',
    });
    return;
  }

  const [lint, test] = await Promise.all([
    runCommand(pnpm, ['lint'], root),
    runCommand(pnpm, ['test'], root),
  ]);

  console.error(`[chat-checks] pnpm lint ${lint.code}, pnpm test ${test.code}`);

  if (lint.code === 0 && test.code === 0) {
    await finish({});
    return;
  }

  const sections = [
    'pnpm lint and pnpm test failed after this chat edited files. Fix the failures. Do not change unrelated files.',
    '',
    'Edited files:',
    ...files.map(file => `- ${file}`),
    '',
  ];

  for (const [name, result] of [
    ['pnpm lint', lint],
    ['pnpm test', test],
  ]) {
    sections.push(`$ ${name}`, `exit ${result.code}`);
    if (result.code !== 0) sections.push(tail(result.output) || '(no output)');
    sections.push('');
  }

  await finish({ followup_message: sections.join('\n') });
}

const mode = process.argv[2];
const raw = readStdin();
let input = {};
try {
  input = raw ? JSON.parse(raw) : {};
} catch (error) {
  console.error('[chat-checks] invalid stdin JSON', error);
  if (mode === 'stop') emit({});
  process.exit(0);
}

if (mode === 'mark') {
  try {
    markEdit(input);
  } catch (error) {
    console.error('[chat-checks] mark failed', error);
  }
  process.exit(0);
}

if (mode === 'stop') {
  stop(input)
    .catch(async error => {
      console.error('[chat-checks] stop failed', error);
      await finish({});
    })
    .finally(() => {
      process.exit(0);
    });
} else {
  console.error('[chat-checks] expected "mark" or "stop"');
  process.exit(0);
}
