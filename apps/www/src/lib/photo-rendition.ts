import { access } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

import { PHOTOS_DIR } from '@/lib/photos';

const WIDTHS = new Set([384, 640, 1080, 1920]);

export interface PhotoRendition {
  bytes: Buffer;
  contentType: 'image/webp';
}

interface RenditionQuery {
  url: string | null;
  width: string | null;
}

interface RenditionOptions {
  photosDir?: string;
}

function photoFile(photosDir: string, url: string | null) {
  if (!url?.startsWith('/photos/')) return null;

  let filename: string;
  try {
    filename = decodeURIComponent(url.slice('/photos/'.length));
  } catch {
    return null;
  }

  if (
    !filename ||
    filename.includes('/') ||
    filename.includes('\\') ||
    filename.includes('\0') ||
    filename.includes('..')
  ) {
    return null;
  }

  const root = path.resolve(photosDir);
  const filePath = path.resolve(root, filename);
  if (!filePath.startsWith(`${root}${path.sep}`)) return null;
  return filePath;
}

export async function renditionFor(
  query: RenditionQuery,
  options?: RenditionOptions,
): Promise<PhotoRendition | null> {
  const width = Number(query.width);
  if (!WIDTHS.has(width)) return null;

  const filePath = photoFile(options?.photosDir ?? PHOTOS_DIR, query.url);
  if (!filePath) return null;

  try {
    await access(filePath);
  } catch {
    return null;
  }

  const bytes = await sharp(filePath, { failOn: 'none' })
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 75 })
    .toBuffer();

  return { bytes, contentType: 'image/webp' };
}
