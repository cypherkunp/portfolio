# Callout

Read this when you add a `Callout`. No import.

```mdx
<Callout variant="warning" title="CAUTION">
  Command or condition. Then the result.
</Callout>
```

- `variant`: `default` | `info` | `warning`
- `title`: short label. A `WARNING` or `CAUTION` uses this prop
- `children`: the body
- `icon`: optional React node
- `className`: optional

When:

- `warning` and title `CAUTION` when the next action can break the work, lose data, or fail the page. First sentence is the command or the condition. Next sentence is the result.
- `info` and title `NOTE` when a limit changes how to read the paragraph above. The reader can skip it and still follow the steps, but will misread a number or a comparison.
- `default` for a short labeled aside that is not a hazard and not a note. Rare.
- A normal fact stays in the paragraph. A callout is not a highlight.
