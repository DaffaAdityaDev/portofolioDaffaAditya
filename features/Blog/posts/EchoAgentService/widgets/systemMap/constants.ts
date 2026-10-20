import type { FlowEdgeLabel, FlowEdgeLayout, FlowNodeLayout } from '@/features/Blog/flow/types';
import type { MapEdgeId, MapNodeId } from './types';

export const MAP_NODES: Record<MapNodeId, FlowNodeLayout> = {
  clients: { x: 10, y: 134, label: 'Clients', caption: 'web, prototypes' },
  redis: { x: 190, y: 14, label: 'Redis', caption: 'cache, short memory' },
  gateway: { x: 190, y: 134, label: 'Go gateway', caption: 'the front door' },
  postgres: { x: 190, y: 254, label: 'Postgres', caption: 'sessions, memory' },
  agent: { x: 430, y: 134, label: 'Agent engine', caption: 'state via gateway' },
  llm: { x: 620, y: 54, label: 'LLM provider', caption: 'any of four' },
  tools: { x: 620, y: 214, label: 'Tools', caption: 'MCP, REST, search' },
};

// Calls and answers get their own arrows, so the particles show which way data moves.
export const MAP_EDGES: Record<MapEdgeId, FlowEdgeLayout> = {
  'clients-gateway': { path: 'M122,150 L190,150' },
  'gateway-clients': { path: 'M190,172 L122,172' },
  'gateway-agent': { path: 'M302,150 L430,150' },
  'agent-gateway': { path: 'M430,172 L302,172' },
  'gateway-redis': { path: 'M246,134 L246,66' },
  'gateway-postgres': { path: 'M246,186 L246,254' },
  'agent-llm': { path: 'M542,150 C580,150 580,80 620,80' },
  'agent-tools': { path: 'M542,172 C580,172 580,240 620,240' },
};

export const MAP_EDGE_LABELS: FlowEdgeLabel[] = [
  { x: 322, y: 142, text: 'X-Internal-Token' },
  { x: 334, y: 190, text: 'service JWT' },
  { x: 132, y: 142, text: 'user JWT' },
];
