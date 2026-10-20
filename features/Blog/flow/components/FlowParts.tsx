import React, { useRef } from 'react';
import type { LucideIcon } from 'lucide-react';
import { FLOW_DIAGRAM } from '../constants';
import { WIDGET_COLORS } from '@/features/Blog/components/widgetStyles';
import { usePauseSvgOffscreen } from '../hooks/usePauseSvgOffscreen';

const PARTICLE_INDEXES = Array.from({ length: FLOW_DIAGRAM.particleCount }, (_, index) => index);

interface FlowMarkersProps {
  idleId: string;
  activeId: string;
  activeColor: string;
}

/**
 * Arrow heads for idle and active edges. Every flow SVG renders this once, so it also
 * pauses that SVG's moving dots while the diagram is off screen.
 */
export const FlowMarkers: React.FC<FlowMarkersProps> = ({ idleId, activeId, activeColor }) => {
  const ref = useRef<SVGDefsElement>(null);
  usePauseSvgOffscreen(ref);

  return (
    <defs ref={ref}>
      {[
        { id: idleId, fill: WIDGET_COLORS.idle },
        { id: activeId, fill: activeColor },
      ].map((marker) => (
        <marker key={marker.id} id={marker.id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill={marker.fill} />
        </marker>
      ))}
    </defs>
  );
};

interface FlowEdgeProps {
  path: string;
  /** Changes when the particles should restart from the beginning of the path. */
  particleKey: string;
  isActive: boolean;
  color: string;
  animated: boolean;
  markerUrl: string;
}

/** A route between two nodes. When active it is colored and can carry moving dots. */
export const FlowEdge: React.FC<FlowEdgeProps> = ({ path, particleKey, isActive, color, animated, markerUrl }) => (
  <g>
    <path
      d={path}
      fill="none"
      stroke={isActive ? color : WIDGET_COLORS.idle}
      strokeWidth={isActive ? 2 : 1.25}
      strokeOpacity={isActive ? 1 : 0.6}
      markerEnd={`url(#${markerUrl})`}
    />
    {isActive &&
      animated &&
      PARTICLE_INDEXES.map((index) => (
        <circle key={`${particleKey}-${index}`} r={FLOW_DIAGRAM.particleRadius} fill={color}>
          <animateMotion
            dur={`${FLOW_DIAGRAM.particleSeconds}s`}
            begin={`-${(index * FLOW_DIAGRAM.particleSeconds) / FLOW_DIAGRAM.particleCount}s`}
            repeatCount="indefinite"
            path={path}
          />
        </circle>
      ))}
  </g>
);

interface FlowNodeProps {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  caption: string;
  isActive: boolean;
  isHighlighted: boolean;
  color: string;
  /** Makes the node a button. */
  onSelect?: () => void;
  isSelected?: boolean;
  /** Badge in the top-left corner. */
  icon?: LucideIcon;
  /** Draws a second box behind it: a fleet of identical copies that scales out. */
  stacked?: boolean;
}

const BADGE = { radius: 11, iconSize: 12 } as const;
/** How far the copy behind a stacked node is shifted, up and to the right. */
export const STACK_OFFSET = 5;
/** Matches the widget background, so the halo reads as a gap in the line. */
const LABEL_HALO_COLOR = '#0d0d0d';

/** A component box. With onSelect it can be clicked or picked with the keyboard. */
export const FlowNode: React.FC<FlowNodeProps> = ({
  x,
  y,
  width,
  height,
  label,
  caption,
  isActive,
  isHighlighted,
  color,
  onSelect,
  isSelected = false,
  icon: Icon,
  stacked = false,
}) => {
  const interactive = onSelect
    ? {
        role: 'button',
        tabIndex: 0,
        'aria-pressed': isSelected,
        'aria-label': label,
        onClick: onSelect,
        onKeyDown: (event: React.KeyboardEvent) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onSelect();
          }
        },
        className: 'cursor-pointer outline-none [&:focus-visible>rect]:stroke-accent-brand',
      }
    : {};

  return (
    <g transform={`translate(${x} ${y})`} opacity={isActive ? 1 : 0.55} {...interactive}>
      {stacked && (
        <rect
          x={STACK_OFFSET}
          y={-STACK_OFFSET}
          width={width}
          height={height}
          rx={FLOW_DIAGRAM.nodeRadius}
          fill="#0d0d0d"
          stroke={isActive ? color : WIDGET_COLORS.idle}
          strokeOpacity={0.5}
          className="pointer-events-none"
        />
      )}
      <rect
        width={width}
        height={height}
        rx={FLOW_DIAGRAM.nodeRadius}
        fill="#0d0d0d"
        stroke={isActive ? color : WIDGET_COLORS.idle}
        strokeWidth={isSelected ? 3 : isActive ? 2 : 1}
      />
      <text x={width / 2} y={21} textAnchor="middle" fontSize={12} fontWeight={700} className="pointer-events-none fill-neutral-200 font-mono uppercase">
        {label}
      </text>
      <text
        x={width / 2}
        y={38}
        textAnchor="middle"
        fontSize={10}
        fill={isHighlighted && isActive ? color : WIDGET_COLORS.text}
        className="pointer-events-none font-mono"
      >
        {caption}
      </text>
      {Icon && (
        <g className="pointer-events-none">
          <circle r={BADGE.radius} fill="#0d0d0d" stroke={isActive ? color : WIDGET_COLORS.idle} strokeWidth={1.5} />
          <Icon
            x={-BADGE.iconSize / 2}
            y={-BADGE.iconSize / 2}
            width={BADGE.iconSize}
            height={BADGE.iconSize}
            color={isActive ? color : WIDGET_COLORS.text}
            aria-hidden="true"
          />
        </g>
      )}
    </g>
  );
};

interface FlowEdgeLabelsProps {
  labels: { x: number; y: number; text: string }[];
}

/** Small gray words next to the routes, with a halo so a crossing line never cuts through them. */
export const FlowEdgeLabels: React.FC<FlowEdgeLabelsProps> = ({ labels }) => (
  <>
    {labels.map((edgeLabel) => (
      <text
        key={`${edgeLabel.text}-${edgeLabel.x}-${edgeLabel.y}`}
        x={edgeLabel.x}
        y={edgeLabel.y}
        fontSize={9}
        stroke={LABEL_HALO_COLOR}
        strokeWidth={3}
        paintOrder="stroke"
        className="pointer-events-none fill-neutral-600 font-mono"
      >
        {edgeLabel.text}
      </text>
    ))}
  </>
);
