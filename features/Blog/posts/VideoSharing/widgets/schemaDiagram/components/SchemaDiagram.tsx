import React, { useId } from 'react';
import { Table2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { SchemaColumnRef, SchemaGroup, SchemaTable } from '@/features/Blog/posts/VideoSharing/widgets/schemaDiagram/types';
import WidgetFrame from '@/features/Blog/components/WidgetFrame';
import {
  SCHEMA_CLUSTER,
  SCHEMA_DIAGRAM,
  SCHEMA_GROUPS,
  SCHEMA_LEGEND,
  SCHEMA_RELATIONS,
  SCHEMA_TABLES,
  SCHEMA_TAG_COLORS,
} from '../constants';

const { headerHeight, rowHeight, paddingBottom, curveReach } = SCHEMA_DIAGRAM;
const TABLES_BY_NAME = new Map(SCHEMA_TABLES.map((table) => [table.name, table]));

const tableHeight = (table: SchemaTable): number => headerHeight + table.columns.length * rowHeight + paddingBottom;

/** Where a relation line leaves or enters a table: the middle of the column's row, on one side. */
const anchor = (ref: SchemaColumnRef): { x: number; y: number; out: number } => {
  const table = TABLES_BY_NAME.get(ref.table);
  if (!table) throw new Error(`Unknown schema table: ${ref.table}`);
  const row = table.columns.findIndex((column) => column.name === ref.column);
  return {
    x: ref.side === 'left' ? table.x : table.x + table.width,
    y: table.y + headerHeight + row * rowHeight + rowHeight / 2,
    out: ref.side === 'left' ? -1 : 1,
  };
};

const relationPath = (from: SchemaColumnRef, to: SchemaColumnRef): string => {
  const a = anchor(from);
  const b = anchor(to);
  return `M${a.x},${a.y} C${a.x + a.out * curveReach},${a.y} ${b.x + b.out * curveReach},${b.y} ${b.x},${b.y}`;
};

const GroupBox: React.FC<{ group: SchemaGroup; strong?: boolean }> = ({ group, strong }) => (
  <g className="pointer-events-none">
    <rect
      x={group.x}
      y={group.y}
      width={group.width}
      height={group.height}
      rx={4}
      fill="#ffffff"
      fillOpacity={0.015}
      stroke={strong ? '#737373' : '#525252'}
      strokeDasharray="5 4"
    />
    <text x={group.x + 10} y={group.y + 15} fontSize={10} className="font-mono uppercase">
      <tspan fontWeight={700} className="fill-neutral-300">
        {group.label}
      </tspan>
      <tspan dx={8} className="fill-neutral-600">
        {group.caption}
      </tspan>
    </text>
  </g>
);

const TableBox: React.FC<{ table: SchemaTable }> = ({ table }) => {
  const height = tableHeight(table);
  return (
    <g transform={`translate(${table.x} ${table.y})`}>
      <rect width={table.width} height={height} rx={2} fill="#0d0d0d" stroke={SCHEMA_DIAGRAM.tableColor} strokeWidth={1.5} />
      <line x1={0} x2={table.width} y1={headerHeight} y2={headerHeight} stroke="#404040" />
      <text x={10} y={16} fontSize={11} fontWeight={700} className="fill-neutral-200 font-mono">
        {table.name}
      </text>
      {table.columns.map((column, index) => {
        const y = headerHeight + index * rowHeight + 12;
        return (
          <g key={column.name} fontSize={10} className="font-mono">
            <text x={10} y={y} className="fill-neutral-300">
              {column.name}
            </text>
            <text x={table.width - 34} y={y} textAnchor="end" className="fill-neutral-500">
              {column.type}
            </text>
            {column.tag && (
              <text x={table.width - 8} y={y} textAnchor="end" fontSize={9} fontWeight={700} fill={SCHEMA_TAG_COLORS[column.tag]}>
                {column.tag}
              </text>
            )}
          </g>
        );
      })}
      {table.note && (
        <text x={2} y={height + 13} fontSize={9} className="fill-neutral-600 font-mono">
          {table.note}
        </text>
      )}
    </g>
  );
};

/**
 * The metadata tables on day one: one MySQL server, one schema per
 * module, and only IDs crossing between schemas.
 */
const SchemaDiagram: React.FC = () => {
  const markerId = `${useId().replace(/:/g, '')}-schema`;

  return (
    <WidgetFrame title="Database schema" icon={Table2}>
      <div className="overflow-x-auto p-4">
        <svg
          viewBox={`0 0 ${SCHEMA_DIAGRAM.width} ${SCHEMA_DIAGRAM.height}`}
          role="img"
          aria-label="Database schema: one MySQL server with an accounts, a comments and a videos schema"
          className={cn('block h-auto w-full', SCHEMA_DIAGRAM.minWidthClass)}
        >
          <defs>
            <marker id={markerId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L10,5 L0,10 z" fill={SCHEMA_DIAGRAM.lineColor} />
            </marker>
          </defs>

          <GroupBox group={SCHEMA_CLUSTER} strong />
          {SCHEMA_GROUPS.map((group) => (
            <GroupBox key={group.label} group={group} />
          ))}

          {SCHEMA_RELATIONS.map((relation) => (
            <path
              key={`${relation.from.table}.${relation.from.column}`}
              d={relationPath(relation.from, relation.to)}
              fill="none"
              stroke={SCHEMA_DIAGRAM.lineColor}
              strokeWidth={1.25}
              strokeDasharray={relation.crossSchema ? '4 3' : undefined}
              markerEnd={`url(#${markerId})`}
            />
          ))}

          {SCHEMA_TABLES.map((table) => (
            <TableBox key={table.name} table={table} />
          ))}

          {SCHEMA_RELATIONS.flatMap((relation) =>
            relation.label
              ? [
                  <text
                    key={`label-${relation.from.table}.${relation.from.column}`}
                    x={relation.label.x}
                    y={relation.label.y}
                    fontSize={9}
                    stroke="#0d0d0d"
                    strokeWidth={3}
                    paintOrder="stroke"
                    className="fill-neutral-500 font-mono"
                  >
                    {relation.label.text}
                  </text>,
                ]
              : [],
          )}

          <text y={SCHEMA_DIAGRAM.legendY} fontSize={10} className="font-mono">
            {SCHEMA_LEGEND.map((entry, index) => (
              <React.Fragment key={entry.tag}>
                <tspan x={index === 0 ? 12 : undefined} dx={index === 0 ? 0 : 16} fontWeight={700} fill={SCHEMA_TAG_COLORS[entry.tag]}>
                  {entry.tag}
                </tspan>
                <tspan dx={6} className="fill-neutral-500">
                  {entry.text}
                </tspan>
              </React.Fragment>
            ))}
          </text>
        </svg>
      </div>
    </WidgetFrame>
  );
};

export default SchemaDiagram;
