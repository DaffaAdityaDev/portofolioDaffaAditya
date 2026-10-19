import type { SequenceLane, SequenceLegendEntry, SequenceStep } from '@/features/Blog/sequence/types';
import type { HitlLaneId } from '@/features/Blog/posts/EchoAgentService/widgets/hitlSequence/types';

export const HITL_LANES: Record<HitlLaneId, SequenceLane> = {
  client: { label: 'Client', caption: 'approval modal', x: 110 },
  gateway: { label: 'Go gateway', caption: 'checks ownership', x: 330 },
  agent: { label: 'Agent engine', caption: 'paused mission', x: 550 },
  tool: { label: 'Tool', caption: 'needs a yes', x: 770 },
};

export const HITL_STEPS: SequenceStep<HitlLaneId>[] = [
  {
    number: 1,
    title: 'Pause before the tool',
    messages: [
      { from: 'agent', to: 'gateway', kind: 'call', text: 'store paused:{approvalId}' },
      { from: 'agent', to: 'gateway', kind: 'bytes', text: 'SSE: hitl_approval_required' },
      { from: 'gateway', to: 'client', kind: 'bytes', text: 'relayed, stream ends' },
    ],
  },
  {
    number: 2,
    title: 'The user decides',
    messages: [
      { from: 'client', to: 'gateway', kind: 'call', text: 'POST /sessions/{id}/approve|deny {approvalId, decision}' },
      { from: 'gateway', to: 'agent', kind: 'call', text: 'same body + X-Internal-Token' },
    ],
  },
  {
    number: 3,
    title: 'Claim the snapshot',
    messages: [
      { from: 'agent', to: 'gateway', kind: 'call', text: 'load paused:{approvalId}' },
      { from: 'gateway', to: 'agent', kind: 'reply', text: 'state, pending call, harness snapshot' },
      { from: 'agent', to: 'gateway', kind: 'call', text: 'delete paused:{approvalId} (single use)' },
    ],
  },
  {
    number: 4,
    title: 'Run the approved tool',
    messages: [
      { from: 'agent', to: 'tool', kind: 'call', text: 'execute(pending args)' },
      { from: 'tool', to: 'agent', kind: 'reply', text: 'observation' },
    ],
  },
  {
    number: 5,
    title: 'Resume on a fresh harness',
    messages: [
      { from: 'agent', to: 'gateway', kind: 'bytes', text: 'SSE: content, turn_complete' },
      { from: 'gateway', to: 'client', kind: 'bytes', text: 'relayed line by line, stream ends' },
    ],
  },
];

export const HITL_LEGEND: SequenceLegendEntry[] = [
  { kind: 'call', text: 'request' },
  { kind: 'reply', text: 'answer' },
  { kind: 'bytes', text: 'SSE packets' },
];
