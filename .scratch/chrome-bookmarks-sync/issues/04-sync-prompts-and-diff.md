# What should the sync prompts and diff look like?

Type: prototype
Status: open
Blocked by: 01, 02

## Question

How should `bookmarks:sync` feel in the terminal?

Raise fidelity with a cheap, throwaway run (or a scripted walkthrough) against Default's real Bookmarks file:

- Searchable multi-select of top-level folders (several in one run).
- Per folder: Collection title override, then flattened bookmark multi-select (all checked).
- Combined diff: **new** (will add), **already in this Collection** (no-op), **title fill** (empty title ← Chrome name). Additive only; no deletes.
- Confirm once, then stop (prototype does not have to write `bookmarks.config.json` or run fetch).

The answer is the prompt copy, selection behaviour, and diff layout we keep — plus a link to the prototype artifact.
