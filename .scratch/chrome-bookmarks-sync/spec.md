# Spec: `bookmarks:sync` and `bookmarks:fetch`

Implementer spec. Do not invent product behaviour past this file. Language: **Collection** / **Bookmark** (`CONTEXT.md`). Chrome folders are a source, not Collections.

Handoff: this file. Prototype feel (do not copy the script): branch `prototype/bookmarks-sync`, `pnpm --filter www prototype:bookmarks-sync -- --fixture`.

## Commands

| Script | Meaning |
| --- | --- |
| `bookmarks:sync` | Read Chrome Default, prompt, write the bookmarks config, then run `bookmarks:fetch` |
| `bookmarks:fetch` | Today's OG title/image fill, renamed from `fetch:bookmarks` |

`pnpm --filter www bookmarks:sync` / `bookmarks:fetch`. Drop `fetch:bookmarks`. Grouped under `bookmarks:`.

`@clack/prompts` **1.x** (`autocompleteMultiselect`, `autocomplete`, `select`, `text`, `confirm`, `isCancel`). Not 0.11.

## Chrome Default

Profile **Default** only. No profile prompt.

macOS path:

`~/Library/Application Support/Google/Chrome/Default/Bookmarks`

JSON: `version` `1`, `roots` with `bookmark_bar`, `other`, `synced`. Nodes: `type` `url` | `folder`, `guid` (lowercase UUID string), `id` (numeric string — **never join on this**), `name`, `url` (url nodes), `children` (folder nodes).

Missing file: error and exit. Do not fall back to other profiles or `AccountBookmarks`.

## Top-level folders

A **top-level folder** is:

1. Every `type === "folder"` child of `bookmark_bar`, `other`, and `synced`.
2. The root itself, when that root has any direct `type === "url"` children (Mobile Bookmarks). Use that node's `guid` from the file, not Chromium's well-known factory UUIDs.

Nested folders are not independently selectable. Hint in the picker: `{n} bookmarks · {root name}`.

## Flatten

Selecting a top-level folder walks all descendant URL nodes in Chrome order. First walk wins on duplicate URL. `Personal` is a dump if picked.

Bookmark identity is the URL. Chrome `name` is only used as the empty-`title` fill.

## Join

Optional Collection field `chromeGuid`: Chrome folder `guid` string. Sibling of `id` / `name` / `description` / `bookmarks`. Absent = never joined.

`$schema` must mention it as owned by `bookmarks:sync`. Leave it unless attaching. `bookmarks:fetch` **must round-trip** `chromeGuid` (today's fetch reconstructs Collection objects and would wipe it).

`id` and `name` never participate in the join. Recreating a Chrome folder is a new `guid` → treated as a new Collection.

Match: selected folder `guid` === Collection `chromeGuid`.

## Create vs attach

No match:

- **Create new Collection** (default)
- **Attach to an existing Collection**

Attach: keep that Collection's `id`, write `chromeGuid`. Title prompt defaults to the existing Collection **name** (do not surprise-rename).

Create: title prompt defaults to the Chrome folder name. Collection `id` is the kebab slug of the **confirmed title** (lowercase, non-alphanumeric → `-`, collapse, strip edges; empty → `collection`). After first write, title edits and later syncs never rewrite `id`.

### Slug collision (create, curator did not attach)

Refuse the create. Do not suffix. Do not force-attach. This folder only; the rest of the run continues.

Recovery:

1. Attach to the Collection that owns that `id`
2. Change the Collection title and re-slug (collide again → this prompt again)
3. Skip this folder

## Prompts

Ctrl-C after any prompt: `Stopped.` Exit 0. `isCancel` after every prompt.

| Step | Copy | Behaviour |
| --- | --- | --- |
| intro | `bookmarks:sync` | — |
| folders | `Chrome folders to sync` | searchable multi-select, **starts empty**, required. Placeholder `Type to search…`. Hint `{n} bookmarks · {root}` |
| unmatched | `No Collection is joined to {folder}.` | Create new Collection (default) / Attach to an existing Collection |
| attach | `Attach {folder} to` | searchable single-select of Collections |
| collision | slug `{id}` already exists | Attach / Change title / Skip (this folder) |
| title | `Collection title` | create: default Chrome folder name. attach: default existing Collection name |
| bookmarks | `Bookmarks in {title}` | searchable multi-select, **all checked**, uncheck to skip. Placeholder `Type to search…  uncheck to skip`. Label = Chrome name, hint = hostname, never print the URL |
| confirm | `Write these changes?` | default yes |

One combined confirm for the whole run.

## Diff

Always show all three buckets. Additive only. No delete rows. Cap listed rows at 8, then `… N more`. Rows: Chrome name + hostname, never the URL.

```
{folder name}  →  {collection id}  (create|attach)
  + {n} new
      {chrome name}  {hostname}
  · {n} already in this Collection
  ~ {n} title fill
```

| Bucket | When |
| --- | --- |
| `+ new` | URL not in this Collection |
| `· already in this Collection` | URL present and `title` already set |
| `~ title fill` | URL present and `title` empty → Chrome bookmark name |

Never overwrite a non-empty `title`. Images are not in this diff.

## Write

On confirm:

- Create: append Collection `{ id, name: confirmed title, chromeGuid, description: "", bookmarks: [{ url, title: chrome name }] }` in Chrome walk order among the new URLs. Do not set description later; curator edits JSON.
- Attach: set `chromeGuid` if missing; append new URLs; fill empty titles from Chrome names; leave description, existing titles, images, `id` alone.
- Unchecked URLs: no-op (not deletes).
- URLs already in the Collection and not re-selected: stay.

Then run `bookmarks:fetch`. JSON is already written if fetch fails. Inherit fetch's exit code.

## `bookmarks:fetch`

Same behaviour as today's OG filler, plus:

- Rename the npm script `fetch:bookmarks` → `bookmarks:fetch`
- Round-trip `chromeGuid` on every Collection
- Update `$schema` so it names `chromeGuid` as `bookmarks:sync`-owned and tells the curator to run `bookmarks:fetch`

## `/bookmarks`

`getCollections()` / `BookmarkCollection` stay `id`, `name`, `description`, `bookmarks`. Strip `chromeGuid` at that boundary. The route never sees it.

## Out of scope

- Write back to Chrome
- Profiles other than Default
- Brave, Arc, Firefox, Chromium, Chrome Canary
- A Chrome extension
- Nested Chrome folder as its own Collection
- Sync deleting site Bookmarks
- Changing Collection `id` / route when the Collection title is overridden
- Shipping from the prototype branch (`prototype/bookmarks-sync` is throwaway)
