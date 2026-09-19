# Where does the Chrome folder guid live in bookmarks.config.json?

Type: grilling
Status: resolved
Blocked by: 01

## Question

The join key is the Chrome folder guid. Where is it stored so a Collection title change cannot break the next sync?

- Field name and place on the Collection object in `bookmarks.config.json`.
- Does `getCollections()` / `BookmarkCollection` expose it to the `/bookmarks` route, or is it sync metadata stripped at the lib boundary?
- Does `$schema` / the hand-edited comment mention it, or is it a quiet field `bookmarks:sync` owns?

Runtime must keep treating **Collection** `id` + `name` as curator-owned. The guid is not a Collection name and not a Bookmark.

## Answer (field + schema)

Resolved on [#10](https://github.com/cypherkunp/portfolio/issues/10): optional `chromeGuid` on the Collection object; `$schema` mentions it as owned by `bookmarks:sync`.

## Answer (expose vs strip)

Resolved on [#13](https://github.com/cypherkunp/portfolio/issues/13): strip at `getCollections()`. `/bookmarks` never sees it.
