import React from 'react';
import { cn } from '@/utils/cn';
import type { ResponseKind, TimelineResult } from '../types';
import { WIDGET_COLORS } from '@/features/Blog/components/widgetStyles';
import { RESPONSE_STYLES, TIMELINE, TIMELINE_CHART as C } from '../constants';

const PLOT_WIDTH = C.width - C.padLeft - C.padRight;
const TIME_TICKS = [0, 60, 120, 180, 240];

const x = (seconds: number) => C.padLeft + (Math.min(seconds, TIMELINE.durationSeconds) / TIMELINE.durationSeconds) * PLOT_WIDTH;
const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

const RenderBlock: React.FC<{ at: number; label?: string }> = ({ at, label }) => (
  <g>
    <rect
      x={x(at) - C.renderWidth / 2}
      y={C.renderY}
      width={C.renderWidth}
      height={C.renderHeight}
      fill={WIDGET_COLORS.idle}
      stroke={WIDGET_COLORS.text}
      strokeWidth={1}
    />
    {label && (
      <text x={x(at)} y={C.renderY + C.renderHeight + 12} textAnchor="middle" className="fill-neutral-500 font-mono text-[10px]">
        {label}
      </text>
    )}
  </g>
);

const LEGEND: { kind: ResponseKind }[] = [{ kind: 'current' }, { kind: 'stale' }, { kind: 'fresh' }];

/**
 * One line of time after the build: the CMS edit, the visitors coloured by the
 * version they got, and a block under the line for every server render.
 */
const TimelineChart: React.FC<{ result: TimelineResult; editAt: number }> = ({ result, editAt }) => (
  <figure className="m-0">
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${C.width} ${C.height}`}
        role="img"
        aria-label={`Timeline of ${result.requests.length} visitors: ${result.staleResponses} got the old post after the edit, the server rendered ${result.renders} times after the build.`}
        className={cn('block h-auto w-full', C.minWidthClass)}
      >
        {/* ISR: the stretch in which the cached page still counts as fresh. */}
        {result.windows.map((window) => (
          <rect
            key={window.from}
            x={x(window.from)}
            y={C.axisY - 16}
            width={x(window.to) - x(window.from)}
            height={32}
            fill="#ffffff"
            opacity={0.04}
          />
        ))}

        <line x1={C.padLeft} x2={C.width - C.padRight} y1={C.axisY} y2={C.axisY} stroke={C.gridColor} strokeWidth={2} />

        {TIME_TICKS.map((tick) => (
          <text key={tick} x={x(tick)} y={C.height - 4} textAnchor="middle" className="fill-neutral-600 font-mono text-[10px]">
            {formatTime(tick)}
          </text>
        ))}

        <line x1={x(editAt)} x2={x(editAt)} y1={22} y2={C.renderY + C.renderHeight} stroke={WIDGET_COLORS.error} strokeDasharray="4 4" />
        <text x={x(editAt)} y={14} textAnchor="middle" className="fill-red-400 font-mono text-[10px] uppercase">
          CMS edit
        </text>

        <RenderBlock at={0} label="build" />

        {result.requests.map((request) => (
          <g key={request.at}>
            {request.rendered && <RenderBlock at={request.at} />}
            <circle
              cx={x(request.at)}
              cy={C.axisY}
              r={C.dotRadius}
              fill={RESPONSE_STYLES[request.kind].color}
              stroke={request.rendered ? '#fafafa' : 'none'}
              strokeWidth={2}
            />
          </g>
        ))}
      </svg>
    </div>

    <figcaption className="mt-3 flex flex-wrap gap-x-5 gap-y-2 font-mono text-2xs text-muted-foreground">
      {LEGEND.map(({ kind }) => (
        <span key={kind} className="inline-flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-full" style={{ backgroundColor: RESPONSE_STYLES[kind].color }} aria-hidden="true" />
          {RESPONSE_STYLES[kind].label}
        </span>
      ))}
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-2.5 w-3.5 border border-neutral-400 bg-neutral-700" aria-hidden="true" />
        Server render
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block size-2.5 rounded-full border-2 border-neutral-50" aria-hidden="true" />
        This visit made the server render
      </span>
    </figcaption>
  </figure>
);

export default TimelineChart;
