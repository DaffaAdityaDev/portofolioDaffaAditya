import React, { useState } from 'react';
import { FAQS } from '../constants';

export const FaqSection: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <section className="w-full bg-[#0b0b0e] px-6 sm:px-12 md:px-16 lg:px-24 py-16 md:py-24 border-b border-zinc-800">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 border-b border-zinc-800 pb-6 text-center sm:text-left">
          <span className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold">// SYSTEM_RISK_ASSESSMENT</span>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mt-2">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="border border-zinc-800 bg-zinc-900/20 rounded-xl overflow-hidden transition-all duration-300 hover:border-zinc-700">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex justify-between items-center text-left p-6 font-mono font-bold uppercase text-white hover:text-red-500 transition-colors gap-4"
              >
                <span className="text-sm md:text-base">{faq.q}</span>
                <span className="text-red-500 font-bold shrink-0">{activeFaq === idx ? '[-]' : '[+]'}</span>
              </button>
              {activeFaq === idx && (
                <div className="px-6 pb-6 text-sm font-mono text-zinc-300 leading-relaxed border-t border-zinc-800/80 pt-4 bg-zinc-900/10">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
