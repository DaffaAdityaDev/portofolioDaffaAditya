import { useMemo, useState } from 'react';
import type { NetworkProfileId, QualityMode } from '../types';
import { ABR_PROFILES } from '../constants';
import { simulateAbr } from '../utils/simulate';

/** Network and quality choice, plus the playback they produce. Pure, so it is computed, not animated. */
export function useAbrSimulator() {
  const [profileId, setProfileId] = useState<NetworkProfileId>('lift');
  const [mode, setMode] = useState<QualityMode>('auto');
  const profile = ABR_PROFILES[profileId];
  const result = useMemo(() => simulateAbr(profile.mbps, mode), [profile, mode]);

  return { profile, mode, result, setProfileId, setMode };
}
