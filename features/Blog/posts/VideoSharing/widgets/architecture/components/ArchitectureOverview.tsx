import React, { useId } from 'react';
import { Network } from 'lucide-react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/utils/cn';
import WidgetFrame from '@/features/Blog/components/WidgetFrame';
import ToggleButton from '@/features/Blog/components/ToggleButton';
import { FlowEdge, FlowEdgeLabels, FlowMarkers, FlowNode } from '@/features/Blog/flow/components/FlowParts';
import {
  ARCHITECTURE_CATEGORIES,
  ARCHITECTURE_DIAGRAM,
  ARCHITECTURE_EDGE_LABELS,
  ARCHITECTURE_EDGES,
  ARCHITECTURE_GROUPS,
  ARCHITECTURE_NODES,
  ARCHITECTURE_VIEWS,
} from '../constants';
import { useArchitectureOverview } from '../hooks/useArchitectureOverview';
import type { ArchitectureNodeId } from '../types';
import NodeDetailPanel from '../../shared/components/NodeDetailPanel';
import ArchitectureGroups from './ArchitectureGroups';
import ArchitectureLegend from './ArchitectureLegend';

const NODE_ENTRIES = Object.entries(ARCHITECTURE_NODES) as [ArchitectureNodeId, (typeof ARCHITECTURE_NODES)[ArchitectureNodeId]][];
const EDGE_ENTRIES = Object.entries(ARCHITECTURE_EDGES);

/**
 * The whole system on one diagram. Readers can light up one flow or click a
 * component to see what it does and what it talks to.
 */
const ArchitectureOverview: React.FC = () => {
  const overview = useArchitectureOverview();
  const reduceMotion = usePrefersReducedMotion();
  const markerBase = useId().replace(/:/g, '');
  const idleMarker = `${markerBase}-idle`;
  const activeMarker = `${markerBase}-active`;
  const edgeColor = ARCHITECTURE_DIAGRAM.edgeColor;

  return (
    <WidgetFrame title="System architecture" icon={Network}>
      <div className="flex flex-col gap-5 p-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Flow">
            {ARCHITECTURE_VIEWS.map((option) => {
              const isSelected = option.id === overview.view;
              return (
                <ToggleButton
                  key={option.id}
                  selected={isSelected}
                  onClick={() => overview.setView(option.id)}
                >
                  {option.label}
                </ToggleButton>
              );
            })}
          </div>
          <div className="text-xs leading-relaxed text-neutral-500">{overview.viewOption.summary}</div>
        </div>

        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${ARCHITECTURE_DIAGRAM.width} ${ARCHITECTURE_DIAGRAM.height}`}
            aria-label="Architecture of the distributed video streaming system"
            className={cn('block h-auto w-full', ARCHITECTURE_DIAGRAM.minWidthClass)}
          >
            <FlowMarkers idleId={idleMarker} activeId={activeMarker} activeColor={edgeColor} />
            <ArchitectureGroups activeNodeIds={overview.activeNodeIds} />
            <ArchitectureLegend />

            {EDGE_ENTRIES.map(([id, edge]) => {
              const isActive = overview.activeEdgeIds.has(id);
              return (
                <FlowEdge
                  key={id}
                  path={edge.path}
                  particleKey={`${overview.view}-${overview.selectedId ?? 'none'}`}
                  isActive={isActive}
                  color={edgeColor}
                  animated={overview.animateEdges && !reduceMotion}
                  markerUrl={isActive ? activeMarker : idleMarker}
                />
              );
            })}

            {/* After the edges, so a label sits on top of any line that crosses it. */}
            <FlowEdgeLabels labels={ARCHITECTURE_EDGE_LABELS} />

            {NODE_ENTRIES.map(([id, node]) => (
              <FlowNode
                key={id}
                x={node.x}
                y={node.y}
                width={ARCHITECTURE_DIAGRAM.nodeWidth}
                height={ARCHITECTURE_DIAGRAM.nodeHeight}
                label={node.label}
                caption={node.caption}
                isActive={overview.activeNodeIds.has(id)}
                isHighlighted={id === overview.selectedId}
                isSelected={id === overview.selectedId}
                color={ARCHITECTURE_CATEGORIES[node.category].color}
                icon={node.icon}
                stacked={node.scalesOut}
                onSelect={() => overview.toggleNode(id)}
              />
            ))}
          </svg>
        </div>

        <NodeDetailPanel
          selected={overview.selected}
          neighbors={overview.neighbors}
          categoryNote={
            overview.selected?.group && (
              <span className="text-neutral-500"> · part of the {ARCHITECTURE_GROUPS[overview.selected.group].label}</span>
            )
          }
          hint="Click a component to see what it does and what it talks to."
          onClear={overview.clearSelection}
        />
      </div>
    </WidgetFrame>
  );
};

export default ArchitectureOverview;
