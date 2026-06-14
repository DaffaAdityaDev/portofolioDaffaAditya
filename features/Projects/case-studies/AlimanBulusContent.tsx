import React, { useState } from 'react';

const AlimanBulusContent: React.FC = () => {
  const [balance, setBalance] = useState(12500000);

  return (
    <>
      {/* Category Monospace Subtitle */}
      <div className="mono-specs">
        01 // ADMINISTRATIVE ACCOUNTING
      </div>

      {/* Serif Main Title */}
      <h2 className="font-serif">Secure Student Tuition Ledgers and Boarding School Gates</h2>

      {/* Lead Paragraph with dropcap hook */}
      <p className="lead">
        Aliman manages complex student ledger structures. We structured the <strong>accounting database tables to handle concurrent student payments</strong>, ensuring ledgers remain consistent across fiscal semesters.
      </p>

      {/* Database transaction callout hook */}
      <blockquote className="border-l-2 border-red-500 bg-red-950/10 p-5 my-6 max-w-[42rem] mx-auto text-left">
        <span className="text-[9px] font-mono text-red-500 uppercase tracking-wider block font-bold mb-1">// TRANSACTION LEDGER LOCKS</span>
        <p className="text-zinc-300 text-xs leading-relaxed m-0 italic font-mono">
          "Managing student tuition entries under high concurrency levels required pessimistic write locks to prevent balance record overwrites. We optimized SQL database indexes for sub-10ms response latency."
        </p>
      </blockquote>

      {/* Paragraph 2 with bold specifications */}
      <p>
        By integrating **atomic database transactions and strict cash registry rules**, we eliminated discrepancies across semesters and guaranteed consistent ledger auditing reports.
      </p>

      {/* Sandbox Visualizer Wrapper */}
      <div className="sandbox-container">
        <div className="bg-[#0b0b0e] border border-zinc-800/60 p-6 rounded-2xl space-y-6">
          <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold">// BOARDING LEDGER CASH REGISTRY</span>
            <span className="text-[9px] font-mono text-orange-400 font-bold bg-orange-500/10 px-2 py-0.5 rounded-full animate-pulse">AUDITED</span>
          </div>

          <div className="space-y-2 text-left">
            <div className="flex justify-between text-xs font-mono text-zinc-400 p-2.5 bg-zinc-900/40 border border-zinc-900 rounded-xl">
              <span>BOARDING SYSTEM BALANCE</span>
              <span className="text-white font-bold">Rp {balance.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-xs font-mono text-zinc-400 p-2.5 bg-zinc-900/40 border border-zinc-900 rounded-xl">
              <span>UNALLOCATED LIABILITIES</span>
              <span className="text-rose-500 font-bold">Rp 0</span>
            </div>
          </div>

          <button 
            onClick={() => setBalance(prev => prev + 500000)}
            className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-[10px] font-mono uppercase tracking-wider text-zinc-300 transition-colors border border-zinc-850 cursor-pointer"
          >
            Post Rp 500.000 Tuition Payment
          </button>
        </div>
      </div>
    </>
  );
};

export default AlimanBulusContent;
