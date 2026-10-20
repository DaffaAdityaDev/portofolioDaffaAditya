import React from 'react';
import { LazyMotion, type FeatureBundle } from 'framer-motion';

// Kept once loaded, so a later mount (another subtree, or a return to the page) hands LazyMotion the bundle
// synchronously instead of rendering one frame without a renderer.
let layoutFeatures: FeatureBundle | undefined;
const loadLayoutFeatures = () =>
  import('@/lib/motionFeaturesMax').then((mod) => {
    layoutFeatures = mod.default;
    return mod.default;
  });

/**
 * Nested LazyMotion that loads domMax for the subtree that uses layout animations (`layout`, `layoutId`,
 * LayoutGroup). Everything outside stays on _app's domAnimation, so it never waits for the bigger chunk.
 *
 * Wrap the whole subtree from the start, not on interaction: a mounted `m` element only picks up the layout
 * features its LazyMotion provides when it mounts. Context flows through portals, so modals opened from
 * inside are covered.
 */
const LayoutMotion = ({ children }: { children: React.ReactNode }) => (
  <LazyMotion features={layoutFeatures ?? loadLayoutFeatures} strict>
    {children}
  </LazyMotion>
);

export default LayoutMotion;
