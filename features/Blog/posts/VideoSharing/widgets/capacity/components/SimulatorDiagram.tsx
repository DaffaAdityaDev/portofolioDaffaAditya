import React, { useId, useRef } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { clamp } from '@/utils/math';
import { cn } from '@/utils/cn';
import type {
  DiagramEdge,
  EdgeCondition,
  NodeMetric,
  VideoDesignChoices,
  VideoNodeId,
} from '../types';
import { STATUS_COLORS } from '../constants';
import {
  DIAGRAM,
  DIAGRAM_EDGES,
  DIAGRAM_HEIGHT,
  DIAGRAM_WIDTH,
  NODE_HEIGHT,
  NODE_IDS,
  NODE_LAYOUT,
  NODE_WIDTH,
} from '../constants/diagram';
import { FLOW_DIAGRAM } from '@/features/Blog/flow/constants';
import { usePauseSvgOffscreen } from '@/features/Blog/flow/hooks/usePauseSvgOffscreen';
import { useVideoDesign } from '../hooks/useVideoDesign';

const EDGE_VISIBILITY: Record<EdgeCondition, (choices: VideoDesignChoices) => boolean> = {
  cacheOn: (choices) => choices.cacheEnabled,
  cacheOff: (choices) => !choices.cacheEnabled,
  cdnOn: (choices) => choices.cdnEnabled,
  cdnOff: (choices) => !choices.cdnEnabled,
};

interface FlowEdgeProps {
  edge: DiagramEdge;
  target: NodeMetric;
  duration: number;
  animated: boolean;
  markerId: string;
}

/** A route between two nodes. Moving dots show traffic: more dots when busier. */
const FlowEdge: React.FC<FlowEdgeProps> = ({ edge, target, duration, animated, markerId }) => {
  const color = target.status === 'ok' ? DIAGRAM.idleColor : STATUS_COLORS[target.status];
  const dotColor = target.status === 'ok' ? '#d4d4d4' : STATUS_COLORS[target.status];
  const count = clamp(Math.ceil(target.load * DIAGRAM.maxParticles), 1, DIAGRAM.maxParticles);

  return (
    <g>
      <path
        d={edge.path}
        fill="none"
        stroke={color}
        strokeWidth={DIAGRAM.edgeStrokeWidth}
        strokeOpacity={DIAGRAM.edgeOpacity}
        strokeDasharray={edge.bypass ? '4 4' : undefined}
        markerEnd={`url(#${markerId})`}
      />
      {animated &&
        Array.from({ length: count }, (_, index) => (
          <circle key={index} r={DIAGRAM.particleRadius} fill={dotColor}>
            <animateMotion
              dur={`${duration}s`}
              begin={`-${(index * duration) / count}s`}
              repeatCount="indefinite"
              path={edge.path}
            />
          </circle>
        ))}
    </g>
  );
};

const DiagramNode: React.FC<{ id: VideoNodeId; metric: NodeMetric }> = ({ id, metric }) => {
  const { x, y, label } = NODE_LAYOUT[id];
  const color = STATUS_COLORS[metric.status];
  const isOff = metric.status === 'off';
  const barWidth = (NODE_WIDTH - DIAGRAM.barInset * 2) * clamp(metric.load, 0, 1);

  return (
    <g transform={`translate(${x} ${y})`}>
      <title>{`${label}: ${metric.detail}`}</title>
      <rect
        width={NODE_WIDTH}
        height={NODE_HEIGHT}
        rx={DIAGRAM.nodeRadius}
        fill="#0d0d0d"
        stroke={color}
        strokeWidth={metric.status === 'critical' ? 2 : 1}
        strokeDasharray={isOff ? '4 3' : undefined}
        className={cn(metric.status === 'critical' && 'animate-pulse')}
      />
      <text x={NODE_WIDTH / 2} y={19} textAnchor="middle" fontSize={11} className="fill-neutral-400 font-mono uppercase">
        {label}
      </text>
      <text x={NODE_WIDTH / 2} y={36} textAnchor="middle" fontSize={14} fontWeight={700} fill={isOff ? '#737373' : color} className="font-mono">
        {metric.headline}
      </text>
      {!isOff && id !== 'clients' && (
        <rect x={DIAGRAM.barInset} y={NODE_HEIGHT - 8} width={barWidth} height={DIAGRAM.barHeight} fill={color} />
      )}
    </g>
  );
};

/** Architecture drawn as SVG. Color shows health, moving dots show traffic. */
const SimulatorDiagram: React.FC = () => {
  const { choices, metrics, sim, bottleneck } = useVideoDesign();
  const reduceMotion = usePrefersReducedMotion();
  const markerId = `arrow-${useId().replace(/:/g, '')}`;
  const svgRef = useRef<SVGSVGElement>(null);
  usePauseSvgOffscreen(svgRef);
  // Rounded so the animation is not restarted on every tiny change while traffic ramps.
  const duration =
    Math.round(
      clamp(
        DIAGRAM.baseParticleSeconds / Math.sqrt(sim.multiplier),
        DIAGRAM.minParticleSeconds,
        DIAGRAM.baseParticleSeconds,
      ) * DIAGRAM.durationSteps,
    ) / DIAGRAM.durationSteps;
  const summary = bottleneck.nodeId
    ? `${NODE_LAYOUT[bottleneck.nodeId].label} is the most loaded component`
    : 'All components have headroom';

  return (
    <div className="overflow-x-auto">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${DIAGRAM_WIDTH} ${DIAGRAM_HEIGHT}`}
        role="img"
        aria-label={`Video service architecture. ${summary}.`}
        className={cn('block h-auto w-full', FLOW_DIAGRAM.minWidthClass)}
      >
        <defs>
          <marker id={markerId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill={DIAGRAM.idleColor} />
          </marker>
        </defs>
        {DIAGRAM_EDGES.filter((edge) => !edge.visibleWhen || EDGE_VISIBILITY[edge.visibleWhen](choices)).map(
          (edge) => (
            <FlowEdge
              key={edge.id}
              edge={edge}
              target={metrics[edge.loadNode]}
              duration={duration}
              animated={!reduceMotion}
              markerId={markerId}
            />
          ),
        )}
        {NODE_IDS.map((id) => (
          <DiagramNode key={id} id={id} metric={metrics[id]} />
        ))}
      </svg>
    </div>
  );
};

export default SimulatorDiagram;
