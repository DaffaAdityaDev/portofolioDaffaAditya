import React from 'react';
import { PlayCircle } from 'lucide-react';
import FlowShell from '@/features/Blog/flow/components/FlowShell';
import { STREAM_FLOW } from '../flow';
import StreamingFlowProgress from './StreamingFlowProgress';

/**
 * Step-by-step picture of pressing play: the metadata lookup, the manifest,
 * and the segments coming from the CDN, with replayable cache-miss and
 * failure scenarios.
 */
const StreamingFlowVisualizer: React.FC = () => (
  <FlowShell flow={STREAM_FLOW} title="Streaming flow" icon={PlayCircle}>
    <StreamingFlowProgress />
  </FlowShell>
);

export default StreamingFlowVisualizer;
