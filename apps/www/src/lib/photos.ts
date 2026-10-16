import 'server-only';

import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { cache } from 'react';
import { parse as parseExif } from 'exifr';
import sharp from 'sharp';

import type { Photo } from '@/lib/photo';

/**
 * Drop images in `public/photos`. The grid reads the folder on each request.
 *
 * Metadata, first hit wins:
 *   1. Embedded JPEG tags (EXIF / IPTC / XMP)
 *   2. Filename: `2025-11-15--new-york-us--city-skyline.jpg`
 *   3. File mtime for the date
 */
export const PHOTOS_DIR = path.join(process.cwd(), 'public', 'photos');

const PHOTO_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);

const DATE_PREFIX = /^(\d{4}-\d{2}-\d{2})--/;

interface FilenameMeta {
  date?: string;
  location?: string;
  alt: string;
}

interface EmbeddedMeta {
  date?: string;
  location?: string;
  alt?: string;
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
    .map(part =>
      part.length <= 2 ? part.toUpperCase() : part.charAt(0).toUpperCase() + part.slice(1),
    )
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

function cleanText(value: unknown): string | undefined {
  if (typeof value !== 'string') return;
  const text = value.replace(/\0/g, '').trim();
  if (!text) return;
  if (text.startsWith('FBMD')) return;
  if (!/[a-zA-Z]/.test(text)) return;
  if (text.length > 200) return;
  return text;
}

function localYmd(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function ymd(year: string, month: string, day: string): string | undefined {
  const monthNumber = Number(month);
  const dayNumber = Number(day);
  if (monthNumber < 1 || monthNumber > 12 || dayNumber < 1 || dayNumber > 31) return;
  return `${year}-${month}-${day}`;
}

/** Calendar date from EXIF text or a Date. Does not shift the day through UTC. */
export function calendarDate(value: unknown): string | undefined {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return;
    return localYmd(value);
  }

  if (typeof value !== 'string') return;

  const exif = /^(\d{4}):(\d{2}):(\d{2})/.exec(value);
  if (exif?.[1] && exif[2] && exif[3]) return ymd(exif[1], exif[2], exif[3]);

  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (iso?.[1] && iso[2] && iso[3]) return ymd(iso[1], iso[2], iso[3]);

  return;
}

function firstText(...values: unknown[]) {
  for (const value of values) {
    const text = cleanText(value);
    if (text) return text;
  }
  return undefined;
}

function firstDate(...values: unknown[]) {
  for (const value of values) {
    const date = calendarDate(value);
    if (date) return date;
  }
  return undefined;
}

async function readEmbeddedMeta(filePath: string): Promise<EmbeddedMeta> {
  try {
    const bytes = await readFile(filePath);
    const tags = await parseExif(bytes, {
      gps: false,
      iptc: true,
      xmp: true,
      userComment: true,
      reviveValues: true,
      translateKeys: true,
      translateValues: true,
    });

    if (!tags) return {};

    const city = firstText(tags.City, tags.Sublocation, tags.SubLocation, tags.Location);
    const region = firstText(tags.State, tags['Province-State']);
    const country = firstText(tags.Country, tags.CountryName);
    const place = [city, region, country].filter(Boolean).join(', ');

    return {
      date: firstDate(tags.DateTimeOriginal, tags.CreateDate, tags.DateCreated, tags.ModifyDate),
      location: place || undefined,
      alt: firstText(
        tags.ImageDescription,
        tags.Caption,
        tags.Description,
        tags.Headline,
        tags.ObjectName,
        tags.Title,
        tags.XPTitle,
        tags.XPComment,
        tags.UserComment,
      ),
    };
  } catch {
    return {};
  }
}

let photoCache: { signature: string; photos: Photo[] } | null = null;

function isPhotoFile(filename: string): boolean {
  if (filename.startsWith('.')) return false;
  return PHOTO_EXTENSIONS.has(path.extname(filename).toLowerCase());
}

async function folderSignature(filenames: string[]): Promise<string> {
  const parts = await Promise.all(
    filenames.map(async filename => {
      const fileStat = await stat(path.join(PHOTOS_DIR, filename));
      return `${filename}:${fileStat.mtimeMs}:${fileStat.size}`;
    }),
  );
  parts.sort();
  return parts.join('|');
}

async function readPhotoFolder(): Promise<Photo[]> {
  let entries: string[];
  try {
    entries = await readdir(PHOTOS_DIR);
  } catch {
    return [];
  }

  const filenames = entries.filter(isPhotoFile);
  const signature = await folderSignature(filenames);
  if (photoCache?.signature === signature) return photoCache.photos;

  const photos = await Promise.all(
    entries.map(async (filename): Promise<Photo | null> => {
      if (!isPhotoFile(filename)) return null;

      const filePath = path.join(PHOTOS_DIR, filename);
      const [fileStat, metadata, embedded] = await Promise.all([
        stat(filePath),
        sharp(filePath).metadata(),
        readEmbeddedMeta(filePath),
      ]);

      if (!fileStat.isFile()) return null;

      const parsed = parseFilename(filename);

      return {
        id: filename,
        src: `/photos/${encodeURIComponent(filename)}`,
        alt: embedded.alt ?? parsed.alt,
        width: metadata.width ?? 800,
        height: metadata.height ?? 800,
        location: embedded.location ?? parsed.location,
        date: embedded.date ?? parsed.date ?? calendarDate(fileStat.mtime) ?? '',
      };
    }),
  );

  const sorted = photos
    .filter((photo): photo is Photo => photo !== null)
    .toSorted((a, b) => {
      if (a.date === b.date) return a.id.localeCompare(b.id);
      return a.date < b.date ? 1 : -1;
    });

  photoCache = { signature, photos: sorted };
  return sorted;
}

export type { Photo };

export const getPhotos = cache(readPhotoFolder);
