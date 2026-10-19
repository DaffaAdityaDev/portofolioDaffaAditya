import React from 'react';
import { Brain } from 'lucide-react';
import type { SequenceDefinition } from '@/features/Blog/sequence/types';
import type { MemoryLaneId } from '@/features/Blog/posts/EchoAgentService/widgets/memorySequence/types';
import SequenceDiagram from '@/features/Blog/sequence/components/SequenceDiagram';
import { MEMORY_LANES, MEMORY_LEGEND, MEMORY_STEPS } from '../constants';

const MEMORY_SEQUENCE: SequenceDefinition<MemoryLaneId> = {
  title: 'The agent calls back',
  icon: Brain,
  ariaLabel: 'Sequence diagram of the agent calling the gateway with a service JWT to load its prompt from Postgres, then save and recall episodic memory in Redis',
  width: 880,
  minWidthClass: 'min-w-[660px]',
  lanes: MEMORY_LANES,
  steps: MEMORY_STEPS,
  legend: MEMORY_LEGEND,
};

/** Every read and write the agent makes goes through the gateway's internal routes. */
const MemorySequenceDiagram: React.FC = () => <SequenceDiagram definition={MEMORY_SEQUENCE} />;

export default MemorySequenceDiagram;
