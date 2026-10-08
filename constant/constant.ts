/**
 * Global Constants & Layout Tokens
 * Zero Magic Numbers & Centralized Config
 */

export const MARQUEE_TEXT = "SOFTWARE ENGINEER /// NEXT.JS /// TYPESCRIPT /// LARAVEL /// POSTGRESQL /// JAKARTA ///";

export const DEFAULT_MARQUEE_SPEED = 35;

export const DEFAULT_SPOTLIGHT_RADIUS = 260;

export const DEFAULT_OFFSCREEN_COORD = -200;

export const SPOTLIGHT_BUTTON_METRICS = {
  BG_RADIUS: 130,
  BORDER_RADIUS: 110,
  SPECULAR_RADIUS: 130,
} as const;

export const DEFAULT_AMBIENT_SPOTLIGHT = 'rgba(239, 68, 68, 0.02)';

export const IDLE_RADAR_TIMEOUT_MS = 2200;

/** Runtime page that the blog's live React editor loads into its sandboxed preview iframe. */
export const PLAYGROUND_RUNTIME_ROUTE = '/playground-runtime';

/** Pages rendered without the site shell, analytics and fonts. */
export const BARE_PAGE_ROUTES: readonly string[] = [PLAYGROUND_RUNTIME_ROUTE];
