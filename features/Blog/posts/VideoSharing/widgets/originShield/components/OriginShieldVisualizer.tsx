import React from 'react';
import { ShieldCheck } from 'lucide-react';
import FlowShell from '@/features/Blog/flow/components/FlowShell';
import { ORIGIN_SHIELD_FLOW } from '../flow';
import OriginRequests from './OriginRequests';

/**
 * A launch-day crowd on a brand-new video, without protection and then with
 * request collapsing, a shield layer, jittered expiry and pre-warming.
 */
const OriginShieldVisualizer: React.FC = () => (
  <FlowShell flow={ORIGIN_SHIELD_FLOW} title="Launch day: protecting the origin" icon={ShieldCheck}>
    <OriginRequests />
  </FlowShell>
);

export default OriginShieldVisualizer;
