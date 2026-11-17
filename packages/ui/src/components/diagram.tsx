import type { CSSProperties, ReactNode } from 'react';

import { cn } from '../lib/utils';

interface DiagramNote {
  notes?: string[];
  className?: string;
}

interface DiagramRow {
  label: string;
  value: string;
  tone?: 'pass' | 'fail';
}

interface ScaleDiagram extends DiagramNote {
  kind: 'scale';
  title: string;
  start: string;
  mark: string;
  end: string;
  markLabel: string;
  /** Position of the mark along the track, from 0 to 100. */
  markAt?: number;
  rows?: DiagramRow[];
}

interface RowsDiagram extends DiagramNote {
  kind: 'rows';
  title: string;
  rows: DiagramRow[];
}

interface FlowStep {
  label: string;
  detail?: string;
  current?: boolean;
}

interface FlowDiagram extends DiagramNote {
  kind: 'flow';
  title: string;
  steps: FlowStep[];
  marker?: string;
}

interface TimelineSegment {
  label: string;
  share?: string;
  weight: number;
  tone?: 'work' | 'wait';
}

interface TimelineDiagram extends DiagramNote {
  kind: 'timeline';
  title: string;
  start?: string;
  end?: string;
  segments: TimelineSegment[];
}

interface ShiftBox {
  top: number;
  height: number;
  left?: number;
  width?: number;
  tone: 'shift' | 'still' | 'span';
}

interface ShiftCase {
  label: string;
  before: ShiftBox[];
  after: ShiftBox[];
  impact: string;
  distance: string;
  score: string;
}

interface ShiftDiagram extends DiagramNote {
  kind: 'shift';
  title: string;
  cases: ShiftCase[];
}

interface SessionWindow {
  label: string;
  shifts: number;
  gapAfter?: string;
  largest?: boolean;
}

interface WindowsDiagram extends DiagramNote {
  kind: 'windows';
  title: string;
  windows: SessionWindow[];
  result: string;
}

interface BarRow {
  label: string;
  total: number;
  blocking: number;
}

interface BarsDiagram extends DiagramNote {
  kind: 'bars';
  title: string;
  threshold: number;
  unit: string;
  rows: BarRow[];
  totals: { label: string; value: string }[];
}

export type DiagramProps =
  | ScaleDiagram
  | RowsDiagram
  | FlowDiagram
  | TimelineDiagram
  | ShiftDiagram
  | WindowsDiagram
  | BarsDiagram;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function captionId(kind: string, title: string) {
  const slug = `${kind}-${title}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `diagram-${slug}`;
}

function DiagramFrame({
  title,
  kind,
  notes,
  className,
  children,
}: {
  title: string;
  kind: string;
  notes?: string[];
  className?: string;
  children: ReactNode;
}) {
  const labelId = captionId(kind, title);

  return (
    <figure
      aria-labelledby={labelId}
      className={cn('border-border my-6 overflow-hidden rounded-lg border', className)}
    >
      <figcaption
        id={labelId}
        className="border-border bg-muted/40 text-muted-foreground border-b px-3 py-1.5 font-mono text-xs"
      >
        {title}
      </figcaption>
      <div className="px-4 py-4">{children}</div>
      {notes && notes.length > 0 ? (
        <ul className="border-border text-muted-foreground list-none space-y-1 border-t px-4 py-3 text-sm">
          {notes.map(note => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      ) : null}
    </figure>
  );
}

function Rows({ rows, className }: { rows: DiagramRow[]; className?: string }) {
  return (
    <ul className={cn('space-y-2', className)}>
      {rows.map(row => (
        <li key={row.label} className="flex items-baseline justify-between gap-4 text-sm">
          <span className="text-foreground/90">{row.label}</span>
          <span
            className={cn(
              'shrink-0 text-right font-medium',
              row.tone === 'pass' && 'border-b-2 border-yellow-500',
              row.tone === 'fail' && 'text-muted-foreground',
            )}
          >
            {row.value}
          </span>
        </li>
      ))}
    </ul>
  );
}

function ScaleView({ start, mark, end, markLabel, markAt = 75, rows }: ScaleDiagram) {
  const at = clamp(markAt, 0, 100);

  return (
    <div>
      <div className="relative h-16">
        <div className="bg-border absolute inset-x-0 top-3 h-px" />
        <span className="text-muted-foreground absolute top-5 left-0 text-xs">{start}</span>
        <span className="text-muted-foreground absolute top-5 right-0 text-xs">{end}</span>
        <div
          className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
          style={{ left: `${at}%` }}
        >
          <span aria-hidden className="h-3 w-px bg-yellow-500" />
          <span className="text-foreground text-xs">{mark}</span>
        </div>
      </div>
      <p className="text-foreground text-center text-sm">{markLabel}</p>
      {rows && rows.length > 0 ? <Rows rows={rows} className="mt-4" /> : null}
    </div>
  );
}

function FlowView({ steps, marker }: FlowDiagram) {
  return (
    <ol className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start">
      {steps.map((step, index) => (
        <li key={step.label} className="flex flex-col gap-2 sm:flex-row sm:items-start">
          {index > 0 ? (
            <span aria-hidden className="bg-border ml-3 h-4 w-px sm:mt-2 sm:ml-0 sm:h-px sm:w-8" />
          ) : null}
          <div>
            <p
              className={cn(
                'text-foreground w-fit text-sm',
                step.current && 'border-b-2 border-yellow-500',
              )}
            >
              {step.label}
            </p>
            {step.detail ? (
              <p className="text-muted-foreground mt-1 text-xs">{step.detail}</p>
            ) : null}
            {step.current && marker ? (
              <p className="text-muted-foreground mt-2 max-w-48 text-xs">{marker}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

function TimelineView({ start, end, segments }: TimelineDiagram) {
  const total = segments.reduce((sum, segment) => sum + Math.max(segment.weight, 0), 0) || 1;

  return (
    <div>
      {start || end ? (
        <div className="text-muted-foreground mb-2 flex justify-between gap-4 text-xs">
          <span>{start}</span>
          <span>{end}</span>
        </div>
      ) : null}
      <div className="flex h-6 w-full" aria-hidden>
        {segments.map((segment, index) => {
          const share = (Math.max(segment.weight, 0) / total) * 100;
          return (
            <div
              key={`${segment.label}-${index}`}
              className={cn(
                'h-full border-y border-r',
                index === 0 && 'border-l',
                segment.tone === 'wait'
                  ? 'border-yellow-500 border-dashed'
                  : 'border-foreground/30 bg-foreground/15',
              )}
              style={{ width: `${share}%` }}
            />
          );
        })}
      </div>
      <ul className="mt-3 space-y-1.5">
        {segments.map((segment, index) => (
          <li
            key={`${segment.label}-${index}`}
            className="flex items-baseline justify-between gap-4 text-sm"
          >
            <span className="text-foreground flex min-w-0 items-center gap-2">
              <span
                aria-hidden
                className={cn(
                  'inline-block h-2 w-4 shrink-0 border',
                  segment.tone === 'wait'
                    ? 'border-yellow-500 border-dashed'
                    : 'border-foreground/40 bg-foreground/15',
                )}
              />
              {segment.label}
            </span>
            {segment.share ? (
              <span className="text-muted-foreground shrink-0 text-right text-xs">
                {segment.share}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function boxStyle(box: ShiftBox): CSSProperties {
  return {
    top: `${box.top}%`,
    height: `${box.height}%`,
    left: `${box.left ?? 12}%`,
    width: `${box.width ?? 76}%`,
  };
}

function ShiftFrame({ label, boxes }: { label: string; boxes: ShiftBox[] }) {
  const order = { span: 0, still: 1, shift: 2 };

  return (
    <div className="min-w-0 flex-1">
      <p className="text-muted-foreground mb-1 text-xs">{label}</p>
      <div className="border-border bg-background relative h-36 border">
        {[...boxes]
          .sort((a, b) => order[a.tone] - order[b.tone])
          .map((box, index) => (
            <span
              key={`${box.tone}-${index}`}
              aria-hidden
              className={cn(
                'absolute',
                box.tone === 'shift' && 'border-foreground/60 bg-foreground/15 border',
                box.tone === 'still' && 'border-border bg-muted/40 border',
                box.tone === 'span' && 'border border-dashed border-yellow-500',
              )}
              style={boxStyle(box)}
            />
          ))}
      </div>
    </div>
  );
}

function ShiftView({ cases }: ShiftDiagram) {
  return (
    <div className="space-y-6">
      {cases.map(item => (
        <div key={item.label}>
          <p className="text-foreground mb-2 text-sm">{item.label}</p>
          <div className="flex gap-3">
            <ShiftFrame label="before" boxes={item.before} />
            <ShiftFrame label="after" boxes={item.after} />
          </div>
          <p className="text-muted-foreground mt-2 text-sm">
            {item.impact} x {item.distance} = <span className="text-foreground">{item.score}</span>
          </p>
        </div>
      ))}
    </div>
  );
}

function WindowsView({ windows, result }: WindowsDiagram) {
  return (
    <div>
      <div className="flex flex-wrap items-end gap-x-2 gap-y-4">
        {windows.map(session => (
          <div key={session.label} className="flex items-end gap-3">
            <div>
              <div className="mb-2 flex items-end gap-1" aria-hidden>
                {Array.from({ length: session.shifts }, (_, index) => (
                  <span
                    key={index}
                    className={cn('bg-foreground/80 w-1.5', session.largest ? 'h-8' : 'h-4')}
                  />
                ))}
              </div>
              <p
                className={cn(
                  'text-foreground w-fit text-xs',
                  session.largest && 'border-b-2 border-yellow-500',
                )}
              >
                {session.label}
              </p>
            </div>
            {session.gapAfter ? (
              <p className="text-muted-foreground pb-0.5 text-xs">{session.gapAfter}</p>
            ) : null}
          </div>
        ))}
      </div>
      <p className="text-foreground mt-4 text-sm">{result}</p>
    </div>
  );
}

function BarsView({ threshold, unit, rows, totals }: BarsDiagram) {
  const max = Math.max(threshold, ...rows.map(row => row.total), 1);
  const markAt = (threshold / max) * 100;

  return (
    <div>
      <div className="relative mb-1 ml-[5.5rem] h-5">
        <span
          className="absolute -translate-x-1/2 text-xs text-yellow-500 dark:text-yellow-400"
          style={{ left: `${markAt}%` }}
        >
          {threshold} {unit}
        </span>
      </div>
      <ul className="space-y-2">
        {rows.map(row => {
          const solid = clamp(row.blocking, 0, row.total);
          const quiet = Math.max(0, row.total - solid);
          return (
            <li
              key={row.label}
              className="grid grid-cols-[5.5rem_minmax(0,1fr)_auto] items-center gap-3"
            >
              <span className="text-foreground text-sm">{row.label}</span>
              <div className="bg-muted relative h-3">
                <span
                  aria-hidden
                  className="absolute inset-y-0 w-px bg-yellow-500"
                  style={{ left: `${markAt}%` }}
                />
                <span
                  aria-hidden
                  className="bg-foreground/20 absolute inset-y-0 left-0"
                  style={{ width: `${(quiet / max) * 100}%` }}
                />
                <span
                  aria-hidden
                  className="bg-foreground absolute inset-y-0"
                  style={{ left: `${(quiet / max) * 100}%`, width: `${(solid / max) * 100}%` }}
                />
              </div>
              <span className="text-right text-xs">
                <span className="text-foreground block tabular-nums">
                  {row.total} {unit}
                </span>
                <span className="text-muted-foreground block tabular-nums">
                  {solid} {unit} blocking
                </span>
              </span>
            </li>
          );
        })}
      </ul>
      <ul className="border-border mt-4 space-y-1 border-t pt-3">
        {totals.map(total => (
          <li key={total.label} className="flex items-baseline justify-between gap-4 text-sm">
            <span className="text-muted-foreground">{total.label}</span>
            <span
              className={cn(
                'text-foreground font-medium',
                total.label === 'TBT' && 'border-b-2 border-yellow-500',
              )}
            >
              {total.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Diagram(props: DiagramProps) {
  return (
    <DiagramFrame
      title={props.title}
      kind={props.kind}
      notes={props.notes}
      className={props.className}
    >
      {props.kind === 'scale' ? <ScaleView {...props} /> : null}
      {props.kind === 'rows' ? <Rows rows={props.rows} /> : null}
      {props.kind === 'flow' ? <FlowView {...props} /> : null}
      {props.kind === 'timeline' ? <TimelineView {...props} /> : null}
      {props.kind === 'shift' ? <ShiftView {...props} /> : null}
      {props.kind === 'windows' ? <WindowsView {...props} /> : null}
      {props.kind === 'bars' ? <BarsView {...props} /> : null}
    </DiagramFrame>
  );
}
