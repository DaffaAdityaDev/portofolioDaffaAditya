import React from 'react';
import { Eye } from 'lucide-react';
import FlowShell from '@/features/Blog/flow/components/FlowShell';
import { VIEW_COUNT_FLOW } from '../flow';
import CountMeters from './CountMeters';

/**
 * Counting views and likes: the event path, a viewer who replays, a double
 * like, a bot, and an aggregator that crashes mid-batch.
 */
const ViewCountVisualizer: React.FC = () => (
  <FlowShell flow={VIEW_COUNT_FLOW} title="Counting views and likes" icon={Eye}>
    <CountMeters />
  </FlowShell>
);

export default ViewCountVisualizer;
