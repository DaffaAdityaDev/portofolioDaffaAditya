import type { SequenceLane, SequenceLegendEntry, SequenceStep } from '@/features/Blog/sequence/types';
import type { ChatTurnLaneId } from './types';

export const CHAT_TURN_LANES: Record<ChatTurnLaneId, SequenceLane> = {
  client: { label: 'Client', caption: 'web app', x: 110 },
  gateway: { label: 'Go gateway', caption: 'Fiber, :8080', x: 330 },
  agent: { label: 'Agent engine', caption: 'Bun + Hono, :3001', x: 550 },
  llm: { label: 'LLM provider', caption: 'from provider_config', x: 770 },
};

export const CHAT_TURN_STEPS: SequenceStep<ChatTurnLaneId>[] = [
  {
    number: 1,
    title: 'Send the message',
    messages: [{ from: 'client', to: 'gateway', kind: 'call', text: 'POST /api/v1/chat {message, sessionId, model?, mode?}' }],
  },
  {
    number: 2,
    title: 'Count the tokens',
    messages: [
      { from: 'gateway', to: 'agent', kind: 'call', text: 'POST /internal/tokenize' },
      { from: 'agent', to: 'gateway', kind: 'reply', text: 'exact count (o200k_base)' },
    ],
  },
  {
    number: 3,
    title: 'Start the mission',
    messages: [
      { from: 'gateway', to: 'agent', kind: 'call', text: 'POST /generate-mission + provider_config' },
      { from: 'agent', to: 'llm', kind: 'call', text: 'stream a completion' },
    ],
  },
  {
    number: 4,
    title: 'Relay the stream',
    messages: [
      { from: 'llm', to: 'agent', kind: 'reply', text: 'tokens, tool calls' },
      { from: 'agent', to: 'gateway', kind: 'bytes', text: 'SSE: reasoning, tool_call, content' },
      { from: 'gateway', to: 'client', kind: 'bytes', text: 'same bytes, line by line' },
    ],
  },
  {
    number: 5,
    title: 'Close the turn',
    messages: [
      { from: 'agent', to: 'gateway', kind: 'bytes', text: 'usage, turn_complete' },
      { from: 'gateway', to: 'client', kind: 'bytes', text: 'turn_complete, stream ends' },
    ],
  },
];

export const CHAT_TURN_LEGEND: SequenceLegendEntry[] = [
  { kind: 'call', text: 'request' },
  { kind: 'reply', text: 'answer' },
  { kind: 'bytes', text: 'SSE packets, relayed untouched' },
];
