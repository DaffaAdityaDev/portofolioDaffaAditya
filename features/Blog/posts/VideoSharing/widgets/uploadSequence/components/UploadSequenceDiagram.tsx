import React from 'react';
import { ListOrdered } from 'lucide-react';
import type { SequenceDefinition } from '@/features/Blog/sequence/types';
import type { UploadLaneId } from '../types';
import SequenceDiagram from '@/features/Blog/sequence/components/SequenceDiagram';
import { UPLOAD_LANES, UPLOAD_SEQUENCE_LEGEND, UPLOAD_SEQUENCE_STEPS } from '../constants';

const UPLOAD_SEQUENCE: SequenceDefinition<UploadLaneId> = {
  title: 'Upload, in order',
  icon: ListOrdered,
  ariaLabel: 'Sequence diagram of an upload in six steps, from creating the upload to the video turning ready',
  width: 960,
  minWidthClass: 'min-w-[720px]',
  lanes: UPLOAD_LANES,
  steps: UPLOAD_SEQUENCE_STEPS,
  legend: UPLOAD_SEQUENCE_LEGEND,
};

/** The six upload steps, one lane per component, the video bytes drawn apart from the control calls. */
const UploadSequenceDiagram: React.FC = () => <SequenceDiagram definition={UPLOAD_SEQUENCE} />;

export default UploadSequenceDiagram;
