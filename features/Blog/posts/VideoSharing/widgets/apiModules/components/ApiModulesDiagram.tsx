import React, { useId } from 'react';
import { Boxes, X } from 'lucide-react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/utils/cn';
import type { ApiModuleNodeId } from '@/features/Blog/posts/VideoSharing/widgets/apiModules/types';
import WidgetFrame from '@/features/Blog/components/WidgetFrame';
import { ARCHITECTURE_CATEGORIES } from '../../architecture/constants';
import { FlowEdge, FlowEdgeLabels, FlowMarkers, FlowNode } from '@/features/Blog/flow/components/FlowParts';
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

        <div className="min-h-[96px] border border-neutral-800 bg-[#0a0a0a] p-3" role="status" aria-live="polite">
          {diagram.selected ? (
            <>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-white">{diagram.selected.name}</div>
                  <div
                    className="mt-0.5 font-mono text-[11px] uppercase tracking-wider"
                    style={{ color: ARCHITECTURE_CATEGORIES[diagram.selected.category].color }}
                  >
                    {ARCHITECTURE_CATEGORIES[diagram.selected.category].label}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={diagram.clearSelection}
                  aria-label="Clear selection"
                  className="cursor-pointer text-neutral-500 transition-colors hover:text-white"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-1 text-sm leading-relaxed text-neutral-400">{diagram.selected.description}</div>
              {diagram.neighbors.length > 0 && (
                <div className="mt-2 font-mono text-[11px] uppercase tracking-wider text-neutral-500">
                  Talks to: {diagram.neighbors.join(', ')}
                </div>
              )}
            </>
          ) : (
            <div className="text-sm text-neutral-500">Click a module or a store to see what it does and what it talks to.</div>
          )}
        </div>
      </div>
    </WidgetFrame>
  );
};

export default ApiModulesDiagram;
