# Dialog

Read this when a check, a repeated table, or a repeated sample should sit behind a panel the reader opens. No import. The pieces are `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, and `DialogDescription` from `packages/ui/src/components/dialog.tsx`. The panel already has the overlay and the close control.

```mdx
<Dialog>
  <DialogTrigger>Part shares</DialogTrigger>
  <DialogContent className="max-w-3xl">
    <DialogHeader>
      <DialogTitle>Where an LCP time goes</DialogTitle>
      <DialogDescription>
        The same four parts as the figure, with the tuned-page share.
      </DialogDescription>
    </DialogHeader>
    <Table
      data={{
        headers: ['Part', 'Share on a tuned page', 'What the part is'],
        rows: [['Time to first byte', 'About 40%', 'Wait for the first HTML byte']],
      }}
    />
  </DialogContent>
</Dialog>
```

- `DialogTrigger` names the panel. `Part shares` is a label. It already renders as a text link.
- `DialogTitle` is required. It is the accessible name.
- `DialogDescription` is required. One sentence on what the panel holds.
- `className="max-w-3xl"` on `DialogContent` when the panel holds a table, a diagram, or a fence. The default width is `max-w-lg`.
- A fence in the panel needs a blank line after the opening `DialogContent` tag.
- Skip `DialogFooter` and `DialogClose`. The panel already closes.

When, tested against `apps/www/src/content/posts/web-vitals.mdx`:

- The paragraph already states the fact, and the section still reads with the panel shut. The panel is the check.
- A table that repeats a figure goes in the panel. In that post the LCP timeline stays on the page. The share table under it is the panel.
- A sample that repeats numbered steps goes in the panel. The measure-then-fix list stays on the page. The `web-vitals` send snippet is the panel. The same split applies to an HTML, CSS, or JS sample under a numbered fix.
- A figure the next sentence points at stays on the page. The 75th-visit scale, the metric phases, the interaction timeline, the shift drawing, the session windows, and the blocking-time bars stay on the page.
- The band table stays on the page. Later sections quote those numbers.
- A caution or a note stays in `Callout`. See `callout.md`. One command stays in `Terminal`. See `terminal.md`.

Place the trigger at the end of the paragraph it supports.
