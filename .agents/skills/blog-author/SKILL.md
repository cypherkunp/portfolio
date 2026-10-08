---
name: blog-author
description: >-
  Write or edit portfolio blog posts as MDX in apps/www. Use when drafting a
  post, rewriting blog copy, or when the user asks for a blog, article, or
  post. Prose follows the asd-ste100 skill, then the voice rules in this
  skill. This skill covers the post file, markdown, and MDX components.
disable-model-invocation: true
---

# Blog author

Write every sentence with the `asd-ste100` skill. Read and follow `/asd-ste100` before the draft. Then apply the voice rules below. Where they disagree, follow this skill.

## Voice and tone

- Write like humans speak. Skip corporate jargon and marketing fluff.
- Be confident and direct. Skip softening phrases like "I think," "maybe," or "could."
- Use active voice.
- Use positive phrasing. Say what something is rather than what it isn't.
- Say "you" more than "we" when addressing external audiences.
- Use contractions like "I'll," "won't," and "can't."

## Specificity and evidence

- Be specific with facts and data. Skip vague superlatives.
- Back up claims with concrete examples or metrics.
- Highlight customers and community members over company achievements.
- Use realistic, product-based examples. Skip `foo` / `bar` / `baz` in code.
- Make content concrete, visual, and falsifiable.

## Title creation

- Make a promise in the title so readers know what they get if they click.
- Tap into a controversial point the audience holds and back it up with data. Skip clickbait.
- Share something uniquely helpful that makes readers better at a meaningful part of their work.
- Skip vague titles like "My Thoughts On XYZ." Titles are opinions or shareable facts.
- Write a placeholder title first, finish the content, then iterate the title.

## Banned words

| Word | Replacement |
| --- | --- |
| a bit | remove |
| a little | remove |
| actually / actual | remove |
| agile | remove |
| arguably | remove |
| assistance | help |
| attempt | try |
| battle tested | remove |
| best practices | proven approaches |
| blazing fast / lightning fast | build XX% faster |
| business logic | remove |
| cognitive load | remove |
| commence | start |
| delve | go into |
| disrupt / disruptive | remove |
| facilitate | help or ease |
| game-changing | name the specific benefit |
| great | remove or be specific |
| implement | do |
| individual | man or woman |
| initial | first |
| innovative | remove |
| just | remove |
| leverage | use |
| mission-critical | important |
| modern / modernized | remove |
| numerous | many |
| out of the box | remove |
| performant | fast and reliable |
| pretty / quite / rather / really / very | remove |
| referred to as | called |
| remainder | rest |
| robust | strong |
| seamless / seamlessly | automatic |
| sufficient | enough |
| that | remove when the sentence still holds |
| thing | name the thing |
| utilize | use |
| webinar | online event |

## LLM patterns

- Replace an em dash with a semicolon, a comma, or a new sentence.
- Skip openers like "Great question" and "Let me help you."
- Skip "Let's dive into..."
- Skip cliché intros like "In today's fast-paced digital world" and "In the ever-evolving landscape of."
- Skip "it's not just [x], it's [y]."
- Skip self-referential disclaimers like "As an AI" and "I'm here to help you with."
- Skip essay closers: "In conclusion," "Overall," "To summarize."
- Use a bullet list when the items are peers. Use a numbered list when order matters.
- Skip closers like "Hope this helps!"
- Skip stacked transitions: "Furthermore," "Additionally," "Moreover."
- Replace "In conclusion" with the statement.
- Skip hedge words ("might," "perhaps," "potentially") unless the uncertainty is real.
- Skip stacked hedges: "may potentially," "it's important to note that."
- Skip symmetrical lists that start "Firstly... Secondly...."
- Sentence case headings.
- Strip Unicode artifacts from pasted text: smart quotes, em dashes, non-breaking spaces.
- Use `*` for emphasis. Skip `***`.
- Delete empty citation placeholders like `[1]` with no source.

## Punctuation

- Use the Oxford comma.
- Use an exclamation point rarely.
- A sentence can start with "But" or "And." Do not stack them.
- Use a period instead of a comma when the clause can stand alone.

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

1. Read `/asd-ste100` and follow it for the body. Then apply Voice and tone through Punctuation in this skill.
2. Skim one post in `apps/www/src/content/posts/` for `Callout`, `Terminal`, and `References`.
3. Draft the body first. Iterate the title last. See Title creation.
4. Put real sources in `<References />` before you ship.
