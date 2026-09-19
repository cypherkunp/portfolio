# Does Chrome folder guid survive rename and stay joinable?

Type: research
Status: resolved

## Question

Can we treat Chrome's folder `guid` as the Collection join key?

Need, from primary sources (Chromium bookmark codec / BookmarkNode, plus the live Default Bookmarks file on this machine):

- Absolute path of Default's Bookmarks file on macOS.
- JSON shape: roots (`bookmark_bar`, `other`, `synced`), folder vs url nodes, fields for `guid` vs numeric `id` vs `name` vs `url`.
- Top-level folders = children of those roots; whether a root with direct URL children (Mobile Bookmarks) has its own guid we can store.
- Whether folder `guid` survives rename, move within the same profile, and Chrome sync. Whether it changes if the folder is deleted and recreated.
- Enough certainty to persist that guid on a Collection and find it again on the next `bookmarks:sync`.

Do not implement the CLI. Write findings to `.scratch/chrome-bookmarks-sync/research/chrome-bookmarks-file.md`.

## Answer

Yes. Persist the folder's `guid` string from Default's Bookmarks JSON. It survives rename, same-tree move, and sync. Delete+recreate and local↔account moves get a new guid. Do not join on numeric `id` or `name`.

Findings: [chrome-bookmarks-file.md](../research/chrome-bookmarks-file.md)

