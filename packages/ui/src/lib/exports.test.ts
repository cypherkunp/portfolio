import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const uiRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const exportsMap = JSON.parse(readFileSync(path.join(uiRoot, 'package.json'), 'utf8'))
  .exports as Record<string, string>;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    if (!/\.tsx?$/.test(entry.name) || /\.test\.tsx?$/.test(entry.name)) return [];
    return [full];
  });
}

function exportCovers(relativeFile: string) {
  const exactKey = `./${relativeFile.replace(/\.tsx?$/, '')}`;
  const exact = exportsMap[exactKey];
  if (exact === `./src/${relativeFile}`) return true;

  const extension = path.extname(relativeFile);
  return Object.entries(exportsMap).some(([key, target]) => {
    if (!key.endsWith('/*') || !target.endsWith(`/*${extension}`)) return false;
    const keyDir = key.slice(2, -2);
    const targetDir = target.slice(2, -extension.length - 2);
    return (
      relativeFile.startsWith(`${keyDir}/`) && `src/${relativeFile}`.startsWith(`${targetDir}/`)
    );
  });
}

describe('@repo/ui exports', () => {
  const files = ['components', 'hooks', 'lib'].flatMap(root =>
    sourceFiles(path.join(uiRoot, 'src', root)).map(file =>
      path.relative(path.join(uiRoot, 'src'), file).replaceAll('\\', '/'),
    ),
  );

  it('maps every public file, including a lib .tsx file', () => {
    const missing = files.filter(file => !exportCovers(file));
    expect(missing).toEqual([]);
  });
});
