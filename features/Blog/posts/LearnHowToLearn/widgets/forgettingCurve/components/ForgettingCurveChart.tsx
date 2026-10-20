import React from 'react';
import { cn } from '@/utils/cn';
import type { CurvePoint, CurveResult } from '../types';
import { WIDGET_LABEL_CLASS } from '@/features/Blog/components/widgetStyles';
import { CURVE_CHART as C, CURVE_MODEL } from '../constants';

const PLOT_WIDTH = C.width - C.padLeft - C.padRight;
const PLOT_BOTTOM = C.height - C.padBottom;
const PLOT_HEIGHT = PLOT_BOTTOM - C.padTop;
const RECALL_TICKS = [0, 0.25, 0.5, 0.75, 1];
const DAY_TICKS = [0, 5, 10, 15, 20, 25, 30];

const x = (day: number) => C.padLeft + (day / CURVE_MODEL.days) * PLOT_WIDTH;
const y = (recall: number) => PLOT_BOTTOM - recall * PLOT_HEIGHT;

const linePath = (points: CurvePoint[]) =>
  points.map((point, index) => `${index === 0 ? 'M' : 'L'}${x(point.day).toFixed(1)},${y(point.recall).toFixed(1)}`).join(' ');

/** Modeled recall over 30 days for the chosen schedule, with the no-review curve behind it. */
const ForgettingCurveChart: React.FC<{ result: CurveResult }> = ({ result }) => (
  <figure className="m-0">
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${C.width} ${C.height}`}
        role="img"
        aria-label={`Modeled recall over ${CURVE_MODEL.days} days with ${result.reviews.length} reviews. Average recall: ${Math.round(result.averageRecall * 100)}%. Recall at day ${CURVE_MODEL.days}: ${Math.round(result.recallAtEnd * 100)}%.`}
        className={cn('block h-auto w-full', C.minWidthClass)}
      >
        {RECALL_TICKS.map((tick) => (
          <g key={`recall-${tick}`}>
            <line x1={C.padLeft} x2={C.width - C.padRight} y1={y(tick)} y2={y(tick)} stroke={C.gridColor} />
            <text x={C.padLeft - 6} y={y(tick) + 3} textAnchor="end" fontSize={9} className={C.axisTextClass}>
              {tick * 100}%
            </text>
          </g>
        ))}
        <text x={C.padLeft} y={C.padTop - 3} fontSize={9} className={C.axisTextClass}>
          recall
        </text>

        {DAY_TICKS.map((day) => (
          <text key={`day-${day}`} x={x(day)} y={C.height - 8} textAnchor="middle" fontSize={9} className={C.axisTextClass}>
            {day === 0 ? 'day 0' : day}
          </text>
        ))}

        <path d={linePath(result.baseline)} fill="none" stroke={C.baselineColor} strokeOpacity={0.5} strokeWidth={1.5} />
        <path d={linePath(result.points)} fill="none" stroke={C.curveColor} strokeWidth={2} strokeLinejoin="round" />

        {result.reviews.map((review) => (
          <g key={`review-${review.day}`}>
            <line x1={x(review.day)} x2={x(review.day)} y1={y(review.recall)} y2={y(1)} stroke={C.reviewColor} strokeWidth={1} />
            <circle cx={x(review.day)} cy={y(review.recall)} r={3.5} fill={C.reviewColor} />
          </g>
        ))}
      </svg>
    </div>

    <figcaption className={cn('mt-2 flex flex-wrap gap-x-4 gap-y-1', WIDGET_LABEL_CLASS)}>
      <span>
        <span className="text-neutral-300">&#9644;</span> Your schedule
      </span>
      <span>
        <span className="text-red-500/60">&#9644;</span> No review
      </span>
      <span>
        <span className="text-red-500">&#9679;</span> Review
      </span>
    </figcaption>
  </figure>
);

export default ForgettingCurveChart;
