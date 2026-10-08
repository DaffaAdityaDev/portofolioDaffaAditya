import React from 'react';
import { Rocket } from 'lucide-react';
import FlowShell from '@/features/Blog/flow/components/FlowShell';
import { DEPLOY_PIPELINE_FLOW } from '../flow';

/**
 * A release step by step: CI, the registry, a GitOps sync and a canary, with
 * failing tests, a bad canary, a rollback and a broken deploy tool.
 */
const DeployPipelineVisualizer: React.FC = () => (
  <FlowShell flow={DEPLOY_PIPELINE_FLOW} title="Shipping a release" icon={Rocket} />
);

export default DeployPipelineVisualizer;
