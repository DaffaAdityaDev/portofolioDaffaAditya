import React from 'react';
import { Send } from 'lucide-react';
import FlowShell from '@/features/Blog/flow/components/FlowShell';
import { SERVER_ACTION_FLOW } from '../flow';

/**
 * One form submit on the network: the old API route, a Server Action,
 * a submit before JavaScript loads, and an action with no auth check.
 */
const ServerActionFlowVisualizer: React.FC = () => (
  <FlowShell flow={SERVER_ACTION_FLOW} title="Server Action, step by step" icon={Send} />
);

export default ServerActionFlowVisualizer;
