import 'server-only';

import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseExif } from 'exifr';
import { cache } from 'react';
import sharp from 'sharp';

import type { Photo } from '@/lib/photo';

/**
 * Drop images in `src/images/photos`. The grid reads the folder on each request.
 *
 * Metadata, first hit wins:
 *   1. Embedded JPEG tags (EXIF / IPTC / XMP)
 *   2. Filename: `2025-11-15--new-york-us--city-skyline.jpg`
 *   3. File mtime for the date
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

function cleanText(value: unknown): string | undefined {
  if (typeof value !== 'string') return;
  const text = value.replace(/\0/g, '').trim();
  if (!text) return;
  if (text.startsWith('FBMD')) return;
  if (!/[a-zA-Z]/.test(text)) return;
  if (text.length > 200) return;
  return text;
}

function toIsoDate(value: unknown): string | undefined {
  if (!value) return;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === 'string') {
    const normalized = value.includes('T')
      ? value
      : value.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
    const parsed = new Date(normalized);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  }

  return;
}

function formatGps(lat: unknown, lng: unknown): string | undefined {
  if (typeof lat !== 'number' || typeof lng !== 'number') return;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

  const latHemisphere = lat >= 0 ? 'N' : 'S';
  const lngHemisphere = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(2)}°${latHemisphere}, ${Math.abs(lng).toFixed(2)}°${lngHemisphere}`;
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
    const date = toIsoDate(value);
    if (date) return date;
  }
  return undefined;
}

async function readEmbeddedMeta(filePath: string): Promise<EmbeddedMeta> {
  try {
    const bytes = await readFile(filePath);
    const tags = await parseExif(bytes, {
      gps: true,
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
    const place = [city, region, country].filter(Boolean).join(', ') || formatGps(tags.latitude, tags.longitude);

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
        date: embedded.date ?? parsed.date ?? fileStat.mtime.toISOString().slice(0, 10),
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
