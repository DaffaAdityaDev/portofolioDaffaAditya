import React from 'react';
import { ShieldCheck, CheckCircle2, UserCheck } from 'lucide-react';
import { TESTIMONIALS } from '../constants';

export const TrustSection: React.FC = () => {
  return (
    <section aria-label="Trust & Testimonials" className="w-full grid grid-cols-1 lg:grid-cols-2 gap-[1px] bg-zinc-800 border-b border-zinc-800">
      
      {/* The "Clean Handoff" Guarantee Cell */}
      <div className="bg-[#0f0f13] p-8 md:p-12 xl:p-16 space-y-6 border-b lg:border-b-0 border-zinc-800 lg:border-r border-zinc-800 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 border-b border-zinc-800 pb-4 mb-6">
            <ShieldCheck size={18} className="text-red-500" />
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-bold">The Clean Handoff Guarantee</span>
          </div>
          
          <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight leading-snug mb-4">
            Write code once. Maintain it forever.
          </h3>
          
          <p className="text-sm font-mono text-zinc-400 leading-relaxed mb-6">
            Freelance clients are terrified of hiring engineers who deliver unmaintainable black boxes. 
            I design all custom logic with robust JSDoc declarations, standard TypeScript configurations, 
            and modular directory boundaries.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-sm text-zinc-300">
            <div className="p-3 border border-zinc-800 rounded bg-zinc-900/30 flex items-start gap-2">
              <CheckCircle2 size={12} className="text-red-500 shrink-0 mt-0.5" />
              <span>Comprehensive README, env setups & deploy docs</span>
            </div>
            <div className="p-3 border border-zinc-800 rounded bg-zinc-900/30 flex items-start gap-2">
              <CheckCircle2 size={12} className="text-red-500 shrink-0 mt-0.5" />
              <span>Modular state management with zero tight-coupling</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-zinc-800 pt-6 mt-6 font-mono text-xs text-zinc-400 uppercase flex justify-between">
          <span>Maintainability Index: 100/100</span>
          <span>Type Coverage: Strict-True</span>
        </div>
      </div>

      {/* Testimonials / Technical Commendations Cell */}
      <div className="bg-[#0f0f13] p-8 md:p-12 xl:p-16 space-y-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 border-b border-zinc-800 pb-4 mb-6">
            <UserCheck size={18} className="text-red-500" />
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-bold">Technical Commendations</span>
          </div>
          
          <div className="space-y-6">
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className="border-l-2 border-red-500 pl-4 space-y-2">
                <p className="text-sm md:text-base font-mono text-zinc-300 italic leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <span className="text-xs font-mono text-zinc-400 uppercase block font-bold">
                  // {t.author}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};

export default TrustSection;
