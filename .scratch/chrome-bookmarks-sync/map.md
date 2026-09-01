# Chrome → site bookmarks sync spec

Label: `wayfinder:map`

## Destination

A spec an implementer can follow to ship `bookmarks:sync` (Chrome → `apps/www/src/content/bookmarks.config.json`) and rename `fetch:bookmarks` → `bookmarks:fetch`. The map is done when nothing is left to decide before that spec is written.

## Notes

Domain: Bookmarks on the personal site. Language in `CONTEXT.md` — **Collection** (not folder), **Bookmark** identity is the URL. Chrome folders are a source, not Collections.

Skills every session should consult: `/grilling`, `/domain-modeling`, `/research`, `/prototype`, `CONTEXT.md`.

Standing preferences:

- Commands: `bookmarks:fetch` (today's OG filler, renamed) and `bookmarks:sync` (Chrome import). Grouped under `bookmarks:`.
- Chrome user profile: **Default** only. No profile prompt.
- Top-level Chrome folders: children of every root in Default's Bookmarks file (`bookmark_bar`, `other`, `synced`). A root that holds URLs directly (e.g. Mobile Bookmarks) is selectable as a folder. Nested folders are not independently selectable.
- Selecting a top-level folder **flattens** all descendant URLs into that Collection. `Personal` is a dump if picked.
- One run can select several top-level folders (searchable multi-select via a CLI prompt library).
- Per selected folder: optional Collection title override (default: Chrome folder name); then bookmark multi-select, all checked; uncheck is the veto.
- One-way Chrome → site, **additive**. Diff is new vs already in this Collection vs empty-title fill from Chrome name. No deletes.
- Join key: Chrome folder `guid`, persisted on the Collection. `id` and `name` are curator-owned and never participate in the join. First time a folder has no matching guid: create new Collection vs attach to an existing one.
- Create-new Collection `id` is the kebab slug of the confirmed Collection title (title-override prompt, defaulting to the Chrome folder name). Later title edits and later syncs never rewrite it. Attach keeps the existing Collection's `id`.
- Empty `title` gets the Chrome bookmark name. Never overwrite a title already set. Images stay `bookmarks:fetch`.
- Every successful `bookmarks:sync` write then runs `bookmarks:fetch`. JSON is already written if fetch fails; inherit fetch's exit code.
- Within a Collection, URL is unique; flatten dedupes (first Chrome-walk wins). Bookmark order is Chrome walk order.
- Description is not set by sync (empty or left as-is). Curator edits JSON.
- This effort produces the spec. It does not ship the commands.

## Decisions so far

- [Does Chrome folder guid survive rename and stay joinable?](./issues/01-chrome-bookmarks-file-guid.md) — yes: persist JSON `guid`; not numeric `id`; recreate = new guid
- [Which CLI prompt library can drive searchable multi-select for sync?](./issues/02-cli-prompt-library.md) — `@clack/prompts` 1.x (`autocompleteMultiselect`, `text`, `confirm`)
- [How is Collection id chosen on create-new?](https://github.com/cypherkunp/portfolio/issues/9) — kebab slug of the confirmed Collection title; never rewritten after first write


## Not yet specified

- Spec shape (sections, examples, handoff path) once research and the prototype have something to point at.

## Out of scope

- Writing bookmarks back to Chrome.
- Chrome user profiles other than Default (`Profile 1`, `Profile 2`, Guest).
- Brave, Arc, Firefox, Chromium, Chrome Canary as extra browsers.
- A Chrome extension.
- Nested Chrome folder as its own Collection.
- Sync deleting site bookmarks.
- Changing Collection `id` / route when the Collection title is overridden.
