import React, { useId } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/utils/cn';
import type { FlowConfig, FlowStep } from '@/features/Blog/flow/types';
import { FLOW_COLORS, FLOW_DIAGRAM } from '../constants';
import { useFlow } from '../hooks/useFlow';
import { FlowEdge, FlowEdgeLabels, FlowMarkers, FlowNode } from './FlowParts';

/** A flow as SVG. The nodes and routes the current step touches light up. */
const FlowDiagram = <TStep extends FlowStep>({ flow }: { flow: FlowConfig<TStep> }) => {
  const { definition, step, stepIndex, totalSteps } = useFlow(flow);
  const reduceMotion = usePrefersReducedMotion();
  const markerBase = useId().replace(/:/g, '');
  const color = FLOW_COLORS[step.tone ?? 'normal'];
  const idleMarker = `${markerBase}-idle`;
  const activeMarker = `${markerBase}-active`;

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${definition.width} ${definition.height}`}
        role="img"
        aria-label={`${definition.name}, step ${stepIndex + 1} of ${totalSteps}: ${step.title}`}
        className={cn('block h-auto w-full', FLOW_DIAGRAM.minWidthClass)}
      >
        <FlowMarkers idleId={idleMarker} activeId={activeMarker} activeColor={color} />
        <FlowEdgeLabels labels={definition.edgeLabels} />

        {Object.entries(definition.edges).map(([id, edge]) => {
          const isActive = step.activeEdges.includes(id);
          return (
            <FlowEdge
              key={id}
              path={edge.path}
              particleKey={step.id}
              isActive={isActive}
              color={color}
              animated={!reduceMotion}
              markerUrl={isActive ? activeMarker : idleMarker}
            />
          );
        })}

        {Object.entries(definition.nodes).map(([id, node]) => {
          const override = step.labels?.[id] ?? definition.liveCaption?.(id, step);
          return (
            <FlowNode
              key={id}
              x={node.x}
              y={node.y}
              width={definition.nodeWidth}
              height={definition.nodeHeight}
              label={node.label}
              caption={override ?? node.caption}
              isActive={step.activeNodes.includes(id)}
              isHighlighted={override !== undefined}
              color={color}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default FlowDiagram;
