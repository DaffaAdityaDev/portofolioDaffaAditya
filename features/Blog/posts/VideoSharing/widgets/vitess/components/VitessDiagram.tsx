import React, { useId } from 'react';
import { Network } from 'lucide-react';
import { cn } from '@/utils/cn';
import WidgetFrame from '@/features/Blog/components/WidgetFrame';
import {
  VITESS_ACTIVE_SHARD,
  VITESS_API,
  VITESS_DIAGRAM,
  VITESS_GATE,
  VITESS_SHARD_LAYOUT,
  VITESS_SHARDS,
  VITESS_TOPO,
} from '../constants';

const D = VITESS_DIAGRAM;
const S = VITESS_SHARD_LAYOUT;

interface BoxProps {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  caption?: string;
  isActive?: boolean;
  dashed?: boolean;
}

const Box: React.FC<BoxProps> = ({ x, y, width, height, label, caption, isActive, dashed }) => (
  <g>
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={2}
      fill={D.boxFill}
      stroke={isActive ? D.activeLine : D.boxStroke}
      strokeDasharray={dashed ? '4 3' : undefined}
    />
    <text
      x={x + width / 2}
      y={caption ? y + height / 2 - 3 : y + height / 2 + 4}
      textAnchor="middle"
      fontSize={11}
      fontWeight={700}
      className="fill-neutral-200 font-mono uppercase"
    >
      {label}
    </text>
    {caption && (
      <text x={x + width / 2} y={y + height / 2 + 12} textAnchor="middle" fontSize={9.5} className="fill-neutral-500 font-mono">
        {caption}
      </text>
    )}
  </g>
);

/** One shard: a primary tablet that takes the writes and two replicas for reads. */
const Shard: React.FC<{ name: string; x: number; isActive: boolean }> = ({ name, x, isActive }) => {
  const inner = x + 12;
  const innerWidth = S.width - 24;
  const replicaWidth = (innerWidth - 8) / 2;

  return (
    <g>
      <rect
        x={x}
        y={S.y}
        width={S.width}
        height={S.height}
        rx={2}
        fill="none"
        stroke={isActive ? D.activeLine : '#404040'}
        strokeDasharray="4 4"
      />
      <text x={x + 12} y={S.y + 18} fontSize={10} className={cn('font-mono uppercase', isActive ? 'fill-red-400' : 'fill-neutral-400')}>
        shard {name}
      </text>
      <Box x={inner} y={S.y + 28} width={innerWidth} height={40} label="Primary" caption="VTTablet + MySQL" isActive={isActive} />
      <Box x={inner} y={S.y + 78} width={replicaWidth} height={36} label="Replica" />
      <Box x={inner + replicaWidth + 8} y={S.y + 78} width={replicaWidth} height={36} label="Replica" />
    </g>
  );
};

/**
 * The videos keyspace under Vitess: the API talks to VTGate as if it were one
 * MySQL server, and VTGate sends each query to the one shard that owns the key.
 */
const VitessDiagram: React.FC = () => {
  const markerBase = useId().replace(/:/g, '');
  const idleMarker = `${markerBase}-idle`;
  const activeMarker = `${markerBase}-active`;
  const gateCenter = VITESS_GATE.x + VITESS_GATE.width / 2;
  const gateBottom = VITESS_GATE.y + VITESS_GATE.height;

  return (
    <WidgetFrame title="Sharding with Vitess" icon={Network}>
      <div className="overflow-x-auto p-4">
        <svg
          viewBox={`0 0 ${D.width} ${D.height}`}
          role="img"
          aria-label="Vitess: API servers query VTGate, which reads the shard map from the topology service and routes a query for video 42 to shard 80-c0, one of four shards that each have a primary and two replicas"
          className={cn('block h-auto w-full', D.minWidthClass)}
        >
          <defs>
            {[
              { id: idleMarker, color: D.idleLine },
              { id: activeMarker, color: D.activeLine },
            ].map((marker) => (
              <marker key={marker.id} id={marker.id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0,0 L10,5 L0,10 z" fill={marker.color} />
              </marker>
            ))}
          </defs>

          <line
            x1={gateCenter}
            x2={gateCenter}
            y1={VITESS_API.y + VITESS_API.height}
            y2={VITESS_GATE.y - 4}
            stroke={D.activeLine}
            strokeWidth={2}
            markerEnd={`url(#${activeMarker})`}
          />
          <text x={gateCenter + 10} y={78} fontSize={9.5} className="fill-neutral-400 font-mono">
            SELECT … FROM videos WHERE id = 42
          </text>

          <line
            x1={VITESS_GATE.x + VITESS_GATE.width}
            x2={VITESS_TOPO.x - 4}
            y1={VITESS_GATE.y + VITESS_GATE.height / 2}
            y2={VITESS_TOPO.y + VITESS_TOPO.height / 2}
            stroke={D.idleLine}
            strokeDasharray="4 3"
            markerEnd={`url(#${idleMarker})`}
          />
          <text x={VITESS_GATE.x + VITESS_GATE.width + 10} y={VITESS_GATE.y + VITESS_GATE.height / 2 - 6} fontSize={9} className="fill-neutral-600 font-mono">
            cached
          </text>

          {VITESS_SHARDS.map((name, index) => {
            const isActive = name === VITESS_ACTIVE_SHARD;
            const shardCenter = S.firstX + index * (S.width + S.gap) + S.width / 2;
            return (
              <line
                key={name}
                x1={gateCenter}
                y1={gateBottom}
                x2={shardCenter}
                y2={S.y - 4}
                stroke={isActive ? D.activeLine : D.idleLine}
                strokeWidth={isActive ? 2 : 1}
                strokeDasharray={isActive ? undefined : '3 4'}
                markerEnd={`url(#${isActive ? activeMarker : idleMarker})`}
              />
            );
          })}
          <text
            x={gateCenter + 44}
            y={170}
            fontSize={9.5}
            stroke={D.boxFill}
            strokeWidth={3}
            paintOrder="stroke"
            className="fill-red-400 font-mono"
          >
            hash(42) falls in 80-c0
          </text>

          <Box {...VITESS_API} label="API servers" caption="one MySQL connection string" />
          <Box {...VITESS_GATE} label="VTGate × N" caption="stateless, routes by vindex" isActive />
          <Box {...VITESS_TOPO} label="Topology" caption="etcd: shard map" dashed />

          {VITESS_SHARDS.map((name, index) => (
            <Shard
              key={name}
              name={name}
              x={S.firstX + index * (S.width + S.gap)}
              isActive={name === VITESS_ACTIVE_SHARD}
            />
          ))}

          <text x={S.firstX} y={D.height - 6} fontSize={9.5} className="fill-neutral-600 font-mono">
            videos keyspace: every row of one video (uploads, task rows, likes) sits on the same shard as the video
          </text>
        </svg>
      </div>
    </WidgetFrame>
  );
};

export default VitessDiagram;
