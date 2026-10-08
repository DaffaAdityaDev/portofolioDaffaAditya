import React from 'react';
import { ListChecks } from 'lucide-react';
import FlowShell from '@/features/Blog/flow/components/FlowShell';
import { VIDEO_STATUS_FLOW } from '../flow';

/**
 * Every status a video can have and what moves it between them, with a race
 * between two triggers, an abandoned upload, a retried failure and a delete.
 */
const VideoStatusVisualizer: React.FC = () => (
  <FlowShell flow={VIDEO_STATUS_FLOW} title="Life of a video's status" icon={ListChecks} />
);

export default VideoStatusVisualizer;
