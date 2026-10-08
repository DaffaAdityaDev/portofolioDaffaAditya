import type { AbrResult, AbrSegment, QualityMode } from '@/features/Blog/posts/VideoSharing/widgets/abr/types';
import { ABR, ABR_LADDER } from '../constants';

/** Highest rung whose bitrate fits in the bandwidth the player dares to use. */
const highestRungUnder = (mbps: number): number => {
  let rung = 0;
  ABR_LADDER.forEach((rendition, index) => {
    if (rendition.mbps <= mbps) rung = index;
  });
  return rung;
};

/**
 * The Auto rule, a simplified mix of what real players do: follow the
 * bandwidth estimate down at once, but step up only one rung at a time, and
 * only with a healthy buffer.
 */
export const pickRendition = (estimateMbps: number, bufferSeconds: number, current: number | null): number => {
  const byBandwidth = highestRungUnder(estimateMbps * ABR.safetyFactor);
  if (current === null) return byBandwidth;
  if (byBandwidth <= current) return byBandwidth;
  return bufferSeconds >= ABR.stepUpBufferSeconds ? current + 1 : current;
};

const segmentDownloadSeconds = (rendition: number, mbps: number): number =>
  (ABR_LADDER[rendition].mbps * ABR.segmentSeconds) / mbps;

/** Plays the whole video segment by segment over the given network. */
export const simulateAbr = (networkMbps: number[], mode: QualityMode): AbrResult => {
  const segments: AbrSegment[] = [];
  let buffer = 0;
  let estimate: number = ABR.initialEstimateMbps;
  let current: number | null = null;
  let startupSeconds = 0;
  let stalls = 0;
  let stallSeconds = 0;
  let switches = 0;

  networkMbps.forEach((mbps, index) => {
    let rendition = mode === 'auto' ? pickRendition(estimate, buffer, current) : mode;
    let downloadSeconds = segmentDownloadSeconds(rendition, mbps);

    // Auto notices a segment that arrives too slowly, drops it, and fetches the lowest rung instead.
    if (mode === 'auto' && index > 0 && downloadSeconds > ABR.segmentSeconds && rendition > 0) {
      rendition = 0;
      downloadSeconds = ABR.abandonAfterSeconds + segmentDownloadSeconds(0, mbps);
    }
    if (current !== null && rendition !== current) switches += 1;

    let stall = 0;
    if (index === 0) {
      // Waiting for the first segment is start-up time, not a freeze.
      startupSeconds = downloadSeconds;
    } else if (downloadSeconds > buffer) {
      stall = downloadSeconds - buffer;
      // A freeze that runs over several segments is still one freeze for the viewer.
      if (segments[index - 1].stallSeconds === 0) stalls += 1;
      stallSeconds += stall;
    }

    buffer = Math.min(Math.max(buffer - downloadSeconds, 0) + ABR.segmentSeconds, ABR.maxBufferSeconds);
    estimate = ABR.estimateWeight * mbps + (1 - ABR.estimateWeight) * estimate;
    current = rendition;

    segments.push({ index, networkMbps: mbps, rendition, bufferAfter: buffer, stallSeconds: stall });
  });

  const averageMbps = segments.reduce((sum, segment) => sum + ABR_LADDER[segment.rendition].mbps, 0) / segments.length;

  return { segments, startupSeconds, stalls, stallSeconds, switches, averageMbps };
};
