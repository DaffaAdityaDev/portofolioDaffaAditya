import React from 'react';
import type { ArchitectureCategory } from '@/features/Blog/posts/VideoSharing/widgets/architecture/types';
import { STACK_OFFSET } from '@/features/Blog/flow/components/FlowParts';
import { ARCHITECTURE_CATEGORIES, ARCHITECTURE_DIAGRAM } from '../constants';

const CATEGORY_ENTRIES = Object.entries(ARCHITECTURE_CATEGORIES) as [
  ArchitectureCategory,
  (typeof ARCHITECTURE_CATEGORIES)[ArchitectureCategory],
][];

/** Color key for the component kinds, drawn inside the diagram so it scales with it. */
const ArchitectureLegend: React.FC = () => {
  const { x, y, rowHeight, swatch } = ARCHITECTURE_DIAGRAM.legend;
  const stack = ARCHITECTURE_DIAGRAM.legendStack;
  const stackY = (CATEGORY_ENTRIES.length + 1) * rowHeight + 4;
  const stackShift = STACK_OFFSET / 2;

  return (
    <g transform={`translate(${x} ${y})`} className="pointer-events-none" aria-hidden="true">
      {CATEGORY_ENTRIES.map(([id, category], index) => (
        <g key={id} transform={`translate(0 ${index * rowHeight})`}>
          <rect width={swatch} height={swatch} y={-swatch + 1} rx={1} fill={category.color} />
          <text x={swatch + 7} fontSize={10} className="fill-neutral-400 font-mono">
            {category.label}
          </text>
        </g>
      ))}
      <text y={CATEGORY_ENTRIES.length * rowHeight + 4} fontSize={10} className="fill-neutral-500 font-mono">
        → points from the caller
      </text>
      <g transform={`translate(0 ${stackY})`}>
        <rect x={stackShift} y={-stack.height - stackShift + 1} width={stack.width - stackShift} height={stack.height} rx={1} fill="none" stroke="#737373" strokeOpacity={0.5} />
        <rect y={-stack.height + 1} width={stack.width - stackShift} height={stack.height} rx={1} fill="#0d0d0d" stroke="#a3a3a3" />
        <text x={stack.width + 6} fontSize={10} className="fill-neutral-500 font-mono">
          stack = scales out
        </text>
      </g>
    </g>
  );
};

export default ArchitectureLegend;
