import type { SequenceLane, SequenceLegendEntry, SequenceStep } from '@/features/Blog/sequence/types';
import type { DelegationLaneId } from '@/features/Blog/posts/EchoAgentService/widgets/delegationSequence/types';

export const DELEGATION_LANES: Record<DelegationLaneId, SequenceLane> = {
  gateway: { label: 'Go gateway', caption: 'one SSE stream', x: 110 },
  parent: { label: 'Parent agent', caption: 'depth 0', x: 330 },
  child: { label: 'Sub-agent', caption: 'depth 1, same process', x: 550 },
  llm: { label: 'LLM provider', caption: 'shared provider', x: 770 },
};

export const DELEGATION_STEPS: SequenceStep<DelegationLaneId>[] = [
  {
    number: 1,
    title: 'The parent decides to delegate',
    messages: [
      { from: 'parent', to: 'llm', kind: 'call', text: 'plan the mission' },
      { from: 'llm', to: 'parent', kind: 'reply', text: 'tool_call delegate_task(researcher)' },
    ],
  },
  {
    number: 2,
    title: 'Spawn a child harness',
    messages: [{ from: 'parent', to: 'child', kind: 'call', text: 'own prompt + instruction, depth + 1' }],
  },
  {
    number: 3,
    title: 'The child runs its own loop',
    messages: [
      { from: 'child', to: 'llm', kind: 'call', text: 'its own turns and tools' },
      { from: 'llm', to: 'child', kind: 'reply', text: 'reasoning, tool calls, answer' },
    ],
  },
  {
    number: 4,
    title: 'Its progress reaches the user',
    messages: [
      { from: 'child', to: 'parent', kind: 'bytes', text: 'packets, tagged with the parent id' },
      { from: 'parent', to: 'gateway', kind: 'bytes', text: 'same SSE stream as the parent' },
    ],
  },
  {
    number: 5,
    title: 'Only the result comes back',
    messages: [
      { from: 'child', to: 'parent', kind: 'reply', text: 'final text as one tool result' },
      { from: 'parent', to: 'llm', kind: 'call', text: 'continue with a short context' },
    ],
  },
];

export const DELEGATION_LEGEND: SequenceLegendEntry[] = [
  { kind: 'call', text: 'request' },
  { kind: 'reply', text: 'answer' },
  { kind: 'bytes', text: 'SSE packets' },
];
