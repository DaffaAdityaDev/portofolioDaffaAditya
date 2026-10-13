import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useFreelanceStore } from '@/store/useFreelanceStore';
import { REPLY_WINDOW } from '../constants/content';
import { solidButtonClass } from './styles';

/**
 * Mobile-only bar pinned to the bottom of /freelance, jumping to the brief at #start. It shows once the
 * hero (#freelance-hero) has scrolled away and hides when #start comes into view, so it never covers the form or footer.
 */
export const StickyStartBar: React.FC = () => {
  const setStartMode = useFreelanceStore((s) => s.setStartMode);
  const [pastHero, setPastHero] = useState(false);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('freelance-hero');
    const end = document.getElementById('start');
    if (!hero || !end) return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0);
        // Reached, or already scrolled past into the footer
        if (entry.target === end) setAtEnd(entry.isIntersecting || entry.boundingClientRect.top < 0);
      }
    });
    observer.observe(hero);
    observer.observe(end);
    return () => observer.disconnect();
  }, []);

  const visible = pastHero && !atEnd;

  return (
    <div
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-neutral-800 bg-[#0a0a0a]/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-300 md:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-400">Replies {REPLY_WINDOW.toLowerCase()}</span>
        <a
          href="#start"
          onClick={() => setStartMode('brief')}
          className={`group inline-flex min-h-11 shrink-0 items-center gap-2 px-4 ${solidButtonClass}`}
        >
          Start a project <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
};

export default StickyStartBar;
