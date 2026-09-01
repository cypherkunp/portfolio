# Chrome Bookmarks file: path, shape, guid stability

Primary sources: Chromium `BookmarkCodec` / `BookmarkNode` / `BookmarkModel`, Chromium user-data-dir docs, and the live Default Bookmarks file on this machine. No user URLs.

## Path (macOS, Default)

Chromium's default user-data dir on Mac is `~/Library/Application Support/Google/Chrome`. The Default profile lives under that as `Default`.

Source: [docs/user_data_dir.md](https://chromium.googlesource.com/chromium/src/+/main/docs/user_data_dir.md) — Mac OS X: Chrome → `~/Library/Application Support/Google/Chrome`; profile dir example `.../Google/Chrome/Default`.

The local-or-syncable bookmarks filename is `"Bookmarks"` (`kLocalOrSyncableBookmarksFileName`). Comment in Chromium: actual file name is inconsistent with the variable name, kept to avoid migrations.

Source: [components/bookmarks/common/bookmark_constants.cc](https://raw.githubusercontent.com/chromium/chromium/main/components/bookmarks/common/bookmark_constants.cc)

There is a second file, `AccountBookmarks` (`kAccountBookmarksFileName`), for account-storage bookmarks. It does **not** exist on this machine. Sync should read:

`/Users/devshukl1/Library/Application Support/Google/Chrome/Default/Bookmarks`

## JSON shape

`BookmarkCodec` keys (same names as the live file):

| Key | Meaning |
| --- | --- |
| `version` | file version; decode requires `1` |
| `checksum` | MD5 of encoded nodes |
| `sync_metadata` | base64 blob (ignore) |
| `roots` | dict of permanent folders |

Root object keys: `bookmark_bar`, `other`, `synced` (mobile; value left as `synced` for historical reasons).

Source: [components/bookmarks/browser/bookmark_codec.cc](https://raw.githubusercontent.com/chromium/chromium/main/components/bookmarks/browser/bookmark_codec.cc) — `kRootsKey`, `kBookmarkBarFolderNameKey`, `kOtherBookmarkFolderNameKey`, `kMobileBookmarkFolderNameKey` ("The value is left as 'synced' for historical reasons."), `kGuidKey` (`"guid"`), `kIdKey`, `kTypeKey`, `kNameKey`, `kURLKey`, `kChildrenKey`.

`EncodeNode` writes every node as a dict: `id` (decimal string of `int64`), `name`, `guid` (lowercase UUID string), `date_added`, `date_last_used`, then either `type: "url"` + `url`, or `type: "folder"` + `date_modified` + `children`.

Live Default file (this machine, 2026-08-31):

- Top-level keys: `checksum`, `roots`, `sync_metadata`, `version` (`1`)
- Roots: `bookmark_bar` (name `Bookmarks bar`), `other` (`Other bookmarks`), `synced` (`Mobile Bookmarks`)
- 1308 nodes; types only `url` | `folder`
- Every node has `guid` and `id`; 1308 unique guids, 1308 unique ids
- Folder-only: `children`, `date_modified`
- URL-only: `url` (1193/1308); optional `meta_info`

Redacted folder child keys: `children`, `date_added`, `date_last_used`, `date_modified`, `guid`, `id`, `name`, `type`.

Redacted URL child keys: `date_added`, `date_last_used`, `guid`, `id`, `meta_info`, `name`, `type`, `url`.

**Top-level folders** = `type === "folder"` children of those three roots. `synced` on this machine has 10 URL children and 0 folder children; the root itself is the selectable folder (has its own `guid`).

Do **not** use numeric `id` as a join key. Decode reassigns ids when missing/colliding (`ReassignIDsIfRequired`, `ids_reassigned_`). Ids are local.

## Guid as join key

`BookmarkNode::uuid()` is documented as persisted across sessions and stable for the bookmark's lifetime, except rare local↔account moves that would otherwise collide, and managed (enterprise) bookmarks whose UUIDs are reassigned at startup.

Source: [components/bookmarks/browser/bookmark_node.h](https://chromium.googlesource.com/chromium/src/+/main/components/bookmarks/browser/bookmark_node.h) (`uuid()` comment; `uuid_` "generally immutable"; `SetNewRandomUuid()` is private and used to avoid collisions on move).

| Event | Guid |
| --- | --- |
| Rename | Unchanged. `BookmarkModel::SetTitle` only sets title. |
| Move within the same local-or-syncable tree | Unchanged. `Move` reassigns UUID only when crossing local vs account storage. |
| Chrome sync across clients | UUID is the cross-client identity (`consistent across different clients`). |
| Delete folder, create a new one with the same name | **New** guid. `AddFolder` generates a random UUID if none is passed. |
| Managed/enterprise bookmarks | Unstable; out of scope. |

Sources: [bookmark_model.h](https://raw.githubusercontent.com/chromium/chromium/main/components/bookmarks/browser/bookmark_model.h) `SetTitle`, `Move` (UUID reassignment note), `AddFolder` ("If no UUID is provided … a random one will be generated").

User-created folders: `DecodeNode` reads `guid` from JSON; invalid/empty/duplicate/`kBannedUuidDueToPastSyncBug` → new random UUID (`uuids_reassigned_`). Once valid, it is kept.

Permanent roots (`bookmark_bar` / `other` / `synced`): decode does **not** read their file guid (hard-coded factory UUIDs). This profile's file still has non-well-known root guids (not `00000000-0000-4000-a000-000000000001` etc.). For **user folders** (the Collections we sync) that does not matter: those guids are read from disk and unique.

## Verdict

Yes: persist the Chrome folder's `guid` string from the Bookmarks JSON as the Collection join key.

Caveats for the spec:

- Join user folders (and `roots.synced` if selected as Mobile Bookmarks), never numeric `id`, never `name`.
- Recreating a folder in Chrome is a new Collection as far as sync is concerned.
- Moving a folder into Chrome account storage can reassign UUID; this profile has no `AccountBookmarks` file.
- Permanent-root guids in the file may not match Chromium's well-known constants; still use the `guid` field on the node you actually selected.
