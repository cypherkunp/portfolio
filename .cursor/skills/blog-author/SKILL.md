---
name: blog-author
description: Write or edit portfolio blog posts in Devvrat's voice. Use when drafting MDX posts, rewriting blog copy, or when the user asks to write a blog, article, or post for apps/www.
disable-model-invocation: true
---

# Blog author

Write blog posts in Devvrat's voice. Style source of truth: `apps/www/src/content/posts/handbook.mdx`.

## Where posts live

- Path: `apps/www/src/content/posts/<slug>.mdx`
- Filename matches the URL slug

## Frontmatter

```yaml
---
title: 'Post title'
publishedOn: 'YYYY-MM-DD'
version: '1'
tags:
  - 'tag'
---
```

## Voice

- Soft but assertive. Kind. Clear. Direct.
- First person when it is personal experience. "I" not "we".
- Talk like a human. No marketing fluff. No corporate speak.
- Confident. No hedging ("I think", "maybe", "could").
- Simple English. Clarity beats perfect grammar.
- Short sentences. One idea per sentence.
- Prefer "you" when teaching the reader.
- Concrete over vague. Show examples. Name real tools and products.

## Format rules

- Prefer bullet points. Nest with real headings or indented lists, not bold fake headings.
- Use `X > Y > Z` for ranked tradeoffs.
- Never use hyphens or dashes as sentence punctuation. Rewrite with a period, comma, or new sentence. Compound words like "late night" stay as separate words when possible.
- No em dashes. No en dashes. No hyphenated asides.
- Sentence case headings. Not Title Case.
- Skip LLM filler: "Let's dive in", "In conclusion", "Hope this helps", "In today's world".
- Skip banned fluff words from the project writing rules when they add nothing.

## Markdown

Write valid CommonMark / MDX. Broken markdown ships broken HTML.

- Headings: use `#` / `##` / `###`. Never use `**Bold line**` as a heading.
- One H1 per post. Match the title. Then `##` for sections, `###` for subsections.
- Blank line before and after headings, lists, code fences, and blockquotes.
- Lists: `-` for bullets, `1.` for ordered. Nest with 2 spaces.
- Inline code: `` `like this` ``. Multi line code: fenced blocks with a language tag.
- Examples and commands go in fenced code blocks, not blockquotes.
- Blockquotes (`>`) only for real quotes.
- Links: `[label](https://example.com)`. Never paste a bare URL as the only link text when a label fits.
- Bold and italic for emphasis inside a sentence. Not for structure.
- Do not mix HTML and markdown for the same job. Use existing MDX components (`Terminal`, etc.) when the post needs them.
- Frontmatter is YAML. Keep it valid. Quoting strings is fine.

## Structure

1. Open with the problem or the promise. One short paragraph.
2. Give the answer early. Do not bury it.
3. Break the rest into sections with bullets.
4. End with a direct takeaway. No summary essay closer.

## Before you write

1. Read `apps/www/src/content/posts/handbook.mdx` for tone.
2. Skim one nearby post in `apps/www/src/content/posts/` for MDX patterns (`Terminal` components, spacing, links).
3. Draft the body first. Iterate the title last so it makes a clear promise.
