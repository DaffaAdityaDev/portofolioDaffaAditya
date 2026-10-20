/**
 * Global Constants & Layout Tokens
 * Zero Magic Numbers & Centralized Config
 */

export const MARQUEE_TEXT = "SOFTWARE ENGINEER /// SYSTEM DESIGNER /// SYSTEM ARCHITECT /// UI/UX DESIGNER /// END TO END SOLUTION ///";

export const DEFAULT_MARQUEE_SPEED = 35;

export const DEFAULT_OFFSCREEN_COORD = -200;

export const SPOTLIGHT_BUTTON_METRICS = {
  BG_RADIUS: 130,
  BORDER_RADIUS: 110,
  SPECULAR_RADIUS: 130,
} as const;

/** Runtime page that the blog's live React editor loads into its sandboxed preview iframe. */
export const PLAYGROUND_RUNTIME_ROUTE = '/playground-runtime';

/** Local-only CV editor (pages/cv.dev.tsx). The page only exists in development builds. */
export const CV_EDITOR_ROUTE = '/cv';

/** Pages rendered without the site shell, analytics and fonts. */
export const BARE_PAGE_ROUTES: readonly string[] = [PLAYGROUND_RUNTIME_ROUTE, CV_EDITOR_ROUTE];
