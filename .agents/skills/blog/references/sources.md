# Sources

Read this when the post drew on a source. Every such post ends with `<References />`, after the takeaway. No import.

```mdx
<References
  items={[
    { author: 'Author Name', url: 'https://example.com/post' },
    { author: 'Speaker Name', url: 'https://www.youtube.com/watch?v=VIDEO_ID' },
  ]}
/>
```

- One item per source you used. Omit the component only when the post cites nothing.
- Each item is `{ author, url }`. Author is a person or org. URL is the source.
- Name a source author only here. The body states the fact. It does not name the person or the org, and it does not say who published it.
- The list renders as `Author - url`.
- Include every source the post draws on. Talks, essays, docs, videos.
- An empty `items` array renders nothing. Use that only when the post cites nothing.
- Do not invent authors or URLs. Ask when a source is unclear.
- `title` defaults to `References`. `className` is optional.
