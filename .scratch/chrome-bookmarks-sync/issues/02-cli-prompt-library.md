# Which CLI prompt library can drive searchable multi-select for sync?

Type: research
Status: resolved

## Question

Which Node CLI prompt library should `bookmarks:sync` use?

The flow to wrap:

1. Searchable **multi-select** of ~30–40 top-level Chrome folders.
2. Per selected folder: optional text prompt for Collection title (default: Chrome folder name).
3. Per selected folder: searchable **multi-select** of flattened bookmark URLs (all checked by default). Pools can be tens to hundreds of items (`Personal` is the worst case).
4. One combined diff, then a confirm.

Constraints: one-off script beside `apps/www/scripts/fetch-bookmarks-og.mjs`, pnpm workspace, Node >= 24, no need for a TUI framework unless that's actually the better fit. Prefer maintained official docs over blog roundups.

Name one library (and the specific APIs) and reject the others with reasons. Do not implement the CLI. Write findings to `.scratch/chrome-bookmarks-sync/research/cli-prompt-library.md`.

## Answer

`@clack/prompts` 1.x (`autocompleteMultiselect` + `text` + `confirm`). Not 0.11. Inquirer checkbox has no search; Enquirer is unmaintained; Ink is a React TUI with no first-party prompts.

Findings: [cli-prompt-library.md](../research/cli-prompt-library.md)

