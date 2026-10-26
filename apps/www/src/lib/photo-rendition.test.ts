import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { afterEach, describe, expect, it } from 'vitest';

import { renditionFor } from '@/lib/photo-rendition';

const dirs: string[] = [];

async function photosDir() {
  const dir = await mkdtemp(path.join(tmpdir(), 'photos-'));
  dirs.push(dir);
  return dir;
}

async function writeJpeg(dir: string, name: string, width: number, height: number) {
  const bytes = await sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 18, g: 72, b: 140 },
    },
  })
    .jpeg()
    .toBuffer();
  await writeFile(path.join(dir, name), bytes);
  return bytes;
}

afterEach(async () => {
  await Promise.all(dirs.splice(0).map(dir => rm(dir, { recursive: true, force: true })));
});

describe('renditionFor', () => {
  it('resizes a photo to the requested thumbnail width as webp', async () => {
    const dir = await photosDir();
    const original = await writeJpeg(dir, 'lisbon.jpg', 2000, 1500);

    const rendition = await renditionFor(
      { url: '/photos/lisbon.jpg', width: '384' },
      { photosDir: dir },
    );

    expect(rendition).not.toBeNull();
    expect(rendition!.contentType).toBe('image/webp');
    expect(rendition!.bytes.equals(original)).toBe(false);

    const meta = await sharp(rendition!.bytes).metadata();
    expect(meta.format).toBe('webp');
    expect(meta.width).toBe(384);
    expect(meta.height).toBe(288);
  });

  it('serves the larger lightbox width without exceeding the source', async () => {
    const dir = await photosDir();
    await writeJpeg(dir, 'small.jpg', 100, 80);

    const rendition = await renditionFor(
      { url: '/photos/small.jpg', width: '1920' },
      { photosDir: dir },
    );

    const meta = await sharp(rendition!.bytes).metadata();
    expect(meta.width).toBe(100);
    expect(meta.height).toBe(80);
  });

  it('rejects a width outside the thumbnail and lightbox sizes', async () => {
    const dir = await photosDir();
    await writeJpeg(dir, 'lisbon.jpg', 800, 600);

    await expect(
      renditionFor({ url: '/photos/lisbon.jpg', width: '4000' }, { photosDir: dir }),
    ).resolves.toBeNull();
  });

  it('rejects a path that leaves the photos folder', async () => {
    const dir = await photosDir();
    await writeJpeg(dir, 'lisbon.jpg', 800, 600);

    await expect(
      renditionFor({ url: '/photos/../package.json', width: '640' }, { photosDir: dir }),
    ).resolves.toBeNull();
    await expect(
      renditionFor({ url: 'https://example.com/a.jpg', width: '640' }, { photosDir: dir }),
    ).resolves.toBeNull();
  });

  it('rejects a photo that is not in the folder', async () => {
    const dir = await photosDir();

    await expect(
      renditionFor({ url: '/photos/missing.jpg', width: '640' }, { photosDir: dir }),
    ).resolves.toBeNull();
  });
});
