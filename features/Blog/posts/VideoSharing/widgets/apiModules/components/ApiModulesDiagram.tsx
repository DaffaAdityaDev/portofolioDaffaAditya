import React, { useId } from 'react';
import { Boxes } from 'lucide-react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/utils/cn';
import WidgetFrame from '@/features/Blog/components/WidgetFrame';
import { FlowEdge, FlowEdgeLabels, FlowMarkers, FlowNode } from '@/features/Blog/flow/components/FlowParts';
import { ARCHITECTURE_CATEGORIES } from '../../architecture/constants';
import NodeDetailPanel from '../../shared/components/NodeDetailPanel';
import type { ApiModuleNodeId } from '../types';
import { API_MODULE_EDGE_LABELS, API_MODULE_EDGES, API_MODULE_NODES, API_MODULES_DIAGRAM, API_MODULES_SUMMARY } from '../constants';
import { useApiModulesDiagram } from '../hooks/useApiModulesDiagram';

const NODE_ENTRIES = Object.entries(API_MODULE_NODES) as [ApiModuleNodeId, (typeof API_MODULE_NODES)[ApiModuleNodeId]][];
const EDGE_ENTRIES = Object.entries(API_MODULE_EDGES);

/**
 * The API tier from the inside: one codebase split into modules, each with its
 * own data store, and the counters fed through events instead of direct writes.
 */
const ApiModulesDiagram: React.FC = () => {
  const diagram = useApiModulesDiagram();
  const reduceMotion = usePrefersReducedMotion();
  const markerBase = useId().replace(/:/g, '');
  const idleMarker = `${markerBase}-idle`;
  const activeMarker = `${markerBase}-active`;
  const { edgeColor, group } = API_MODULES_DIAGRAM;

  return (
    <WidgetFrame title="Inside the API service" icon={Boxes}>
      <div className="flex flex-col gap-5 p-4">
        <div className="text-xs leading-relaxed text-neutral-500">{API_MODULES_SUMMARY}</div>

        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${API_MODULES_DIAGRAM.width} ${API_MODULES_DIAGRAM.height}`}
            aria-label="Modules of the API service and their data stores"
            className={cn('block h-auto w-full', API_MODULES_DIAGRAM.minWidthClass)}
          >
            <FlowMarkers idleId={idleMarker} activeId={activeMarker} activeColor={edgeColor} />

            <g className="pointer-events-none">
              <rect
                x={group.x}
                y={group.y}
                width={group.width}
                height={group.height}
                rx={4}
                fill="#ffffff"
                fillOpacity={0.015}
                stroke="#525252"
                strokeDasharray="5 4"
              />
              <text
                x={group.x + API_MODULES_DIAGRAM.groupTitleInset}
                y={group.y + API_MODULES_DIAGRAM.groupTitleOffset}
                fontSize={10}
                className="font-mono uppercase"
              >
                <tspan fontWeight={700} className="fill-neutral-300">
                  {group.label}
                </tspan>
                <tspan dx={8} className="fill-neutral-600">
                  {group.caption}
                </tspan>
              </text>
            </g>

            {EDGE_ENTRIES.map(([id, edge]) => {
              const isActive = diagram.activeEdgeIds.has(id);
              return (
                <FlowEdge
                  key={id}
                  path={edge.path}
                  particleKey={diagram.selectedId ?? 'none'}
                  isActive={isActive}
                  color={edgeColor}
                  animated={diagram.selectedId !== null && !reduceMotion}
                  markerUrl={isActive ? activeMarker : idleMarker}
                />
              );
            })}

            <FlowEdgeLabels labels={API_MODULE_EDGE_LABELS} />

            {NODE_ENTRIES.map(([id, node]) => (
              <FlowNode
                key={id}
                x={node.x}
                y={node.y}
                width={API_MODULES_DIAGRAM.nodeWidth}
                height={API_MODULES_DIAGRAM.nodeHeight}
                label={node.label}
                caption={node.caption}
                isActive={diagram.activeNodeIds.has(id)}
                isHighlighted={id === diagram.selectedId}
                isSelected={id === diagram.selectedId}
                color={ARCHITECTURE_CATEGORIES[node.category].color}
                icon={node.icon}
                stacked={node.scalesOut}
                onSelect={() => diagram.toggleNode(id)}
              />
            ))}
          </svg>
        </div>

        <NodeDetailPanel
          selected={diagram.selected}
          neighbors={diagram.neighbors}
          hint="Click a module or a store to see what it does and what it talks to."
          onClear={diagram.clearSelection}
        />
      </div>
    </WidgetFrame>
  );
};

export default ApiModulesDiagram;
