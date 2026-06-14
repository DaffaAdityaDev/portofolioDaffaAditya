import React, { useState } from 'react';

const QQTechContent: React.FC = () => {
  const [load, setLoad] = useState(45);

  return (
    <>
      {/* Category Monospace Subtitle */}
      <div className="mono-specs">
        01 // PLATFORM ARCHITECTURE
      </div>

      {/* Serif Main Title */}
      <h2 className="font-serif">High-Availability HR Pipelines and Corporate Hubs</h2>

      {/* Lead Paragraph with dropcap hook */}
      <p className="lead">
        QQTech coordinates multiple digital services. We designed their corporate framework using <strong>modular API controllers</strong>, enabling smooth data serialization pathways between their PHP Laravel models and Vue.js frontends.
      </p>

      {/* API gateway bottleneck callout hook */}
      <blockquote className="border-l-2 border-red-500 bg-red-950/10 p-5 my-6 max-w-[42rem] mx-auto text-left">
        <span className="text-[9px] font-mono text-red-500 uppercase tracking-wider block font-bold mb-1">// API GATEWAY LATENCY</span>
        <p className="text-zinc-300 text-xs leading-relaxed m-0 italic font-mono">
          "Connecting high-frequency Vue widgets to PHP models required cache indexing. Unoptimized database queries led to response latency spikes under concurrent employee check-in spikes."
        </p>
      </blockquote>

      {/* Paragraph 2 with bold specifications */}
      <p>
        By implementing **database payload indexing and Redis cache synchronization hooks**, we reduced overall page transition times, keeping corporate hub platforms fast and fully responsive.
      </p>

      {/* Sandbox Visualizer Wrapper */}
      <div className="sandbox-container">
        <div className="bg-[#0b0b0e] border border-zinc-800/60 p-6 rounded-2xl space-y-6">
          <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold">// HR GATEWAY API CONTROLLERS</span>
            <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">STABLE</span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center bg-zinc-900/40 border border-zinc-900 px-4 py-3 rounded-xl">
              <span className="text-[11px] font-mono text-zinc-400">Laravel DB Cache Health</span>
              <span className="text-[11px] font-mono font-bold text-white">98.4% Hit</span>
            </div>

            <div className="text-left">
              <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-1">
                <span>Simulated Network Latency (Load-Dependent)</span>
                <span>{load}ms</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="200" 
                value={load} 
                onChange={(e) => setLoad(Number(e.target.value))} 
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QQTechContent;
