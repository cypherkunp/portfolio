import fs from 'fs';
import path from 'path';

type Metadata = {
  title: string;
  publishedOn: string;
  version: string;
  image?: string;
  tags: string[];
};

function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(fileContent);

  if (!match || !match[1]) {
    throw new Error('Missing frontmatter in MDX file');
  }

  const frontMatterBlock = match[1];
  const content = fileContent.replace(frontmatterRegex, '').trim();
  const frontMatterLines = frontMatterBlock.trim().split('\n');
  const raw: Record<string, unknown> = {};

  let i = 0;
  while (i < frontMatterLines.length) {
    const line = frontMatterLines[i].trim();

    if (!line) {
      i++;
      continue;
    }

    // Check if this is an array (key followed by array items)
    if (
      line.includes(':') &&
      i + 1 < frontMatterLines.length &&
      frontMatterLines[i + 1].trim().startsWith('-')
    ) {
      const [key] = line.split(':');
      const keyName = key.trim();
      const arrayItems: string[] = [];

      // Collect array items
      i++;
      while (i < frontMatterLines.length && frontMatterLines[i].trim().startsWith('-')) {
        const itemLine = frontMatterLines[i].trim();
        const itemValue = itemLine
          .substring(1)
          .trim()
          .replace(/^['"](.*)['"]$/, '$1');
        arrayItems.push(itemValue);
        i++;
      }

      raw[keyName] = arrayItems;
      continue;
    }

    // Handle regular key-value pairs
    if (line.includes(':')) {
      const [key, ...valueArr] = line.split(': ');
      const keyName = key.trim();
      let value = valueArr.join(': ').trim();
      value = value.replace(/^['"](.*)['"]$/, '$1');

      raw[keyName] = value;
    }

    i++;
  }

  // Validate and normalize against schema
  const errors: string[] = [];
  const title = typeof raw.title === 'string' ? raw.title.trim() : '';
  const publishedOn = typeof raw.publishedOn === 'string' ? raw.publishedOn.trim() : '';
  const version =
    raw.version == null
      ? ''
      : typeof raw.version === 'string'
        ? raw.version.trim()
        : String(raw.version).trim();
  const tags: string[] = Array.isArray(raw.tags)
    ? (raw.tags as unknown[]).map(v => String(v).trim()).filter(Boolean)
    : [];

  if (!title) errors.push('title');
  if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(publishedOn)) errors.push('publishedOn');
  if (!version) errors.push('version');
  if (tags.length === 0) errors.push('tags');

  if (errors.length) {
    throw new Error(`Missing/invalid frontmatter fields: ${errors.join(', ')}`);
  }

  const metadata: Metadata = { title, publishedOn, version, tags };

  return { metadata, content };
}

function getMDXFiles(dir: string): string[] {
  return fs.readdirSync(dir).filter(file => path.extname(file) === '.mdx');
}

function readMDXFile(filePath: string): { metadata: Metadata; content: string } {
  let rawContent = fs.readFileSync(filePath, 'utf-8');
  return parseFrontmatter(rawContent);
}

function getMDXData(dir: string) {
  let mdxFiles = getMDXFiles(dir);
  return mdxFiles.map(file => {
    let { metadata, content } = readMDXFile(path.join(dir, file));
    let slug = path.basename(file, path.extname(file));

    return {
      metadata,
      slug,
      content,
    };
  });
}

export function getBlogPosts() {
  // Resolve path relative to the app directory (apps/www)
  // In Next.js, process.cwd() should point to the app root
  const basePath = process.cwd();
  let postsPath = path.join(basePath, 'src', 'content', 'posts');

  // If path doesn't exist, try alternative resolutions for monorepo setups
  if (!fs.existsSync(postsPath)) {
    // Try with apps/www prefix (monorepo root case)
    const altPath1 = path.join(basePath, 'apps', 'www', 'src', 'content', 'posts');
    if (fs.existsSync(altPath1)) {
      postsPath = altPath1;
    } else {
      // Try resolving from import.meta.url (ESM) or __dirname (CommonJS)
      try {
        // @ts-ignore - __dirname may not be available in ESM
        const currentDir =
          typeof __dirname !== 'undefined'
            ? __dirname
            : path.dirname(new URL(import.meta.url).pathname);
        const altPath2 = path.resolve(currentDir, '..', 'content', 'posts');
        if (fs.existsSync(altPath2)) {
          postsPath = altPath2;
        }
      } catch {
        // Ignore errors and use default path
      }
    }
  }

  if (!fs.existsSync(postsPath)) {
    throw new Error(
      `Posts directory not found. Tried: ${postsPath}. ` + `Current working directory: ${basePath}`,
    );
  }

  return getMDXData(postsPath);
}

export function formatDate(date: string, includeRelative = false) {
  if (!date.includes('T')) {
    date = `${date}T00:00:00`;
  }
  const targetDate = new Date(date);

  const fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  if (!includeRelative) {
    return fullDate;
  }

  // Only calculate relative time if needed (this requires current date)
  // For static generation, we skip relative time calculation
  // If relative time is needed, it should be calculated on the client side
  return fullDate;
}
