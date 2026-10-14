import type { NextApiRequest, NextApiResponse } from 'next';
import { CvPathError } from './paths';

/**
 * Shared gate for the /api/cv/* routes. They 404 in production (see pageExtensions in next.config.js). In dev
 * they only answer the local machine: `next dev` listens on every interface, so without the loopback check
 * anyone on the LAN could rewrite cv-src.
 */

const LOOPBACK = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1']);
// Host header names that mean "this machine". A DNS-rebound site reaches the loopback socket with its own
// hostname in Host (and a matching Origin), so the socket and same-origin checks alone would let it in.
const LOOPBACK_HOSTNAMES = new Set(['localhost', '127.0.0.1', '[::1]']);

/** Returns false after answering the request itself when it must not go further. */
export function allowCvRequest(req: NextApiRequest, res: NextApiResponse, methods: string[]): boolean {
  if (process.env.NODE_ENV === 'production' || !LOOPBACK.has(req.socket.remoteAddress ?? '') || !loopbackHost(req)) {
    res.status(404).json({ error: 'Not found' });
    return false;
  }
  if (!req.method || !methods.includes(req.method)) {
    res.setHeader('Allow', methods.join(', '));
    res.status(405).json({ error: 'Method not allowed' });
    return false;
  }
  // Writes only from the editor page itself: another site open in the same browser must not reach localhost.
  if (req.method !== 'GET' && !sameOrigin(req)) {
    res.status(403).json({ error: 'Forbidden' });
    return false;
  }
  return true;
}

function loopbackHost(req: NextApiRequest): boolean {
  const host = req.headers.host;
  if (!host) return false;
  try {
    return LOOPBACK_HOSTNAMES.has(new URL(`http://${host}`).hostname);
  } catch {
    return false;
  }
}

function sameOrigin(req: NextApiRequest): boolean {
  const origin = req.headers.origin;
  if (!origin || !req.headers.host) return false;
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
}

/** Answers path errors with their status and anything else with a logged 500. */
export function sendCvError(res: NextApiResponse, err: unknown, route: string) {
  if (err instanceof CvPathError) return res.status(err.status).json({ error: err.message });
  console.error(`[api/cv/${route}]`, err);
  return res.status(500).json({ error: err instanceof Error ? err.message : 'Internal error' });
}

/** The JSON body as a record; Next has already parsed it when the request sent application/json. */
export function jsonBody(req: NextApiRequest): Record<string, unknown> {
  return req.body && typeof req.body === 'object' ? (req.body as Record<string, unknown>) : {};
}
