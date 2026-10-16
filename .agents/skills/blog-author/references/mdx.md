# Post file

Read this before you write the `.mdx` file.

## Where posts live

- Path: `apps/www/src/content/posts/<slug>.mdx`
- Filename matches the URL slug

## Frontmatter

```yaml
---
title: 'Post title'
summary: 'One sentence for the meta description. Falls back to title when omitted.'
publishedOn: 'DD-MM-YYYY'
version: '1'
image: '/path/to/og.png'
tags:
  - 'tag'
---
```

`image` is optional. `summary` is optional. The page uses `summary` for the description and JSON-LD. The H1 in the body is the visible title. Match it to `title`.

The `summary` sentence is cut from the lead. See Shape in `../SKILL.md`.

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

- One H1. Then `##` for sections, `###` for subsections. Sentence case (rule 17 in `unslop.md`).
- Blank line before and after headings, lists, code fences, and blockquotes.
- `-` for bullets when the items are peers. `1.` for ordered lists when order matters. Nest with 2 spaces.
- `` `inline` ``. Multi-line code in a fence with a language tag. A fence wraps at 100 characters. Set another width on the info string: ` ```tsx wrap=72 `. ` ```tsx wrap=off ` keeps each line on one row.
- `[label](https://example.com)`. A bare URL is the link text only when no label fits.
- `>` only for a real quote.
- Bold and italic inside a sentence. Bold follows rules 15 and 16 in `unslop.md`.
- Use `*` for emphasis. Skip `***`.
- A GFM table for tabular data. Use the `Table` component when you pass `headers` and `rows` as data. See `table.md`.
- A diagram you drew. See Research in `../SKILL.md`. Use the `Diagram` component. See `diagram.md`. The site does not render Mermaid. An image with `width` and `height` is only for a picture you cannot draw as data.
- Delete empty citation placeholders like `[1]` with no source.
