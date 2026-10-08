import React from 'react';
import { Upload } from 'lucide-react';
import FlowShell from '@/features/Blog/flow/components/FlowShell';
import { UPLOAD_FLOW } from '../flow';
import UploadFlowProgress from './UploadFlowProgress';

/**
 * Step-by-step picture of a video upload, from the first tap to a playable
 * video, with replayable failure scenarios.
 */
const UploadFlowVisualizer: React.FC = () => (
  <FlowShell flow={UPLOAD_FLOW} title="Upload flow" icon={Upload}>
    <UploadFlowProgress />
  </FlowShell>
);

export default UploadFlowVisualizer;
