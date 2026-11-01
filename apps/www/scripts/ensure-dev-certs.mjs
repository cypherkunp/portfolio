#!/usr/bin/env node
/**
 * Writes a mkcert pair for the Cloudflare tunnel origin https://localhost:3036.
 * `*.pem` is gitignored.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const certDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.certs');
const cert = path.join(certDir, 'localhost.pem');
const key = path.join(certDir, 'localhost-key.pem');

if (existsSync(cert) && existsSync(key)) process.exit(0);

mkdirSync(certDir, { recursive: true });
execFileSync(
  'mkcert',
  ['-key-file', key, '-cert-file', cert, 'localhost', '127.0.0.1', '::1'],
  { stdio: 'inherit' },
);
