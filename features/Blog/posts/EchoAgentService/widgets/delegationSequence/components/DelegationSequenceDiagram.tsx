import React from 'react';
import { GitFork } from 'lucide-react';
import type { SequenceDefinition } from '@/features/Blog/sequence/types';
import type { DelegationLaneId } from '../types';
import SequenceDiagram from '@/features/Blog/sequence/components/SequenceDiagram';
import { DELEGATION_LANES, DELEGATION_LEGEND, DELEGATION_STEPS } from '../constants';

const DELEGATION_SEQUENCE: SequenceDefinition<DelegationLaneId> = {
  title: 'Delegating to a sub-agent',
  icon: GitFork,
  ariaLabel: 'Sequence diagram of delegation: the parent agent calls delegate_task, a child harness runs its own loop on the same provider, its packets stream to the gateway on the parent stream, and only its final text returns to the parent as a tool result',
  width: 880,
  minWidthClass: 'min-w-[660px]',
  lanes: DELEGATION_LANES,
  steps: DELEGATION_STEPS,
  legend: DELEGATION_LEGEND,
};

/** A parent agent handing a sub-task to a child agent in the same process. */
const DelegationSequenceDiagram: React.FC = () => <SequenceDiagram definition={DELEGATION_SEQUENCE} />;

export default DelegationSequenceDiagram;
