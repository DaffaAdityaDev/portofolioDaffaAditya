import React from 'react';
import { Cpu } from 'lucide-react';
import FlowShell from '@/features/Blog/flow/components/FlowShell';
import { TRANSCODE_TASK_FLOW } from '../flow';
import TranscodeTaskProgress from './TranscodeTaskProgress';

/**
 * One transcode task from pull to ack, with replayable crashes between each
 * step of the worker loop and a task that ends in the dead-letter queue.
 */
const TranscodeTaskVisualizer: React.FC = () => (
  <FlowShell flow={TRANSCODE_TASK_FLOW} title="Life of a transcode task" icon={Cpu}>
    <TranscodeTaskProgress />
  </FlowShell>
);

export default TranscodeTaskVisualizer;
