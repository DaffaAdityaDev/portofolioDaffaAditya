import type { SequenceLane, SequenceLegendEntry, SequenceStep } from '@/features/Blog/sequence/types';
import type { MemoryLaneId } from './types';

export const MEMORY_LANES: Record<MemoryLaneId, SequenceLane> = {
  agent: { label: 'Agent engine', caption: 'no Postgres credentials', x: 110 },
  gateway: { label: 'Go gateway', caption: '/api/v1/internal/*', x: 330 },
  redis: { label: 'Redis', caption: 'episodic, short TTL', x: 550 },
  postgres: { label: 'Postgres', caption: 'prompt versions', x: 770 },
};

export const MEMORY_STEPS: SequenceStep<MemoryLaneId>[] = [
  {
    number: 1,
    title: 'Load the active prompt',
    messages: [
      { from: 'agent', to: 'gateway', kind: 'call', text: 'GET /internal/prompts/active, Bearer JWT' },
      { from: 'gateway', to: 'postgres', kind: 'call', text: 'promoted version for tenant' },
      { from: 'postgres', to: 'gateway', kind: 'reply', text: 'version, prompt, bound tools' },
      { from: 'gateway', to: 'agent', kind: 'reply', text: '200, agent caches it 60s' },
    ],
  },
  {
    number: 2,
    title: 'Save mission state',
    messages: [
      { from: 'agent', to: 'gateway', kind: 'call', text: 'POST /internal/memory/episodic/store' },
      { from: 'gateway', to: 'redis', kind: 'call', text: 'LPUSH to session list, EXPIRE ttl_seconds (600)' },
      { from: 'gateway', to: 'agent', kind: 'reply', text: '201 stored' },
    ],
  },
  {
    number: 3,
    title: 'Recall it later',
    messages: [
      { from: 'agent', to: 'gateway', kind: 'call', text: 'POST /internal/memory/episodic/recall' },
      { from: 'gateway', to: 'redis', kind: 'call', text: 'read the list' },
      { from: 'redis', to: 'gateway', kind: 'reply', text: 'entries' },
      { from: 'gateway', to: 'agent', kind: 'reply', text: '200 {entries, total}' },
    ],
  },
];

export const MEMORY_LEGEND: SequenceLegendEntry[] = [
  { kind: 'call', text: 'request, each with a fresh 60s service JWT' },
  { kind: 'reply', text: 'answer' },
];
