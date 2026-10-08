import React, { useId } from 'react';
import { cn } from '@/utils/cn';
import type { SequenceDefinition, SequenceLane, SequenceMessage, SequenceMessageKind } from '@/features/Blog/sequence/types';
import WidgetFrame from '../../components/WidgetFrame';
import { SEQUENCE_LAYOUT, SEQUENCE_MESSAGE_STYLES } from '../constants';

const L = SEQUENCE_LAYOUT;
const MESSAGE_KINDS = Object.keys(SEQUENCE_MESSAGE_STYLES) as SequenceMessageKind[];

interface PlacedMessage extends SequenceMessage {
  y: number;
}

interface PlacedStep {
  number: number;
  title: string;
  top: number;
  bottom: number;
  messages: PlacedMessage[];
}

/** Gives every step and message its vertical position, top to bottom. */
const layout = (definition: SequenceDefinition): { steps: PlacedStep[]; height: number } => {
  let y = L.firstRowY;
  const steps = definition.steps.map((step) => {
    const top = y;
    y += L.stepGap;
    const messages = step.messages.map((message) => {
      const placed = { ...message, y };
      y += L.rowHeight;
      return placed;
    });
    return { number: step.number, title: step.title, top, bottom: y, messages };
  });
  return { steps, height: y + L.bottomPadding };
};

const MessageArrow: React.FC<{
  message: PlacedMessage;
  lanes: Record<string, SequenceLane>;
  markerId: (kind: SequenceMessageKind) => string;
}> = ({ message, lanes, markerId }) => {
  const fromX = lanes[message.from].x;
  const toX = lanes[message.to].x;
  const direction = toX > fromX ? 1 : -1;
  const style = SEQUENCE_MESSAGE_STYLES[message.kind];
  const lineY = message.y + 6;

  return (
    <g>
      <line
        x1={fromX}
        x2={toX - direction * L.arrowGap}
        y1={lineY}
        y2={lineY}
        stroke={style.color}
        strokeWidth={style.width}
        strokeDasharray={style.dash}
        markerEnd={`url(#${markerId(message.kind)})`}
      />
      <text
        x={(fromX + toX) / 2}
        y={lineY - 5}
        textAnchor="middle"
        fontSize={9.5}
        stroke="#0d0d0d"
        strokeWidth={3}
        paintOrder="stroke"
        className={cn('font-mono', message.kind === 'bytes' ? 'fill-rose-300' : 'fill-neutral-400')}
      >
        {message.text}
      </text>
    </g>
  );
};

/**
 * Numbered steps as a sequence diagram: one lane per component, time running
 * down, with the video bytes drawn apart from the control calls.
 */
const SequenceDiagram = <TLane extends string>({ definition }: { definition: SequenceDefinition<TLane> }) => {
  const base = useId().replace(/:/g, '');
  const markerId = (kind: SequenceMessageKind) => `${base}-${kind}`;
  const lanes = definition.lanes as Record<string, SequenceLane>;
  const laneEntries = Object.entries(lanes);
  const { steps, height } = layout(definition as SequenceDefinition);
  const lifelineTop = L.laneHeaderY + L.laneHeaderHeight;
  const lifelineBottom = steps[steps.length - 1].bottom;
  const legendY = height - 16;

  return (
    <WidgetFrame title={definition.title} icon={definition.icon}>
      <div className="overflow-x-auto p-4">
        <svg
          viewBox={`0 0 ${definition.width} ${height}`}
          role="img"
          aria-label={definition.ariaLabel}
          className={cn('block h-auto w-full', definition.minWidthClass)}
        >
          <defs>
            {MESSAGE_KINDS.map((kind) => (
              <marker key={kind} id={markerId(kind)} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0,0 L10,5 L0,10 z" fill={SEQUENCE_MESSAGE_STYLES[kind].color} />
              </marker>
            ))}
          </defs>

          {steps.map((step, index) => (
            <rect
              key={step.number}
              x={0}
              y={step.top}
              width={definition.width}
              height={step.bottom - step.top}
              fill={L.bandColor}
              fillOpacity={index % 2 === 0 ? 0.025 : 0}
            />
          ))}

          {laneEntries.map(([id, lane]) => (
            <g key={id}>
              <line x1={lane.x} x2={lane.x} y1={lifelineTop} y2={lifelineBottom} stroke="#404040" strokeDasharray="3 4" />
              <rect
                x={lane.x - L.laneHeaderWidth / 2}
                y={L.laneHeaderY}
                width={L.laneHeaderWidth}
                height={L.laneHeaderHeight}
                rx={2}
                fill="#0d0d0d"
                stroke="#525252"
              />
              <text x={lane.x} y={L.laneHeaderY + 17} textAnchor="middle" fontSize={11} fontWeight={700} className="fill-neutral-200 font-mono uppercase">
                {lane.label}
              </text>
              <text x={lane.x} y={L.laneHeaderY + 32} textAnchor="middle" fontSize={9.5} className="fill-neutral-500 font-mono">
                {lane.caption}
              </text>
            </g>
          ))}

          {/* After the lifelines, so the step titles sit on top of them. */}
          {steps.map((step) => (
            <text
              key={step.number}
              x={L.stepLabelX}
              y={step.top + 15}
              fontSize={10}
              stroke="#0d0d0d"
              strokeWidth={3}
              paintOrder="stroke"
              className="font-mono uppercase"
            >
              <tspan fontWeight={700} className="fill-red-500">
                {step.number}
              </tspan>
              <tspan dx={8} className="fill-neutral-300">
                {step.title}
              </tspan>
            </text>
          ))}

          {steps.flatMap((step) =>
            step.messages.map((message, index) => (
              <MessageArrow key={`${step.number}-${index}`} message={message} lanes={lanes} markerId={markerId} />
            )),
          )}

          <g transform={`translate(${L.stepLabelX} ${legendY})`} fontSize={10} className="font-mono">
            {definition.legend.map((entry, index) => {
              const style = SEQUENCE_MESSAGE_STYLES[entry.kind];
              return (
                <g key={entry.kind} transform={`translate(${index * L.legendSpacing} 0)`}>
                  <line x1={0} x2={24} y1={-3} y2={-3} stroke={style.color} strokeWidth={style.width} strokeDasharray={style.dash} />
                  <text x={30} className="fill-neutral-500">
                    {entry.text}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </WidgetFrame>
  );
};

export default SequenceDiagram;
