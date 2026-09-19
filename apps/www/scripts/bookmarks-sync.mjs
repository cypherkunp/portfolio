#!/usr/bin/env node
/**
 * Reads Chrome Default bookmarks, prompts, writes `bookmarks.config.json`,
 * then runs `bookmarks:fetch`.
 *
 * Run: pnpm --filter www bookmarks:sync
 */
import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import {
  autocomplete,
  autocompleteMultiselect,
  cancel,
  confirm,
  intro,
  isCancel,
  note,
  outro,
  select,
  text,
} from '@clack/prompts';

import {
  applyPlans,
  classifyBookmarks,
  collectionIdFromTitle,
  collectionMatchingGuid,
  formatDiff,
  hostnameOf,
  topLevelFolders,
} from './lib/bookmarks-sync.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const CHROME_BOOKMARKS = path.join(
  os.homedir(),
  'Library/Application Support/Google/Chrome/Default/Bookmarks',
);
const CONFIG_FILE = path.resolve('src/content/bookmarks.config.json');
const FETCH_SCRIPT = path.join(here, 'fetch-bookmarks-og.mjs');

function stop(value) {
  if (isCancel(value)) {
    cancel('Stopped.');
    process.exit(0);
  }
  return value;
}

async function promptTitle(fallback) {
  const value = String(
    stop(
      await text({
        message: 'Collection title',
        initialValue: fallback,
        defaultValue: fallback,
      }),
    ),
  ).trim();
  return value || fallback;
}

async function promptBookmarks(title, folder) {
  if (!folder.bookmarks.length) return [];
  const keptUrls = stop(
    await autocompleteMultiselect({
      message: `Bookmarks in ${title}`,
      placeholder: 'Type to search…  uncheck to skip',
      maxItems: 12,
      required: false,
      initialValues: folder.bookmarks.map(bookmark => bookmark.url),
      options: folder.bookmarks.map(bookmark => ({
        value: bookmark.url,
        label: bookmark.name,
        hint: hostnameOf(bookmark.url),
      })),
    }),
  );
  const keep = new Set(keptUrls);
  return folder.bookmarks.filter(bookmark => keep.has(bookmark.url));
}

async function promptAttachTarget(folder, collections) {
  const pickedId = stop(
    await autocomplete({
      message: `Attach ${folder.name} to`,
      placeholder: 'Type to search…',
      maxItems: 12,
      options: collections.map(collection => ({
        value: collection.id,
        label: collection.name,
        hint: collection.id,
      })),
    }),
  );
  return collections.find(collection => collection.id === pickedId);
}

async function planAttach(folder, target) {
  const name = await promptTitle(target.name);
  const selected = await promptBookmarks(name, folder);
  return {
    action: 'attach',
    folderName: folder.name,
    collectionId: target.id,
    name,
    chromeGuid: folder.guid,
    selected,
    buckets: classifyBookmarks(selected, target.bookmarks),
  };
}

async function planCreate(folder, collections) {
  while (true) {
    const name = await promptTitle(folder.name);
    const collectionId = collectionIdFromTitle(name);
    const owner = collections.find(collection => collection.id === collectionId);
    if (!owner) {
      const selected = await promptBookmarks(name, folder);
      return {
        action: 'create',
        folderName: folder.name,
        collectionId,
        name,
        chromeGuid: folder.guid,
        selected,
        buckets: classifyBookmarks(selected, []),
      };
    }

    const recovery = stop(
      await select({
        message: `slug ${collectionId} already exists`,
        options: [
          { value: 'attach', label: 'Attach' },
          { value: 'retitle', label: 'Change title' },
          { value: 'skip', label: 'Skip (this folder)' },
        ],
      }),
    );
    if (recovery === 'skip') return null;
    if (recovery === 'attach') return planAttach(folder, owner);
  }
}

async function planFolder(folder, collections) {
  const joined = collectionMatchingGuid(collections, folder.guid);
  if (joined) return planAttach(folder, joined);

  if (!collections.length) return planCreate(folder, collections);

  const action = stop(
    await select({
      message: `No Collection is joined to ${folder.name}.`,
      options: [
        { value: 'create', label: 'Create new Collection' },
        { value: 'attach', label: 'Attach to an existing Collection' },
      ],
      initialValue: 'create',
    }),
  );

  if (action === 'attach') {
    const target = await promptAttachTarget(folder, collections);
    if (!target) return null;
    return planAttach(folder, target);
  }

  return planCreate(folder, collections);
}

function loadSiteConfig(raw) {
  return {
    $schema: raw.$schema,
    collections: (raw.collections ?? []).map(collection => ({
      id: collection.id,
      name: collection.name,
      description: collection.description ?? '',
      chromeGuid:
        typeof collection.chromeGuid === 'string' && collection.chromeGuid
          ? collection.chromeGuid
          : undefined,
      bookmarks: (collection.bookmarks ?? []).map(bookmark =>
        typeof bookmark === 'string'
          ? { url: bookmark }
          : { url: bookmark.url, title: bookmark.title, image: bookmark.image },
      ),
    })),
  };
}

async function readChromeRoots() {
  try {
    await fs.access(CHROME_BOOKMARKS);
  } catch {
    console.error(`Chrome Default bookmarks file not found:\n${CHROME_BOOKMARKS}`);
    process.exit(1);
  }

  let parsed;
  try {
    parsed = JSON.parse(await fs.readFile(CHROME_BOOKMARKS, 'utf8'));
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  }

  if (!parsed?.roots) {
    console.error('Chrome Default bookmarks file has no roots.');
    process.exit(1);
  }

  return parsed.roots;
}

function runFetch() {
  return new Promise(resolve => {
    const child = spawn(process.execPath, [FETCH_SCRIPT], {
      stdio: 'inherit',
      cwd: path.resolve(here, '..'),
    });
    child.on('error', () => resolve(1));
    child.on('close', code => resolve(code ?? 1));
  });
}

async function main() {
  intro('bookmarks:sync');

  const folders = topLevelFolders(await readChromeRoots());
  const siteConfig = loadSiteConfig(JSON.parse(await fs.readFile(CONFIG_FILE, 'utf8')));
  let working = siteConfig;

  const selectedGuids = stop(
    await autocompleteMultiselect({
      message: 'Chrome folders to sync',
      placeholder: 'Type to search…',
      maxItems: 12,
      required: true,
      options: folders.map(folder => ({
        value: folder.guid,
        label: folder.name,
        hint: `${folder.bookmarks.length} bookmarks · ${folder.rootLabel}`,
      })),
    }),
  );

  const selectedFolders = folders.filter(folder => selectedGuids.includes(folder.guid));
  const plans = [];

  for (const folder of selectedFolders) {
    const plan = await planFolder(folder, working.collections);
    if (!plan) continue;
    plans.push(plan);
    working = applyPlans(working, [plan]);
  }

  if (!plans.length) {
    outro('Nothing to write.');
    return;
  }

  note(formatDiff(plans), 'diff');

  const ok = stop(
    await confirm({
      message: 'Write these changes?',
      initialValue: true,
    }),
  );

  if (!ok) {
    outro('No changes written.');
    return;
  }

  const next = applyPlans(siteConfig, plans);
  await fs.writeFile(CONFIG_FILE, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
  outro('Wrote bookmarks.config.json');

  process.exit(await runFetch());
}

main().catch(err => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
