import React from 'react';
import { Zap } from 'lucide-react';
import FlowShell from '@/features/Blog/flow/components/FlowShell';
import { METADATA_CACHE_FLOW } from '../flow';

/**
 * Cache-aside step by step: a hit, a miss and the refill, an edit that
 * deletes the entry, a viral key, and a cache node that fails.
 */
const MetadataCacheVisualizer: React.FC = () => (
  <FlowShell flow={METADATA_CACHE_FLOW} title="Metadata cache" icon={Zap} />
);

export default MetadataCacheVisualizer;
