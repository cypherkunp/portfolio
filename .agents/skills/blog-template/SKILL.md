---
name: blog-template
description: Format markdown the user already shared into a site post file, using the blog post format and components. Use when the user shares a draft and asks to format it, template it, or turn it into a post for this site.
disable-model-invocation: true
---

# Blog template

The markdown the user shared is the post. Format it into the site post file. Keep their sentences.

The shared markdown is the only source. Add no fact, source, URL, or example that it does not already contain. Do not do any research.

## Read

Read `.agents/skills/blog/SKILL.md` for Backticks, Post file, and Markdown. Skip its Research section.

Read a component file only for a component you add. Skip the rest. Files are in `.agents/skills/blog/references/`. They are registered. No import.

| Adding     | Read                     |
| ---------- | ------------------------ |
| Callout    | `references/callout.md`  |
| Terminal   | `references/terminal.md` |
| Table      | `references/table.md`    |
| Diagram    | `references/diagram.md`  |
| Dialog     | `references/dialog.md`   |
| References | `references/sources.md`  |

## Write the file

Done when `apps/www/src/content/posts/<slug>.mdx` exists, the filename is the slug, and the frontmatter matches the blog skill.

- Slug is the kebab-case of `title`. Stop if that file already exists.
- `title` is the shared markdown's title. The body H1 matches it.
- `summary` is one sentence already in the markdown, or omit it.
- `publishedOn` is a `DD-MM-YYYY` date already in the markdown, or today.
- `version` is `'1'`.
- `tags` are the tags the markdown already lists. If it lists none, use one to three subject words already in the markdown.
- `image` only when the markdown already has one.

## Format

Keep the order and the wording. Change a block only when a component file's When matches that block.

- A filepath or a filename goes in backticks. A concept name, a command, and a component name stay in plain text.
- One shell command the reader copies becomes `Terminal`.
- A caution or a note that matches `callout.md` becomes `Callout`.
- A GFM table stays a GFM table.
- A figure already in the markdown becomes `Diagram` only when a `kind` in `diagram.md` fits its labels. Leave the fence when none fits.
- A repeated table or sample becomes `Dialog` only when `dialog.md` says that block belongs in the panel.
- Each source the markdown already names, with its URL, goes in `References` at the end. Omit `References` when the markdown cites nothing.

## Done

The file is valid MDX. Every component you added had its reference file read. The body has no sentence the shared markdown did not already contain.
