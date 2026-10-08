import React from 'react';
import { Shuffle } from 'lucide-react';
import FlowShell from '@/features/Blog/flow/components/FlowShell';
import { LOAD_BALANCER_FLOW } from '../flow';

/**
 * Load balancing step by step: routing by path and host, a server that fails
 * its health checks, and a balancer that goes down.
 */
const LoadBalancerVisualizer: React.FC = () => (
  <FlowShell flow={LOAD_BALANCER_FLOW} title="Load balancing" icon={Shuffle} />
);

export default LoadBalancerVisualizer;
