import React from 'react';
import { ShieldCheck } from 'lucide-react';
import type { SequenceDefinition } from '@/features/Blog/sequence/types';
import type { HitlLaneId } from '../types';
import SequenceDiagram from '@/features/Blog/sequence/components/SequenceDiagram';
import { HITL_LANES, HITL_LEGEND, HITL_STEPS } from '../constants';

const HITL_SEQUENCE: SequenceDefinition<HitlLaneId> = {
  title: 'Asking a human first',
  icon: ShieldCheck,
  ariaLabel: 'Sequence diagram of a human approval: the agent saves a paused mission and asks for approval, the user approves through the gateway, and the agent loads the snapshot, runs the tool and resumes on a fresh harness',
  width: 880,
  minWidthClass: 'min-w-[660px]',
  lanes: HITL_LANES,
  steps: HITL_STEPS,
  legend: HITL_LEGEND,
};

/** A risky tool call paused, approved and resumed on a fresh harness. */
const HitlSequenceDiagram: React.FC = () => <SequenceDiagram definition={HITL_SEQUENCE} />;

export default HitlSequenceDiagram;
