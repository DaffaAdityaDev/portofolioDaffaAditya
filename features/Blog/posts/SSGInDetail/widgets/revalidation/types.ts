export type RenderMode = 'ssg' | 'isr' | 'ssr';

/** Which version a visitor got: the old post before the edit, the old post after it, or the new post. */
export type ResponseKind = 'current' | 'stale' | 'fresh';

export interface TimelineRequest {
  /** Seconds after the build. */
  at: number;
  kind: ResponseKind;
  /** This request made the server render the page (ISR: in the background, after answering). */
  rendered: boolean;
}

/** An ISR window: the cached page counts as fresh from `from` until `to`. */
export interface FreshWindow {
  from: number;
  to: number;
}

export interface TimelineResult {
  requests: TimelineRequest[];
  windows: FreshWindow[];
  /** Server renders after the build. */
  renders: number;
  staleResponses: number;
}
