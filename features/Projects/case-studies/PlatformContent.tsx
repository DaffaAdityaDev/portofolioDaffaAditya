import React, { useState, useEffect } from 'react';

const PlatformContent: React.FC = () => {
  const [threadLoad, setThreadLoad] = useState(25);
  const [gcCalls, setGcCalls] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setThreadLoad(Math.floor(Math.random() * 20) + 15);
      if (Math.random() > 0.8) {
        setGcCalls(prev => prev + 1);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Category Monospace Subtitle */}
      <div className="mono-specs">
        01 // PLATFORM OPTIMIZATION
      </div>

      {/* Serif Main Title */}
      <h2 className="font-serif">Decoupling Enterprise UI Core into a Bounded Library</h2>

      {/* Lead Paragraph with dropcap hook */}
      <p className="lead">
        By analyzing runtime thread blocks, we discovered that <strong>state synchronization in the low-code builder was causing main-thread starvation</strong>. We decoupled the layout engine's rendering cycle and packaged the UI kit into an isolated npm package.
      </p>

      {/* Bottleneck blockquote callout hook */}
      <blockquote className="border-l-2 border-red-500 bg-red-950/10 p-5 my-6 max-w-[42rem] mx-auto text-left">
        <span className="text-[9px] font-mono text-red-500 uppercase tracking-wider block font-bold mb-1">// CORE ARCHITECTURAL BOTTLENECK</span>
        <p className="text-zinc-300 text-xs leading-relaxed m-0 italic font-mono">
          "A rendering core meant to be immediate was bottlenecked by synchronous cross-component layout recalculations, starving frames by 24% under active drag-and-drop actions."
        </p>
      </blockquote>

      {/* Paragraph 2 with bold specifications */}
      <p>
        This resulted in a <strong>modular, tree-shakable architectural abstraction</strong> that dropped cross-project bundle loading sizes by <strong>40%</strong> and established immune style boundaries for downstream consumers.
      </p>

      {/* Sandbox Visualizer Wrapper */}
      <div className="sandbox-container">
        <div className="bg-[#0b0b0e] border border-zinc-800/60 p-6 rounded-2xl space-y-6">
          <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold">// WASM CORE DIAGNOSTICS</span>
            <span className="text-[9px] font-mono bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full animate-pulse">ACTIVE</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-1">
                <span>THREAD LOAD UTILIZATION</span>
                <span>{threadLoad}%</span>
              </div>
              <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full transition-all duration-1000" 
                  style={{ width: `${threadLoad}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-900/50 text-left">
              <div>
                <span className="text-[9px] font-mono text-zinc-500 block uppercase">GARBAGE COLLECTS</span>
                <span className="text-base font-bold font-mono text-white">{gcCalls}</span>
              </div>
              <div>
                <span className="text-[9px] font-mono text-zinc-500 block uppercase">ASYNC MEMORY BOUND</span>
                <span className="text-base font-bold font-mono text-emerald-400">12.4 MB</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setGcCalls(0)}
            className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-[10px] font-mono uppercase tracking-wider text-zinc-300 transition-colors border border-zinc-850 cursor-pointer"
          >
            Force Garbage Collection Flush
          </button>
        </div>
      </div>
    </>
  );
};

export default PlatformContent;
