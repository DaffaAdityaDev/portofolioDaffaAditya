import React from 'react';
import type { ArchitectureGroupId, ArchitectureNodeId } from '@/features/Blog/posts/VideoSharing/widgets/architecture/types';
import { ARCHITECTURE_DIAGRAM, ARCHITECTURE_GROUPS, ARCHITECTURE_NODES } from '../constants';

const GROUP_ENTRIES = Object.entries(ARCHITECTURE_GROUPS) as [
  ArchitectureGroupId,
  (typeof ARCHITECTURE_GROUPS)[ArchitectureGroupId],
][];

const MEMBERS: Record<ArchitectureGroupId, ArchitectureNodeId[]> = GROUP_ENTRIES.reduce(
  (members, [groupId]) => ({
    ...members,
    [groupId]: (Object.keys(ARCHITECTURE_NODES) as ArchitectureNodeId[]).filter(
      (nodeId) => ARCHITECTURE_NODES[nodeId].group === groupId,
    ),
  }),
  {} as Record<ArchitectureGroupId, ArchitectureNodeId[]>,
);

interface ArchitectureGroupsProps {
  activeNodeIds: Set<ArchitectureNodeId>;
}

/** One dashed box per service. A box fades when none of its components take part. */
const ArchitectureGroups: React.FC<ArchitectureGroupsProps> = ({ activeNodeIds }) => (
  <g className="pointer-events-none">
    {GROUP_ENTRIES.map(([id, group]) => {
      const isActive = MEMBERS[id].some((nodeId) => activeNodeIds.has(nodeId));
      return (
        <g key={id} opacity={isActive ? 1 : 0.4} className="transition-opacity duration-300">
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
          <text x={group.x + ARCHITECTURE_DIAGRAM.groupTitleInset} y={group.y + ARCHITECTURE_DIAGRAM.groupTitleOffset} fontSize={10} className="font-mono uppercase">
            <tspan fontWeight={700} className="fill-neutral-300">
              {group.label}
            </tspan>
            <tspan dx={8} className="fill-neutral-600">
              {group.caption}
            </tspan>
          </text>
        </g>
      );
    })}
  </g>
);

export default ArchitectureGroups;
