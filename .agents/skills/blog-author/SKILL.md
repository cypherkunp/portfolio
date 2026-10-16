---
name: blog-author
description: >-
  Write or edit a portfolio blog post as MDX. The post opens with a short
  lead, then explains each concept as what, why, how, and when, in words a
  new reader can restate. Research the topic first. Prose follows the unslop
  rules in this skill.
disable-model-invocation: true
---

# Blog author

This file is the order of work. A file in `references/` is lookup. Read it when a step names it, and skip the ones that step does not name.

## Order

1. Research. Finish the done line before you draft.
2. Read `references/mdx.md`. Draft the lead, then the sections. Each concept gets What, Why, How, and When where those parts apply. See Shape.
3. Read one component file when you add that component. Skip the rest. They are registered in `apps/www/mdx-components.tsx`. No import.

   | Adding | Read |
   | --- | --- |
   | `Callout` | `references/callout.md` |
   | `Terminal` | `references/terminal.md` |
   | `Table` | `references/table.md` |
   | `Diagram` | `references/diagram.md` |
   | `Dialog` | `references/dialog.md` |

4. Iterate the title last. See Title creation.
5. Read `references/unslop.md`. Rewrite every hit.
6. Read `references/sources.md`. Put the sources in `<References />`. Author names appear only there.
7. Read the lead against the `##` headings. Read each concept as a newcomer. See Shape.

Done when Research is done, the lead names every section topic, each concept passes the newcomer test, every rule in `references/unslop.md` has been checked, no source author is named in the body, and the meaning of the draft is still intact.

## Research

Do this before the draft.

1. Search the web for the topic. Read the strongest official docs, tutorials, and blog posts. Prefer a primary source over a roundup.
2. When the user gives a URL, read that page. Then open every relevant link on it: docs, tutorials, related posts, and cited sources. Skip nav, footer, login, and off-topic links.
3. One hop from each provided URL. Follow a second hop only when the first page is a list of links.
4. Keep the URL, the author, and the fact you will use. The author name goes in `<References />` only. See `references/sources.md`. Do not invent a URL.
5. Study the diagrams on the pages you read. Note the flow, the structure, or the sequence they show.
6. In the draft, draw your own diagram when a picture explains a concept faster than a paragraph. Do not copy a source diagram. Cite the page the idea came from. The component is `references/diagram.md`.

Done when you can name the mechanism, the tradeoff, and the source for each claim you plan to make, you have read every user-supplied URL plus the relevant links and diagrams on those pages, and the draft has your own diagram for each concept that needs one.

## Voice

- Write like humans speak. Skip corporate jargon and marketing fluff.
- Be confident and direct.
- Say what something is.
- Say "you" more than "we" when addressing external audiences.
- Use contractions like "I'll," "won't," and "can't."
- Use a real product in examples. Skip `foo` / `bar` / `baz`.

## Shape

A reader decides in the first lines whether this is the post they opened. The lead is that decision. The sections then earn each item the lead named. A concept gets four parts, in order, so someone who has never met the topic can restate it without guessing which reading you meant.

### Lead

The first paragraphs after the H1 are the lead. Two or three sentences. Name the topic, the question or the cost, and every point the later sections will expand. A reader who stops there can say what the post is about. They should not yet be able to do the work. The sections do that.

Write the lead before the sections. When you add a section, add that topic to the lead in the same words the heading will use.

The frontmatter `summary` is one sentence taken from the lead. Same claim. It is the meta description, not a second intro. The field lives in `references/mdx.md`.

Done when every `##` topic appears in the lead, and the lead does not teach a step.

### Concepts

Use this when the post explains a concept. A how-to step that is only a command does not need all four parts. The concept that the command depends on does.

Give the parts in this order. A short concept is four short paragraphs under one heading. Give a part its own heading only when that part is long enough to stand alone.

1. **What.** One sentence a new reader can repeat. Say the thing in words they already have, then give the name.
2. **Why.** The problem it solves, or the cost of skipping it. Use a concrete cost.
3. **How.** The mechanism. Name who acts, what they do, and what comes back. One example with a real product or a real number.
4. **When.** The condition for using it, and the condition for leaving it out.

What and How stay. Fold Why into the lead when the lead already states that cost. Fold When into How when there is only one situation. In your check, name the sentence that covers a folded part, so a missing part is a choice.

This order gives the reader a handle, a reason to care, a mechanism they can follow, and a boundary so they do not apply the idea everywhere.

Done when you can point at the sentence for What and the sentence for How, and at Why and When or at the sentence that already covers them.

### One reading

Write so a person who has not seen this topic can restate each section. Define a term in the sentence that introduces it, before a later sentence depends on that term. Keep one meaning for that term for the whole post (rule 11 in `references/unslop.md`). If a sentence has two readings, rewrite it until one remains. A pronoun points at one noun in the previous sentence.

Rules 27, 28, and 33 in `references/unslop.md` still apply. The extra test is the newcomer: they can answer what it is, why it is there, how it works, and when to use it, without asking what a word meant.

Done when that test passes for every concept in the post.

## Title creation

- Make a promise in the title so readers know what they get if they click.
- Tap into a controversial point the audience holds and back it up with data. Skip clickbait.
- Share something uniquely helpful that makes readers better at a meaningful part of their work.
- Skip vague titles like "My Thoughts On XYZ." Titles are opinions or shareable facts.
- Write a placeholder title first, finish the content, then iterate the title.
- Sentence case. Rule 17 in `references/unslop.md`.
