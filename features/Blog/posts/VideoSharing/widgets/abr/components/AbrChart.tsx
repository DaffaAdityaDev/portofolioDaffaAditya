import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { clamp } from '@/utils/math';
import type { AbrResult } from '@/features/Blog/posts/VideoSharing/widgets/abr/types';
import { FLOW_METER_LABEL_CLASS } from '@/features/Blog/flow/constants';
import { ABR, ABR_CHART as C, ABR_LADDER } from '../constants';

const PLOT_WIDTH = C.width - C.padLeft - C.padRight;
const RATE_TOP = C.padTop;
const RATE_BOTTOM = RATE_TOP + C.rateHeight;
const BUFFER_TOP = RATE_BOTTOM + C.gap;
const BUFFER_BOTTOM = BUFFER_TOP + C.bufferHeight;
const HEIGHT = BUFFER_BOTTOM + 22;
const RATE_TICKS = [0, 2.5, 5, 7.5, 10];
const BUFFER_TICKS = [0, 15, 30];
const TIME_TICK_EVERY = 5;

const formatTime = (seconds: number): string =>
  `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2, '0')}`;

const rateY = (mbps: number) => RATE_BOTTOM - (clamp(mbps, 0, C.maxMbps) / C.maxMbps) * C.rateHeight;
const bufferY = (seconds: number) => BUFFER_BOTTOM - (seconds / ABR.maxBufferSeconds) * C.bufferHeight;

/** A value held for the whole segment, drawn as flat steps. */
const stepPath = (values: number[], x: (index: number) => number, y: (value: number) => number): string =>
  values.map((value, index) => `${index === 0 ? 'M' : 'L'}${x(index)},${y(value)} H${x(index + 1)}`).join(' ');

/**
 * Two charts on one time axis: the network against the quality the player
 * picked (both in Mbps), and below it the buffer in seconds. Freezes are
 * shaded across both.
 */
const AbrChart: React.FC<{ result: AbrResult }> = ({ result }) => {
  const { segments } = result;
  const [hovered, setHovered] = useState<number | null>(null);
  const segmentWidth = PLOT_WIDTH / segments.length;
  const x = (index: number) => C.padLeft + index * segmentWidth;

  const networkLine = stepPath(segments.map((s) => s.networkMbps), x, rateY);
  const networkArea = `${networkLine} V${RATE_BOTTOM} H${x(0)} Z`;
  const pickedLine = stepPath(segments.map((s) => ABR_LADDER[s.rendition].mbps), x, rateY);
  const bufferLine = [`M${x(0)},${bufferY(0)}`, ...segments.map((s, i) => `L${x(i + 1)},${bufferY(s.bufferAfter)}`)].join(' ');
  const last = segments[segments.length - 1];
  const active = hovered === null ? null : segments[hovered];

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const step = event.key === 'ArrowRight' ? 1 : -1;
    setHovered((current) => clamp((current ?? (step > 0 ? -1 : segments.length)) + step, 0, segments.length - 1));
  };

  return (
    <figure className="m-0">
      <div className="mb-2 min-h-[2.5rem] font-mono text-[11px] leading-relaxed text-neutral-400" aria-live="polite">
        {active ? (
          <>
            <span className="text-neutral-200">
              {formatTime(active.index * ABR.segmentSeconds)}–{formatTime((active.index + 1) * ABR.segmentSeconds)}
            </span>
            {' · '}network {active.networkMbps.toFixed(1)} Mbps{' · '}picked{' '}
            <span className="text-neutral-200">{ABR_LADDER[active.rendition].label}</span> ({ABR_LADDER[active.rendition].mbps} Mbps)
            {' · '}buffer {Math.round(active.bufferAfter)} s
            {active.stallSeconds > 0 && <span className="text-red-400">{` · froze ${active.stallSeconds.toFixed(1)} s`}</span>}
          </>
        ) : (
          <span className="text-neutral-500">Hover the chart, or focus it and use the arrow keys, to inspect one segment.</span>
        )}
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${C.width} ${HEIGHT}`}
          role="img"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onBlur={() => setHovered(null)}
          onMouseLeave={() => setHovered(null)}
          aria-label={`Network bandwidth, picked quality and buffer over ${formatTime(segments.length * ABR.segmentSeconds)} of video. ${result.stalls} freezes.`}
          className={cn('block h-auto w-full outline-none focus-visible:ring-1 focus-visible:ring-red-500', C.minWidthClass)}
        >
          {RATE_TICKS.map((tick) => (
            <g key={`rate-${tick}`}>
              <line x1={C.padLeft} x2={C.width - C.padRight} y1={rateY(tick)} y2={rateY(tick)} stroke={C.gridColor} />
              <text x={C.padLeft - 6} y={rateY(tick) + 3} textAnchor="end" fontSize={9} className={C.axisTextClass}>
                {tick}
              </text>
            </g>
          ))}
          <text x={C.padLeft} y={RATE_TOP - 1} fontSize={9} className={C.axisTextClass}>
            Mbps
          </text>

          {BUFFER_TICKS.map((tick) => (
            <g key={`buffer-${tick}`}>
              <line x1={C.padLeft} x2={C.width - C.padRight} y1={bufferY(tick)} y2={bufferY(tick)} stroke={C.gridColor} />
              <text x={C.padLeft - 6} y={bufferY(tick) + 3} textAnchor="end" fontSize={9} className={C.axisTextClass}>
                {tick}
              </text>
            </g>
          ))}
          <text x={C.padLeft} y={BUFFER_TOP - 5} fontSize={9} className={C.axisTextClass}>
            Buffer, seconds ahead
          </text>

          {/* Freezes, shaded across both charts. */}
          {segments.map((segment) =>
            segment.stallSeconds > 0 ? (
              <g key={`stall-${segment.index}`}>
                <rect x={x(segment.index)} y={RATE_TOP} width={segmentWidth} height={C.rateHeight} fill={C.stallColor} fillOpacity={0.12} />
                <rect x={x(segment.index)} y={BUFFER_TOP} width={segmentWidth} height={C.bufferHeight} fill={C.stallColor} fillOpacity={0.12} />
              </g>
            ) : null,
          )}

          <path d={networkArea} fill={C.networkColor} fillOpacity={0.14} />
          <path d={networkLine} fill="none" stroke={C.networkColor} strokeWidth={1} />
          <path d={pickedLine} fill="none" stroke={C.pickedColor} strokeWidth={2} strokeLinejoin="round" />
          <path d={bufferLine} fill="none" stroke="#d4d4d4" strokeWidth={2} strokeLinejoin="round" />

          {/* Direct label for the picked quality, in text ink, not the series color. */}
          <text
            x={C.width - C.padRight - 4}
            y={rateY(ABR_LADDER[last.rendition].mbps) - 6}
            textAnchor="end"
            fontSize={10}
            stroke="#0d0d0d"
            strokeWidth={3}
            paintOrder="stroke"
            className="fill-neutral-200 font-mono"
          >
            picked: {ABR_LADDER[last.rendition].label}
          </text>

          {segments.map((segment) =>
            segment.index % TIME_TICK_EVERY === 0 ? (
              <text key={`time-${segment.index}`} x={x(segment.index)} y={HEIGHT - 6} textAnchor="middle" fontSize={9} className={C.axisTextClass}>
                {formatTime(segment.index * ABR.segmentSeconds)}
              </text>
            ) : null,
          )}
          <text x={x(segments.length)} y={HEIGHT - 6} textAnchor="end" fontSize={9} className={C.axisTextClass}>
            {formatTime(segments.length * ABR.segmentSeconds)}
          </text>

          {hovered !== null && (
            <rect
              x={x(hovered)}
              y={RATE_TOP}
              width={segmentWidth}
              height={BUFFER_BOTTOM - RATE_TOP}
              fill="#ffffff"
              fillOpacity={0.06}
              stroke="#525252"
              pointerEvents="none"
            />
          )}

          {/* Hit targets: one full-height column per segment. */}
          {segments.map((segment) => (
            <rect
              key={`hit-${segment.index}`}
              x={x(segment.index)}
              y={RATE_TOP}
              width={segmentWidth}
              height={BUFFER_BOTTOM - RATE_TOP}
              fill="transparent"
              onMouseEnter={() => setHovered(segment.index)}
            />
          ))}
        </svg>
      </div>

      <figcaption className={cn('mt-2 flex flex-wrap gap-x-4 gap-y-1', FLOW_METER_LABEL_CLASS)}>
        <span>
          <span style={{ color: C.networkColor }}>&#9632;</span> Network bandwidth
        </span>
        <span>
          <span style={{ color: C.pickedColor }}>&#9644;</span> Quality the player picked
        </span>
        <span>
          <span className="text-neutral-300">&#9644;</span> Buffer
        </span>
        <span>
          <span className="text-red-500">&#9632;</span> Picture frozen
        </span>
      </figcaption>
    </figure>
  );
};

export default AbrChart;
