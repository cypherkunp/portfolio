# CLI prompt library for `bookmarks:sync`

Winner: **`@clack/prompts` 1.x** (npm current: **1.7.0**, published 2026-07-03).

## Why Clack

The flow needs searchable multi-select (~30–40 folders; tens–hundreds of URLs), text with a default, and confirm. Clack 1.x is the only candidate that ships all four as first-party APIs without a TUI framework or a custom prompt.

Pin **1.x**, not 0.11. `autocomplete` / `autocompleteMultiselect` exist in 1.0+ only; they were not backported to 0.11 ([bombshell-dev/clack#333](https://github.com/bombshell-dev/clack/issues/333)).

Package: https://www.npmjs.com/package/@clack/prompts  
Source: https://github.com/bombshell-dev/clack/tree/main/packages/prompts

Fits a one-off script next to `apps/www/scripts/fetch-bookmarks-og.mjs`: ESM, no React, `isCancel` for Ctrl-C.

## APIs to use

Import from `@clack/prompts`. Handle `isCancel` after every prompt.

**Searchable multi-select (folders and flattened bookmarks)** — `autocompleteMultiselect`

Source: [packages/prompts/src/autocomplete.ts](https://github.com/bombshell-dev/clack/blob/main/packages/prompts/src/autocomplete.ts) (`AutocompleteMultiSelectOptions.initialValues`, `required` default false).

```js
const selected = await autocompleteMultiselect({
  message: 'Folders to sync',
  options: folders.map(f => ({ value: f.guid, label: f.name, hint: `${f.urlCount}` })),
  initialValues: folders.map(f => f.guid), // all checked; omit on the folder step if you want empty default
  placeholder: 'Type to search…',
  maxItems: 12,
  required: true,
});
```

Bookmark veto: same API with `initialValues: allUrls` (all checked). Filter matches `label`, `hint`, or `value` (substring, case-insensitive).

**Collection title** — `text`

Source: [packages/prompts/src/text.ts](https://github.com/bombshell-dev/clack/blob/main/packages/prompts/src/text.ts)

```js
const name = await text({
  message: `Collection title for ${chromeFolderName}`,
  initialValue: chromeFolderName, // editable in the field
  defaultValue: chromeFolderName, // if they submit empty
});
```

**Confirm diff** — `confirm`

Source: [packages/prompts/src/confirm.ts](https://github.com/bombshell-dev/clack/blob/main/packages/prompts/src/confirm.ts)

```js
const ok = await confirm({
  message: 'Write these changes?',
  initialValue: true,
});
```

Also: `intro` / `outro` / `cancel` / `isCancel` from the same package ([README](https://github.com/bombshell-dev/clack/blob/main/packages/prompts/README.md)).

Non-searchable `multiselect` has `initialValues` too; do not use it for the 30–40 / hundreds case.

## Rejected

**`@inquirer/prompts` (Inquirer v9+)** — maintained (e.g. `@inquirer/input` 5.1.4, 2026-08-26). `checkbox` is multi-select with `checked: true` per choice and an `a` select-all shortcut, but **no type-to-filter** ([checkbox README](https://github.com/SBoudrias/Inquirer.js/blob/main/packages/checkbox/README.md)). Official `search` is **single-select** ([search README](https://github.com/SBoudrias/Inquirer.js/blob/main/packages/search/README.md)). Searchable multi-select would be a custom prompt. `input` / `confirm` are fine; the missing prompt is the deal-breaker.

**Enquirer** — has Autocomplete / MultiSelect, but last GitHub commit is 2023-07-28 (`2.4.1`, [enquirer/enquirer](https://github.com/enquirer/enquirer/commit/70bdb0fedc3ed355d9d8fe4f00ac9b3874f94f61)). Unmaintained.

**Ink** — React-for-terminals renderer ([vadimdemedes/ink](https://github.com/vadimdemedes/ink)). No first-party multi-select/search prompts. Wrong shape for a one-file Node script.
