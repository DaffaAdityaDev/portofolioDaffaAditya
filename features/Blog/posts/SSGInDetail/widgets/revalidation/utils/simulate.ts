import type {
  FreshWindow,
  RenderMode,
  ResponseKind,
  TimelineRequest,
  TimelineResult,
} from '@/features/Blog/posts/SSGInDetail/widgets/revalidation/types';
import { TIMELINE } from '../constants';

type Version = 'old' | 'new';

const kindOf = (served: Version, latest: Version): ResponseKind => {
  if (served === 'new') return 'fresh';
  return latest === 'new' ? 'stale' : 'current';
};

/**
 * Replays the visitors against one rendering mode. ISR follows the Next.js rule:
 * once a page is older than `revalidate`, the next request still gets the cached
 * page and starts a rebuild in the background; the request after that gets the result.
 */
export function simulateTimeline(mode: RenderMode, revalidate: number, editAt: number): TimelineResult {
  const versionAt = (t: number): Version => (t >= editAt ? 'new' : 'old');

  let cached: Version = 'old';
  let builtAt = 0;
  const windows: FreshWindow[] = [{ from: 0, to: revalidate }];
  const requests: TimelineRequest[] = [];

  TIMELINE.requestTimes.forEach((at) => {
    const latest = versionAt(at);

    if (mode === 'ssr') {
      requests.push({ at, kind: kindOf(latest, latest), rendered: true });
      return;
    }

    const served = cached;
    const expired = mode === 'isr' && at - builtAt > revalidate;
    if (expired) {
      cached = latest;
      builtAt = at;
      windows.push({ from: at, to: at + revalidate });
    }
    requests.push({ at, kind: kindOf(served, latest), rendered: expired });
  });

  return {
    requests,
    windows: mode === 'isr' ? windows : [],
    renders: requests.filter((r) => r.rendered).length,
    staleResponses: requests.filter((r) => r.kind === 'stale').length,
  };
}
