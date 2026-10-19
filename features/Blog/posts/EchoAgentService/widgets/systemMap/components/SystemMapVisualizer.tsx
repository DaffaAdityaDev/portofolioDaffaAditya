import React from 'react';
import { Network } from 'lucide-react';
import FlowShell from '@/features/Blog/flow/components/FlowShell';
import { SYSTEM_MAP_FLOW } from '../flow';

/**
 * The whole system step by step: a chat turn, the agent calling back for
 * memory, and a mission cancelled from three sides.
 */
const SystemMapVisualizer: React.FC = () => (
  <FlowShell flow={SYSTEM_MAP_FLOW} title="How Echo is connected" icon={Network} />
);

export default SystemMapVisualizer;
