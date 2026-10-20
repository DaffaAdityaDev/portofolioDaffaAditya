import React from 'react';
import { ListOrdered } from 'lucide-react';
import type { SequenceDefinition } from '@/features/Blog/sequence/types';
import type { StreamLaneId } from '../types';
import SequenceDiagram from '@/features/Blog/sequence/components/SequenceDiagram';
import { STREAM_LANES, STREAM_SEQUENCE_LEGEND, STREAM_SEQUENCE_STEPS } from '../constants';

const STREAM_SEQUENCE: SequenceDefinition<StreamLaneId> = {
  title: 'Playback, in order',
  icon: ListOrdered,
  ariaLabel:
    'Sequence diagram of playback in four steps: the playback call to the API, the manifest from the edge, the segments from the edge, and the token refresh',
  width: 900,
  minWidthClass: 'min-w-[680px]',
  lanes: STREAM_LANES,
  steps: STREAM_SEQUENCE_STEPS,
  legend: STREAM_SEQUENCE_LEGEND,
};

/** The four playback steps: one small call to the API, then everything else from the edge. */
const StreamingSequenceDiagram: React.FC = () => <SequenceDiagram definition={STREAM_SEQUENCE} />;

export default StreamingSequenceDiagram;
