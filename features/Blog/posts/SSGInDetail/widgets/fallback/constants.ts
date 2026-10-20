import type { FlowEdgeLabel, FlowEdgeLayout, FlowNodeLayout } from '@/features/Blog/flow/types';
import type { FallbackEdgeId, FallbackNodeId } from './types';

export const FALLBACK_NODES: Record<FallbackNodeId, FlowNodeLayout> = {
  visitorA: { x: 10, y: 50, label: 'Visitor A', caption: 'first to ask' },
  visitorB: { x: 10, y: 218, label: 'Visitor B', caption: 'a minute later' },
  server: { x: 300, y: 134, label: 'Next server', caption: '/blog/new-post' },
  cache: { x: 600, y: 44, label: 'Page cache', caption: 'built pages' },
  cms: { x: 600, y: 224, label: 'CMS', caption: 'has the post' },
};

// Requests and answers get their own arrows, so a step can show which way data moves.
export const FALLBACK_EDGES: Record<FallbackEdgeId, FlowEdgeLayout> = {
  'a-server': { path: 'M122,66 C210,66 210,142 300,142' },
  'server-a': { path: 'M300,156 C200,156 200,88 122,88' },
  'b-server': { path: 'M122,234 C210,234 210,166 300,166' },
  'server-b': { path: 'M300,180 C200,180 200,256 122,256' },
  'server-cache': { path: 'M412,146 C506,146 506,70 600,70' },
  'server-cms': { path: 'M412,174 C506,174 506,250 600,250' },
};

export const FALLBACK_EDGE_LABELS: FlowEdgeLabel[] = [
  { x: 470, y: 92, text: 'HTML + JSON' },
  { x: 420, y: 236, text: 'getStaticProps' },
];
