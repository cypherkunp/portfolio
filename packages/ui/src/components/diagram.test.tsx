import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Diagram } from './diagram';

describe('Diagram', () => {
  it('marks the visit the score is read from', () => {
    render(
      <Diagram
        kind="scale"
        title="The 75th visit"
        start="visit 1"
        mark="visit 75"
        end="visit 100"
        markLabel="this visit is the score"
        rows={[
          { label: 'all three good on phone', value: 'pass so far', tone: 'pass' },
          { label: 'any one outside good', value: 'fail', tone: 'fail' },
        ]}
      />,
    );

    expect(screen.getByRole('figure', { name: 'The 75th visit' })).toBeInTheDocument();
    expect(screen.getByText('visit 75')).toBeInTheDocument();
    expect(screen.getByText('this visit is the score')).toBeInTheDocument();
    expect(screen.getByText('fail')).toBeInTheDocument();
  });

  it('draws a flow and names the current step', () => {
    render(
      <Diagram
        kind="flow"
        title="Lifecycle"
        steps={[
          { label: 'experimental' },
          { label: 'pending', detail: 'at least 6 months' },
          { label: 'stable', current: true },
        ]}
        marker="LCP, INP, and CLS are here"
      />,
    );

    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText('at least 6 months')).toBeInTheDocument();
    expect(screen.getByText('LCP, INP, and CLS are here')).toBeInTheDocument();
  });

  it('draws a timeline in segment order', () => {
    render(
      <Diagram
        kind="timeline"
        title="LCP parts"
        start="navigation start"
        end="LCP"
        segments={[
          { label: 'TTFB', share: '40%', weight: 40 },
          { label: 'resource load delay', share: '<10%', weight: 10, tone: 'wait' },
        ]}
      />,
    );

    expect(screen.getByText('navigation start')).toBeInTheDocument();
    expect(screen.getByText('TTFB')).toBeInTheDocument();
    expect(screen.getByText('<10%')).toBeInTheDocument();
  });

  it('draws a shift and the score', () => {
    render(
      <Diagram
        kind="shift"
        title="One shift"
        cases={[
          {
            label: 'Half the viewport, then down by 25%',
            before: [{ tone: 'shift', top: 0, height: 50 }],
            after: [
              { tone: 'span', top: 0, height: 75 },
              { tone: 'shift', top: 25, height: 50 },
            ],
            impact: '0.75',
            distance: '0.25',
            score: '0.1875',
          },
        ]}
      />,
    );

    expect(screen.getByText('0.1875')).toBeInTheDocument();
    expect(screen.getByText('before')).toBeInTheDocument();
    expect(screen.getByText('after')).toBeInTheDocument();
  });

  it('draws session windows and names the largest', () => {
    render(
      <Diagram
        kind="windows"
        title="Session windows"
        windows={[
          { label: 'one window, 5s max', shifts: 3, gapAfter: 'gap over 1s', largest: true },
          { label: 'next window', shifts: 1 },
        ]}
        result="CLS is the largest window"
      />,
    );

    expect(screen.getByText('CLS is the largest window')).toBeInTheDocument();
    expect(screen.getByText('gap over 1s')).toBeInTheDocument();
  });

  it('draws task bars and the blocking total', () => {
    render(
      <Diagram
        kind="bars"
        title="Main thread"
        threshold={50}
        unit="ms"
        rows={[
          { label: 'task 1', total: 250, blocking: 200 },
          { label: 'task 3', total: 35, blocking: 0 },
        ]}
        totals={[
          { label: 'task time', value: '560 ms' },
          { label: 'TBT', value: '345 ms' },
        ]}
      />,
    );

    expect(screen.getByText('200 ms blocking')).toBeInTheDocument();
    expect(screen.getByText('0 ms blocking')).toBeInTheDocument();
    expect(screen.getByText('345 ms')).toBeInTheDocument();
    expect(screen.getByText('50 ms')).toBeInTheDocument();
  });
});
