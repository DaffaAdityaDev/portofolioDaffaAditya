export type RenderMode = 'ssr' | 'stream' | 'ssg' | 'ppr';

export interface RenderModeInfo {
  id: RenderMode;
  label: string;
  summary: string;
}

/** When one part of the page appears, in ms after the request reaches the server. */
export interface PartTiming {
  at: number;
  /** False when the part is the same for every user, like a cart built at deploy time. */
  isPersonal: boolean;
}

/** The modelled response for one render mode and one pair of data latencies. */
export interface PprResponse {
  /** Header, banner and the other parts that never change. */
  shell: PartTiming;
  cart: PartTiming;
  products: PartTiming;
  /** First time anything is on screen. */
  firstContentMs: number;
  /** When the user's own cart shows, or null when it never does. */
  personalCartMs: number | null;
}

/** What a part of the store mock looks like at the current moment. */
export type PartState = 'blank' | 'skeleton' | 'ready' | 'generic';
