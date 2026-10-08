---
name: blog-author
description: >-
  Write or edit portfolio blog posts as MDX in apps/www. Use when drafting a
  post, rewriting blog copy, or when the user asks for a blog, article, or
  post. Prose follows the asd-ste100 skill. This skill covers the post file,
  markdown, and MDX components.
disable-model-invocation: true
---

# Blog author

Write every sentence with the `asd-ste100` skill. Read and follow `/asd-ste100` before the draft. Do not restate those rules here.

## Where posts live

- Path: `apps/www/src/content/posts/<slug>.mdx`
- Filename matches the URL slug

## Frontmatter

```yaml
---
title: 'Post title'
summary: 'One sentence for the meta description. Falls back to title when omitted.'
publishedOn: 'YYYY-MM-DD'
version: '1'
image: '/path/to/og.png'
tags:
  - 'tag'
---
```

`image` is optional. `summary` is optional. The page uses `summary` for the description and JSON-LD. The H1 in the body is the visible title. Match it to `title`.

## Markdown

Write valid CommonMark / MDX. `apps/www/mdx-components.tsx` maps these elements:

- Headings `h1`–`h6`
- Paragraphs
- Ordered lists, unordered lists, list items
- Emphasis, strong, strikethrough (`~~deleted~~`)
- Images. `width` and `height` when you know them
- Links. A site path uses `next/link`. A `#hash` stays on the page. Any other URL opens in a new tab
- Thematic breaks (`---`)
- Fenced code with a language tag, and inline code
- GFM tables
- Blockquotes

Authoring:

- One H1. Then `##` for sections, `###` for subsections.
- Blank line before and after headings, lists, code fences, and blockquotes.
- `-` for bullets. `1.` for ordered lists. Nest with 2 spaces.
- `` `inline` ``. Multi-line code in a fence with a language tag.
- `[label](https://example.com)`. A bare URL is the link text only when no label fits.
- `>` only for a real quote.
- Bold and italic inside a sentence.
- A GFM table for tabular data. Use the `Table` component when you pass `headers` and `rows` as data.

## Components

Registered in `apps/www/mdx-components.tsx`. No import.

### Callout

```mdx
<Callout variant="warning" title="CAUTION">
  Command or condition. Then the result.
</Callout>
```

- `variant`: `default` | `info` | `warning`
- `title`: short label. A STE `WARNING` or `CAUTION` uses this prop
- `children`: the body
- `icon`: optional React node
- `className`: optional

### Terminal

One shell command, with copy.

```mdx
<Terminal command="gh stack sync --prune" title="Terminal" />
```

- `command`: required
- `title`: optional, default `Terminal`
- `className`: optional

A multi-line example stays in a fenced code block.

### Table

```mdx
<Table
  data={{
    headers: ['Column', 'Column'],
    rows: [
      ['Cell', 'Cell'],
    ],
  }}
/>
```

### References

Every new post ends with `<References />`, after the takeaway.

```mdx
<References
  items={[
    { author: 'Author Name', url: 'https://example.com/post' },
    { author: 'Speaker Name', url: 'https://www.youtube.com/watch?v=VIDEO_ID' },
  ]}
/>
```

- Each item is `{ author, url }`. Author is a person or org. URL is the source.
- The list renders as `Author - url`.
- Include every source the post draws on. Talks, essays, docs, videos.
- An empty `items` array renders nothing. Use that only when the post cites nothing.
- Do not invent authors or URLs. Ask when a source is unclear.
- `title` defaults to `References`. `className` is optional.

## Before you write

1. Read `/asd-ste100` and follow it for the body.
2. Skim one post in `apps/www/src/content/posts/` for `Callout`, `Terminal`, and `References`.
3. Draft the body first. Set the title last so it states the result.
4. Put real sources in `<References />` before you ship.
