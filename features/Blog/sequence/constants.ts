import type { SequenceMessageKind } from '@/features/Blog/sequence/types';

export const SEQUENCE_LAYOUT = {
  laneHeaderY: 10,
  laneHeaderWidth: 118,
  laneHeaderHeight: 40,
  firstRowY: 82,
  rowHeight: 26,
  /** Extra space above each step, for its title. */
  stepGap: 22,
  bottomPadding: 46,
  stepLabelX: 8,
  bandColor: '#ffffff',
  /** Arrows stop this far from the lifeline, so the head stays visible. */
  arrowGap: 4,
  legendSpacing: 130,
} as const;

export const SEQUENCE_MESSAGE_STYLES: Record<SequenceMessageKind, { color: string; width: number; dash?: string }> = {
  call: { color: '#d4d4d4', width: 1.25 },
  reply: { color: '#737373', width: 1.25, dash: '4 3' },
  bytes: { color: '#fb7185', width: 3 },
};
