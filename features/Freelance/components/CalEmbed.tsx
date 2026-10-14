import React, { useEffect, useRef } from 'react';
import { CAL_LINK } from '../constants/content';
import { useFreelanceStore } from '@/store/useFreelanceStore';

const EMBED_SRC = 'https://app.cal.com/embed/embed.js';
const NAMESPACE = 'freelance-call';
// Containers that already have a calendar queued.
const embedded = new WeakSet<HTMLElement>();

type CalQueue = { (...args: unknown[]): void; q: unknown[][] };
type CalApi = CalQueue & { loaded?: boolean; ns: Record<string, CalQueue> };

declare global {
  interface Window {
    Cal?: CalApi;
  }
}

/**
 * Cal.com's embed loader, ported from their snippet: calls made before embed.js arrives are queued
 * and replayed once it loads. https://cal.com/docs/core-features/embed
 */
function cal(): CalApi {
  if (window.Cal) return window.Cal;
  const push = (api: CalQueue, args: unknown[]) => api.q.push(args);
  const api = function (...args: unknown[]) {
    if (!api.loaded) {
      api.ns = {};
      api.q = api.q || [];
      const script = document.createElement('script');
      script.src = EMBED_SRC;
      script.async = true;
      document.head.appendChild(script);
      api.loaded = true;
    }
    if (args[0] === 'init' && typeof args[1] === 'string') {
      const name = args[1];
      if (!api.ns[name]) {
        const ns = function (...nsArgs: unknown[]) {
          push(ns, nsArgs);
        } as CalQueue;
        ns.q = [];
        api.ns[name] = ns;
      }
      push(api.ns[name], args);
      push(api, ['initNamespace', name]);
      return;
    }
    push(api, args);
  } as CalApi;
  api.q = [];
  api.ns = {};
  window.Cal = api;
  return api;
}

/**
 * The Cal.com booking calendar, inline and in the site's dark theme. Every booking gets a Google Meet
 * room from the Cal.com event type. Name and email typed into the brief are carried over.
 */
export const CalEmbed: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = container.current;
    // The iframe only appears once embed.js loads, so a child count can't tell that StrictMode's second run already queued one.
    if (!CAL_LINK || !el || embedded.has(el)) return;
    embedded.add(el);
    const { name, email, message } = useFreelanceStore.getState().brief;
    const api = cal();
    api('init', NAMESPACE, { origin: 'https://cal.com' });
    const ns = api.ns[NAMESPACE];
    ns('inline', {
      elementOrSelector: el,
      calLink: CAL_LINK,
      config: {
        layout: 'month_view',
        theme: 'dark',
        ...(name.trim() && { name: name.trim() }),
        ...(email.trim() && { email: email.trim() }),
        ...(message.trim() && { notes: message.trim() }),
      },
    });
    ns('ui', { theme: 'dark', layout: 'month_view', hideEventTypeDetails: false, styles: { branding: { brandColor: '#ef4444' } } });
  }, []);

  return <div ref={container} className="min-h-[560px] w-full overflow-auto" />;
};

export default CalEmbed;
