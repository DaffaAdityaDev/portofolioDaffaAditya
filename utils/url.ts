/**
 * Rewrites the URL in place without going through the router, keeping Next's history state
 * (with `as` updated) so back/forward still work.
 */
export function replaceUrl(url: string) {
  window.history.replaceState({ ...window.history.state, as: url }, '', url);
}
