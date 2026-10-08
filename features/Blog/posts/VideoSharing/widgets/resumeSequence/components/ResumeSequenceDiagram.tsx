import React from 'react';
import { RotateCcw } from 'lucide-react';
import type { SequenceDefinition } from '@/features/Blog/sequence/types';
import type { ResumeLaneId } from '@/features/Blog/posts/VideoSharing/widgets/resumeSequence/types';
import SequenceDiagram from '@/features/Blog/sequence/components/SequenceDiagram';
import { RESUME_LANES, RESUME_SEQUENCE_LEGEND, RESUME_SEQUENCE_STEPS } from '../constants';

const RESUME_SEQUENCE: SequenceDefinition<ResumeLaneId> = {
  title: 'Resuming an upload',
  icon: RotateCcw,
  ariaLabel: 'Sequence diagram of a resumed upload: chunks sent, the connection drops, the client asks which chunks are missing and sends only those',
  width: 820,
  minWidthClass: 'min-w-[620px]',
  lanes: RESUME_LANES,
  steps: RESUME_SEQUENCE_STEPS,
  legend: RESUME_SEQUENCE_LEGEND,
};

/** A dropped upload and its resume, one lane per component. */
const ResumeSequenceDiagram: React.FC = () => <SequenceDiagram definition={RESUME_SEQUENCE} />;

export default ResumeSequenceDiagram;
