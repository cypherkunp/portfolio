---
name: blog
description: Write a portfolio blog post. Explain each concept with the asd-ste100 skill.
disable-model-invocation: false
---

# Blog

Write the post a reader can restate after one read.

## Research

Do this before the draft.

1. Search the web for the topic. Read the strongest official docs, tutorials, and blog posts. Prefer a primary source over a roundup.
2. When the user gives a URL, read that page. Then open every relevant link on it: docs, tutorials, related posts, and cited sources. Skip nav, footer, login, and off-topic links.
3. One hop from each provided URL. Follow a second hop only when the first page is a list of links.
4. Keep the URL, the author, and the fact you will use. The author name goes in `<References />` only. See `references/sources.md`. Do not invent a URL.
5. Study the diagrams on the pages you read. Note the flow, the structure, or the sequence they show.
6. In the draft, draw your own diagram when a picture explains a concept faster than a paragraph. Do not copy a source diagram. Cite the page the idea came from. The component is `references/diagram.md`.

## Explain the concept

Write the blog using `asd-ste100`. The reader may not have English as a first language, so keep the fact and shorten the grammar. A concept is a description: one subject in the sentence, topic sentence first. A step the reader must do is a procedure: imperative, one action.

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
- Links. A site path uses `next/link`. A `#hash` stays on the page. Any other URL opens in a new tab
- Thematic breaks (`---`)
- Fenced code with a language tag, and inline code
- GFM tables
- Blockquotes

## Components

The components you can add are the files in `/references/` whose names are the component. Read the file for the component you add. Skip the rest. They are registered. No import.

| Adding     | Read                     |
| ---------- | ------------------------ |
| Callout    | `/references/callout.md` |
| Terminal   | `/terminal.md`           |
| Table      | `/references/table.md`   |
| Diagram    | `/references/diagram.md` |
| Dialog     | `/references/dialog.md`  |
| References | `/references/sources.md` |
