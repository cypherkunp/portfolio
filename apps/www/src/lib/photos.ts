import 'server-only';

import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cache } from 'react';
import sharp from 'sharp';

import type { Photo } from '@/lib/photo';

/**
 * Drop images in `src/images/photos`. The grid reads the folder on each request.
 *
 * Optional filename: `2025-11-15--new-york-us--city-skyline.jpg`
 *   {date}--{location}--{alt}.ext
 * Bare filename: `vacation.jpg` → alt from the name, date from mtime.
 */
export const PHOTOS_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../images/photos',
);

const PHOTO_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);

const DATE_PREFIX = /^(\d{4}-\d{2}-\d{2})--/;

interface FilenameMeta {
  date?: string;
  location?: string;
  alt: string;
}

function sentenceCase(slug: string) {
  const text = slug.replace(/-/g, ' ').trim();
  if (!text) return 'Photo';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function locationLabel(slug: string) {
  return slug
    .split('-')
    .filter(Boolean)
    .map(part => (part.length <= 2 ? part.toUpperCase() : part.charAt(0).toUpperCase() + part.slice(1)))
    .join(' ');
}

function parseFilename(filename: string): FilenameMeta {
  const stem = filename.replace(/\.[^.]+$/, '');
  if (/^\d+$/.test(stem)) return { alt: 'Photo' };

  const dateMatch = stem.match(DATE_PREFIX);
  const rest = dateMatch ? stem.slice(dateMatch[0].length) : stem;
  const parts = rest.split('--').filter(Boolean);

  if (parts.length >= 2) {
    const location = parts[0];
    const alt = parts.slice(1).join(' ');
    return {
      date: dateMatch?.[1],
      location: locationLabel(location),
      alt: sentenceCase(alt),
    };
  }

  return {
    date: dateMatch?.[1],
    alt: sentenceCase(parts[0] ?? stem),
  };
}

async function readPhotoFolder(): Promise<Photo[]> {
  let entries: string[];
  try {
    entries = await readdir(PHOTOS_DIR);
  } catch {
    return [];
  }

  const photos = await Promise.all(
    entries.map(async (filename): Promise<Photo | null> => {
      const ext = path.extname(filename).toLowerCase();
      if (!PHOTO_EXTENSIONS.has(ext)) return null;
      if (filename.startsWith('.')) return null;

      const filePath = path.join(PHOTOS_DIR, filename);
      const [fileStat, metadata] = await Promise.all([
        stat(filePath),
        sharp(filePath).metadata(),
      ]);

      if (!fileStat.isFile()) return null;

      const parsed = parseFilename(filename);

      return {
        id: filename,
        src: `/photos/${encodeURIComponent(filename)}`,
        alt: parsed.alt,
        width: metadata.width ?? 800,
        height: metadata.height ?? 800,
        location: parsed.location,
        date: parsed.date ?? fileStat.mtime.toISOString().slice(0, 10),
      };
    }),
  );

  return photos
    .filter((photo): photo is Photo => photo !== null)
    .toSorted((a, b) => {
      if (a.date === b.date) return a.id.localeCompare(b.id);
      return a.date < b.date ? 1 : -1;
    });
}

export type { Photo };

export const getPhotos = cache(readPhotoFolder);
