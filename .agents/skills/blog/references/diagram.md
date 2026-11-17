# Diagram

Read this when a picture explains a concept faster than a paragraph. No import. The site does not render Mermaid. Draw your own figure. Do not copy a source diagram. Cite the page the idea came from in `sources.md`.

```mdx
<Diagram
  kind="timeline"
  title="Where the time goes"
  start="navigation start"
  end="LCP"
  segments={[
    { label: 'TTFB', share: 'about 40%', weight: 40, tone: 'work' },
    { label: 'resource load delay', share: 'under 10%', weight: 10, tone: 'wait' },
  ]}
/>
```

- `kind`: `scale` | `rows` | `flow` | `timeline` | `shift` | `windows` | `bars`
- `title`: the caption in the frame
- `notes`: optional lines under the figure
- `scale` marks one point on a track. `markAt` is 0 to 100, default 75. Optional `rows` sit under the track.
- `rows` is a label and a value. `tone` `pass` underlines the value. `tone` `fail` mutes it.
- `flow` is ordered steps. One step can set `current`, with `marker` under that step.
- `timeline` segments use `weight` for width. `tone` `wait` is a dashed box.
- `shift` draws before and after boxes. `tone` is `shift`, `still`, or `span`. The score line is `impact x distance = score`.
- `windows` is a run of shifts. One window sets `largest`.
- `bars` draws task length against `threshold`. `blocking` is the part past the mark.

A fenced `txt` block is code, not a figure. An image with `width` and `height` is only for a picture you cannot draw as data.
