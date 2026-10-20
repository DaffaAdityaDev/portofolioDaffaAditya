import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useFreelanceStore } from '../store';
import { REPLY_WINDOW } from '../constants/content';
import { buttonClasses } from '@/components/ui/Button';

/**
 * Mobile-only bar pinned to the bottom of /freelance, jumping to the brief at #start. It shows once the
 * hero (#freelance-hero) has scrolled away and hides when #start comes into view, so it never covers the form or footer.
 */
const StickyStartBar: React.FC = () => {
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
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-300 md:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-mono text-2xs uppercase tracking-widest text-muted-foreground">Replies {REPLY_WINDOW.toLowerCase()}</span>
        <a
          href="#start"
          onClick={() => setStartMode('brief')}
          className={buttonClasses({ className: 'group shrink-0' })}
        >
          Start a project <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
};

export default StickyStartBar;
