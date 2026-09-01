# How is Collection id assigned on first sync, and what if the slug exists?

Type: grilling
Status: open

## Question

On first sync of a Chrome folder (no matching guid):

- If **create new Collection**, how is `id` (the `/bookmarks/[id]` slug) chosen — slug of the confirmed Collection title, slug of the Chrome folder name, or prompt?
- `id` must stay stable forever after that (title override and later syncs never rewrite it).
- If that slug already exists (`design-systems` is already on the site) and the user did not **attach**, what happens — refuse, suffix, or force the attach prompt?

Attach keeps the existing Collection's `id` and writes the Chrome folder guid onto it. That path is already decided; this ticket is create-new and collision only.
