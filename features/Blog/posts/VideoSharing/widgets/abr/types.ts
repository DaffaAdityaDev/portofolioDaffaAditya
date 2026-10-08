export type NetworkProfileId = 'steady' | 'lift' | 'train';

/** Auto lets the player pick; a rendition index pins one quality, like choosing it in the menu. */
export type QualityMode = 'auto' | number;

export interface Rendition {
  label: string;
  /** Average video bitrate in Mbps. */
  mbps: number;
}

export interface NetworkProfile {
  id: NetworkProfileId;
  label: string;
  summary: string;
  /** Bandwidth in Mbps while each segment downloads. */
  mbps: number[];
}

/** What happened to one segment of the video. */
export interface AbrSegment {
  index: number;
  networkMbps: number;
  rendition: number;
  /** Seconds of video buffered after this segment arrived. */
  bufferAfter: number;
  /** Seconds the picture froze while this segment downloaded. */
  stallSeconds: number;
}

export interface AbrResult {
  segments: AbrSegment[];
  startupSeconds: number;
  stalls: number;
  stallSeconds: number;
  switches: number;
  averageMbps: number;
}
