---
name: blog
description: Write a portfolio blog post. Research before the draft. Shared markdown that only needs the site post format is the blog-template skill.
disable-model-invocation: true
---

# Blog

Write the post a reader can restate after one read.

The user shared the markdown and wants it formatted as a post: read `.agents/skills/blog-template/SKILL.md` and follow that. Skip Research.

## Research

Do this before the draft.

1. Keep the URL, the author, and the fact you will use. The author name goes in `<References />` only. See `references/sources.md`. Do not invent a URL.
2. Cite the page the idea came from. The component is `references/diagram.md`.

## Backticks

In the post, put a filepath or a filename in backticks. That is how the reader spots a file. A concept name, a command, and a component name stay in plain text.

## Post file

- Path: `apps/www/src/content/posts/<slug>.mdx`
- Filename matches the URL slug

### Frontmatter

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

### Markdown

Write valid CommonMark / MDX. `apps/www/mdx-components.tsx` maps these elements:

- Headings `h1`–`h6`
- Paragraphs
- Ordered lists, unordered lists, list items
- Emphasis, strong, strikethrough (`~~deleted~~`)
- Images. `width` and `height` when you know them
- Links. A site path uses the app link. A `#hash` stays on the page. Any other URL opens in a new tab
- Thematic breaks (`---`)
- Fenced code with a language tag, and inline code
- GFM tables
- Blockquotes

## Components

The components you can add are the files in `/references/` whose names are the component. Read the file for the component you add. Skip the rest. They are registered. No import.

| Adding     | Read                      |
| ---------- | ------------------------- |
| Callout    | `/references/callout.md`  |
| Terminal   | `/references/terminal.md` |
| Table      | `/references/table.md`    |
| Diagram    | `/references/diagram.md`  |
| Dialog     | `/references/dialog.md`   |
| References | `/references/sources.md`  |
