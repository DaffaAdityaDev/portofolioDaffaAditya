import type { FlowEdgeLabel, FlowEdgeLayout, FlowNodeLayout } from '@/features/Blog/flow/types';
import type { ActionEdgeId, ActionNodeId } from './types';

export const ACTION_NODES: Record<ActionNodeId, FlowNodeLayout> = {
  browser: { x: 10, y: 134, label: 'Browser form', caption: '<form>' },
  clientJs: { x: 190, y: 44, label: 'Client JS', caption: 'React, once loaded' },
  server: { x: 400, y: 134, label: 'Next.js server', caption: 'runs the action' },
  db: { x: 618, y: 44, label: 'Database', caption: 'items table' },
  cache: { x: 618, y: 224, label: 'Route cache', caption: 'rendered pages' },
};

// The straight line along the bottom is the browser posting on its own, with no JavaScript in between.
export const ACTION_EDGES: Record<ActionEdgeId, FlowEdgeLayout> = {
  'browser-clientJs': { path: 'M122,150 C156,150 156,70 190,70' },
  'clientJs-server': { path: 'M302,70 C350,70 350,150 400,150' },
  'browser-server': { path: 'M122,172 H400' },
  'server-db': { path: 'M512,150 C565,150 565,70 618,70' },
  'server-cache': { path: 'M512,170 C565,170 565,250 618,250' },
};

export const ACTION_EDGE_LABELS: FlowEdgeLabel[] = [
  { x: 180, y: 192, text: 'plain form POST' },
  { x: 318, y: 118, text: 'POST' },
];
