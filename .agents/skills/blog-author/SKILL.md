---
name: blog-author
description: >-
  Write or edit portfolio blog posts as MDX in apps/www. Use when drafting a
  post, rewriting blog copy, or when the user asks for a blog, article, or
  post. Research the topic on the web before the draft. Prose follows the
  unslop rules in this skill. This skill covers the post file, markdown,
  and MDX components.
disable-model-invocation: true
---

# Blog author

Research the topic, draft the post, then edit the prose against every unslop rule below. Scan the rules, then rewrite each hit. Preserve meaning and match the voice in this skill.

Unslop applies to prose. Code fences, URLs, and MDX tags keep their syntax.

Rule numbers are stable ids. A removed rule leaves a gap.

## Research

Do this before the draft.

1. Search the web for the topic. Read the strongest official docs, tutorials, and blog posts. Prefer a primary source over a roundup.
2. When the user gives a URL, read that page. Then open every relevant link on it: docs, tutorials, related posts, and cited sources. Skip nav, footer, login, and off-topic links.
3. One hop from each provided URL. Follow a second hop only when the first page is a list of links.
4. Keep the URL, the author, and the fact you will use. The author name goes in `<References />` only. See References. Do not invent a URL.
5. Study the diagrams on the pages you read. Note the flow, the structure, or the sequence they show.
6. In the draft, draw your own diagram when a picture explains a concept faster than a paragraph. Do not copy a source diagram. Cite the page the idea came from.

Done when you can name the mechanism, the tradeoff, and the source for each claim you plan to make, you have read every user-supplied URL plus the relevant links and diagrams on those pages, and the draft has your own diagram for each concept that needs one.

## Voice

- Write like humans speak. Skip corporate jargon and marketing fluff.
- Be confident and direct.
- Say what something is.
- Say "you" more than "we" when addressing external audiences.
- Use contractions like "I'll," "won't," and "can't."
- Use a real product in examples. Skip `foo` / `bar` / `baz`.

## Title creation

- Make a promise in the title so readers know what they get if they click.
- Tap into a controversial point the audience holds and back it up with data. Skip clickbait.
- Share something uniquely helpful that makes readers better at a meaningful part of their work.
- Skip vague titles like "My Thoughts On XYZ." Titles are opinions or shareable facts.
- Write a placeholder title first, finish the content, then iterate the title.
- Sentence case. See rule 17.

## Unslop

### Content

3. **Superficial -ing phrases.** "highlighting...", "ensuring...", "reflecting...", "showcasing...", "fostering...". Delete or expand with real sources.
4. **Vague attributions.** "Experts believe", "Industry reports suggest", "Some critics argue". Name the source or delete.

### Language

7. **AI vocabulary.** Additionally, crucial, delve, enduring, enhance, fostering, garner, interplay, intricate, landscape (abstract), pivotal, showcase, tapestry (abstract), testament, underscore, vibrant. Replace with plain words.
8. **Fancy ways to say "is".** "serves as", "stands as", "boasts", "features". Say "is" or "has".
9. **"Not just X, but Y."** State the point directly instead.
10. **Rule of three.** Don't force ideas into groups of three. Use the natural number.
11. **Synonym cycling.** Protagonist, main character, central figure, hero all in one paragraph. Pick one, repeat it.
12. **False ranges.** "from X to Y" where X and Y aren't on a meaningful scale. List topics directly.

### Style

13. **Em dash overuse.** Avoid em dashes entirely. Use periods or commas only (no parentheses, no en dashes, no hyphen-as-dash substitutes). If a thought needs separation, end the sentence or use a comma.
14. **Colon overuse.** Colons are fine before a list or example, not as mid-sentence connectors. "If you're coming from traditional automation: instead of registering event handlers, you describe conditions" adds nothing with the colon. Rewrite to let the point stand on its own without comparison framing. "Describing when the scheduler should fire works best as plain English." Same meaning, no crutch punctuation.
15. **Boldface overuse.** Don't bold every proper noun or acronym.
16. **Inline-header lists.** The tell is a bold label and colon that restates the line: "**Performance:** Performance improved...". Convert those to prose. A bold lead-in that ends in a period, names the item, and is followed by genuinely new detail ("**Schema in TypeScript.** Tables live in one file.") is fine, not a tell.
17. **Title case headings.** Use sentence case.
18. **Decorative emojis.** Remove from headings and bullets.
19. **Curly quotes.** Use straight quotes.

### Communication artifacts

20. **Chatbot phrases.** "I hope this helps!", "Let me know if...", "Of course!", "Certainly!", "Found the smoking gun!" Remove.
21. **Sycophantic tone.** "Great question! You're absolutely right!" Respond directly.

### Filler

23. **Filler phrases.** "In order to" becomes "To". "Due to the fact that" becomes "Because". Delete "It is important to note that".
24. **Excessive hedging.** "could potentially possibly be argued that it might" becomes "may".
25. **Generic conclusions.** "The future looks bright." State specific plans or facts.

### Jargon

26. **Abstract metaphor nouns.** Substrate (base), wedge, wedge in (add), vector (way, method), locus, vantage, nexus, primitive as a noun, harness as a metaphor, surface as in "API surface", bedrock, scaffolding as a metaphor, modality, paradigm, gold-plating (more than the job needs), ratchet as a metaphor (the mechanism's real name, or a limit that only tightens), evacuate for moving code (move out), endgame (the last phase), north star, flywheel. These read as technical but usually have a plainer concrete word. Pick the concrete word.

### Plain speech

27. **Say what it does, not how it feels.** "the database stays close at hand", "SQL you can read", "types that follow your schema" name a feeling. The fix names the mechanism or a number: "`.toSQL()` returns the exact string sent to the database", "a column rename fails the build". Ask what the sentence tells the reader to do or know, then write that. If you can't restate it as a concrete instruction, fact, or number, cut it. One more check: if the sentence could appear unchanged in another project's docs, it says nothing about this one. Cut it.
28. **Shorten or split dense sentences.** If the reader has to backtrack to parse a sentence, break it in two or drop clauses. One idea per sentence.
29. **Active voice.** Prefer it. Catch "is/are/was/were + past participle" and name the actor: "queries are validated" becomes "the compiler validates queries", "the file is parsed by the loader" becomes "the loader parses the file". Passive is fine only when the actor is unknown or genuinely doesn't matter.
30. **Cut adverbs, or use a stronger verb.** "runs quickly" becomes "is fast" or the number, and "significantly improves" becomes the measured delta. An adverb propping up a weak verb means the verb is wrong.
31. **Prefer the plain word.** "utilize" and "leverage" become "use", "facilitate" becomes "help", "numerous" becomes "many", "in the event that" becomes "if". The fancier synonym is rarely clearer.
32. **Mannered prose.** Metaphor or flourish where a literal phrase exists: aphorisms ("wire it or delete it"), rhetorical fragments for effect, personified code ("the plan holds it"), figurative verbs ("rides along", "stands on"), stock framing phrases. "A dial worth turning" becomes "a parameter worth varying". Say what you mean. Rule 26 covers the metaphor nouns.
33. **Over-compression.** Dropped articles, verbless fragments, symbol-speak, and abbreviations that make the reader decode instead of read. "Parser rejects bad date → exit 2, no write" becomes "The parser rejects a bad date, exits with code 2, and writes nothing." Write whole sentences with their articles and verbs, and spell out arrows and abbreviations.

Also cut these. They are not numbered rules.

- "Let's dive into..."
- Cliché intros: "In today's fast-paced digital world", "In the ever-evolving landscape of."
- Self-referential lines: "As an AI", "I'm here to help you with."
- Essay closers: "In conclusion,", "Overall,", "To summarize."
- Stacked transitions: "Furthermore,", "Moreover,". "Additionally" is rule 7.
- Symmetrical lists that start "Firstly... Secondly...."
- Non-breaking spaces in pasted text.

## Punctuation

- Use the Oxford comma.
- Use an exclamation point rarely.
- A sentence can start with "But" or "And." Do not stack them.
- Dashes, parentheses, and en dashes in prose: rule 13.
- Quotes in prose: rule 19.

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

- One H1. Then `##` for sections, `###` for subsections. Sentence case (rule 17).
- Blank line before and after headings, lists, code fences, and blockquotes.
- `-` for bullets when the items are peers. `1.` for ordered lists when order matters. Nest with 2 spaces.
- `` `inline` ``. Multi-line code in a fence with a language tag. A fence wraps at 100 characters. Set another width on the info string: ` ```tsx wrap=72 `. ` ```tsx wrap=off ` keeps each line on one row.
- `[label](https://example.com)`. A bare URL is the link text only when no label fits.
- `>` only for a real quote.
- Bold and italic inside a sentence. Bold follows rules 15 and 16.
- Use `*` for emphasis. Skip `***`.
- A GFM table for tabular data. Use the `Table` component when you pass `headers` and `rows` as data.
- A diagram you drew. See Research. Use the `Diagram` component. The site does not render Mermaid. An image with `width` and `height` is only for a picture you cannot draw as data.
- Delete empty citation placeholders like `[1]` with no source.

## Components

Registered in `apps/www/mdx-components.tsx`. No import.

### Callout

```mdx
<Callout variant="warning" title="CAUTION">
  Command or condition. Then the result.
</Callout>
```

- `variant`: `default` | `info` | `warning`
- `title`: short label. A `WARNING` or `CAUTION` uses this prop
- `children`: the body
- `icon`: optional React node
- `className`: optional

When:

- `warning` and title `CAUTION` when the next action can break the work, lose data, or fail the page. First sentence is the command or the condition. Next sentence is the result.
- `info` and title `NOTE` when a limit changes how to read the paragraph above. The reader can skip it and still follow the steps, but will misread a number or a comparison.
- `default` for a short labeled aside that is not a hazard and not a note. Rare.
- A normal fact stays in the paragraph. A callout is not a highlight.

### Terminal

One shell command, with copy.

```mdx
<Terminal command="gh stack sync --prune" title="Terminal" />
```

- `command`: required. One command the reader runs now.
- `title`: optional, default `Terminal`. Set it only when that label is wrong.
- `className`: optional

When the reader should copy one command, use `Terminal`. A session, command output, or more than one command stays in a fenced code block.

### Table

```mdx
<Table
  data={{
    headers: ['Column', 'Column'],
    rows: [['Cell', 'Cell']],
  }}
/>
```

### Diagram

A drawn figure. No import. The site does not render Mermaid.

```mdx
<Diagram
  kind="timeline"
  title="Where the time goes"
  start="navigation start"
  end="LCP"
  segments={[
    { label: 'TTFB', share: 'about 40%', weight: 40, tone: 'work' },
    { label: 'resource load delay', share: 'under 10%', weight: 10, tone: 'wait' },
  ]}
/>
```

- `kind`: `scale` | `rows` | `flow` | `timeline` | `shift` | `windows` | `bars`
- `title`: the caption in the frame
- `notes`: optional lines under the figure
- `scale` marks one point on a track. `markAt` is 0 to 100, default 75. Optional `rows` sit under the track.
- `rows` is a label and a value. `tone` `pass` underlines the value. `tone` `fail` mutes it.
- `flow` is ordered steps. One step can set `current`, with `marker` under that step.
- `timeline` segments use `weight` for width. `tone` `wait` is a dashed box.
- `shift` draws before and after boxes. `tone` is `shift`, `still`, or `span`. The score line is `impact x distance = score`.
- `windows` is a run of shifts. One window sets `largest`.
- `bars` draws task length against `threshold`. `blocking` is the part past the mark.

Use `Diagram` when a picture is faster than a paragraph. A fenced `txt` block is code, not a figure.

### Dialog

A panel the reader opens. The pieces are `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, and `DialogDescription` from `packages/ui/src/components/dialog.tsx`. No import. The panel already has the overlay and the close control.

```mdx
<Dialog>
  <DialogTrigger>Part shares</DialogTrigger>
  <DialogContent className="max-w-3xl">
    <DialogHeader>
      <DialogTitle>Where an LCP time goes</DialogTitle>
      <DialogDescription>
        The same four parts as the figure, with the tuned-page share.
      </DialogDescription>
    </DialogHeader>
    <Table
      data={{
        headers: ['Part', 'Share on a tuned page', 'What the part is'],
        rows: [['Time to first byte', 'About 40%', 'Wait for the first HTML byte']],
      }}
    />
  </DialogContent>
</Dialog>
```

- `DialogTrigger` names the panel. `Part shares` is a label. It already renders as a text link.
- `DialogTitle` is required. It is the accessible name.
- `DialogDescription` is required. One sentence on what the panel holds.
- `className="max-w-3xl"` on `DialogContent` when the panel holds a table, a diagram, or a fence. The default width is `max-w-lg`.
- A fence in the panel needs a blank line after the opening `DialogContent` tag.
- Skip `DialogFooter` and `DialogClose`. The panel already closes.

When, tested against `apps/www/src/content/posts/web-vitals.mdx`:

- The paragraph already states the fact, and the section still reads with the panel shut. The panel is the check.
- A table that repeats a figure goes in the panel. In that post the LCP timeline stays on the page. The share table under it is the panel.
- A sample that repeats numbered steps goes in the panel. The measure-then-fix list stays on the page. The `web-vitals` send snippet is the panel. The same split applies to an HTML, CSS, or JS sample under a numbered fix.
- A figure the next sentence points at stays on the page. The 75th-visit scale, the metric phases, the interaction timeline, the shift drawing, the session windows, and the blocking-time bars stay on the page.
- The band table stays on the page. Later sections quote those numbers.
- A caution or a note stays in `Callout`. One command stays in `Terminal`.

Place the trigger at the end of the paragraph it supports.

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

- Use it at the end of every post that drew on a source, after the takeaway. One item per source you used. Omit it only when the post cites nothing.
- Each item is `{ author, url }`. Author is a person or org. URL is the source.
- Name a source author only here. The body states the fact. It does not name the person or the org, and it does not say who published it.
- The list renders as `Author - url`.
- Include every source the post draws on. Talks, essays, docs, videos.
- An empty `items` array renders nothing. Use that only when the post cites nothing.
- Do not invent authors or URLs. Ask when a source is unclear.
- `title` defaults to `References`. `className` is optional.

## Before you ship

1. Research. See Research.
2. Draft the body. Iterate the title last. See Title creation.
3. Scan rules 3, 4, 7–21, 23–33, and the unnumbered cuts under Unslop. Rewrite every hit.
4. Put the sources from Research in `<References />`. Source authors appear only there.

Done when Research is done, every rule in step 3 has been checked, no source author is named in the body, and the meaning of the draft is still intact.
