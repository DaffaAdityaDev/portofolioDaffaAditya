import React, { useState } from 'react';

const AccountingContent: React.FC = () => {
  const [status, setStatus] = useState<'IDLE' | 'SYNCING' | 'SECURE'>('SECURE');

  const triggerSync = () => {
    setStatus('SYNCING');
    setTimeout(() => setStatus('SECURE'), 2000);
  };

  return (
    <>
      {/* Category Monospace Subtitle */}
      <div className="mono-specs">
        01 // CLOUD ARCHITECTURE
      </div>

      {/* Serif Main Title */}
      <h2 className="font-serif">Distributed Ledger Syncing Across Multi-Tenant Nodes</h2>

      {/* Lead Paragraph with dropcap hook */}
      <p className="lead">
        Accounting+ orchestrates billing profiles across decentralized microservice channels. We integrated <strong>resilient caching layers and structured optimistic updates</strong> to ensure transactions never collide during double-entry postings.
      </p>

      {/* Concurrency bottleneck callout hook */}
      <blockquote className="border-l-2 border-red-500 bg-red-950/10 p-5 my-6 max-w-[42rem] mx-auto text-left">
        <span className="text-[9px] font-mono text-red-500 uppercase tracking-wider block font-bold mb-1">// ASYNC CONCURRENCY COLLISION</span>
        <p className="text-zinc-300 text-xs leading-relaxed m-0 italic font-mono">
          "Distributed double-entry entries required sub-millisecond atomic transactions. Race conditions between multi-tenant storage nodes threatened transaction ledger validity."
        </p>
      </blockquote>

      {/* Paragraph 2 with bold specifications */}
      <p>
        By leveraging <strong>Redis cache locks and transactional isolated nodes</strong>, we achieved synchronization latency under <strong>180ms</strong>, preventing balance state drift.
      </p>

      {/* Sandbox Visualizer Wrapper */}
      <div className="sandbox-container">
        <div className="bg-[#0b0b0e] border border-zinc-800/60 p-6 rounded-2xl space-y-6">
          <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold">// DISTRIBUTED SYNC PIPELINE</span>
            <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${
              status === 'SYNCING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>{status}</span>
          </div>

          <div className="flex justify-around items-center py-6 bg-zinc-900/30 rounded-2xl border border-zinc-900 relative">
            <div className="text-center z-10">
              <div className="w-8 h-8 rounded-full bg-blue-900/40 border border-blue-500 flex items-center justify-center text-xs font-mono text-blue-400 font-bold mx-auto mb-2 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                L1
              </div>
              <span className="text-[9px] font-mono text-zinc-500 block">LEDGER</span>
            </div>

            <div className="w-16 h-[2px] bg-zinc-800 relative overflow-hidden">
              {status === 'SYNCING' && <div className="absolute inset-0 bg-blue-400 animate-pulse w-full h-full" />}
            </div>

            <div className="text-center z-10">
              <div className="w-8 h-8 rounded-full bg-indigo-900/40 border border-indigo-500 flex items-center justify-center text-xs font-mono text-indigo-400 font-bold mx-auto mb-2 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                DB
              </div>
              <span className="text-[9px] font-mono text-zinc-500 block">POSTGRES</span>
            </div>
          </div>

          <button 
            onClick={triggerSync}
            disabled={status === 'SYNCING'}
            className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-[10px] font-mono uppercase tracking-wider text-zinc-300 transition-colors border border-zinc-850 cursor-pointer disabled:opacity-50"
          >
            {status === 'SYNCING' ? 'COMMITTING ASYNC LEDGER...' : 'TRIGGER ASYNC SYSTEM RE-SYNC'}
          </button>
        </div>
      </div>
    </>
  );
};

export default AccountingContent;
