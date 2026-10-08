import React from 'react';
import { Route } from 'lucide-react';
import FlowShell from '@/features/Blog/flow/components/FlowShell';
import { FALLBACK_FLOW } from '../flow';

/**
 * A visitor asks for a post that getStaticPaths did not return: a 404 with
 * fallback false, a loading shell with true, and a wait with 'blocking'.
 */
const FallbackModesVisualizer: React.FC = () => (
  <FlowShell flow={FALLBACK_FLOW} title="Fallback modes" icon={Route} />
);

export default FallbackModesVisualizer;
