import React, { useState } from 'react';

const ArtifyoContent: React.FC = () => {
  const [gap, setGap] = useState(16);

  return (
    <>
      {/* Category Monospace Subtitle */}
      <div className="mono-specs">
        01 // CREATIVE PORTFOLIO
      </div>

      {/* Serif Main Title */}
      <h2 className="font-serif">High-Performance Image Layout Scaling</h2>

      {/* Lead Paragraph with dropcap hook */}
      <p className="lead">
        Artifyo is a design showcase platform. We focused on <strong>layout responsiveness, lazy-loading optimizations, and fluid grid systems</strong> to display high-resolution creative designs without lagging during scroll cycles.
      </p>

      {/* Grid rendering callout hook */}
      <blockquote className="border-l-2 border-red-500 bg-red-950/10 p-5 my-6 max-w-[42rem] mx-auto text-left">
        <span className="text-[9px] font-mono text-red-500 uppercase tracking-wider block font-bold mb-1">// DYNAMIC GRID RE-FLOWS</span>
        <p className="text-zinc-300 text-xs leading-relaxed m-0 italic font-mono">
          "Preventing layout shifts during image resizing required establishing strict aspect-ratio containers. Unoptimized gap animations caused massive layout re-flow cascades, dropping rendering speeds below 30 FPS."
        </p>
      </blockquote>

      {/* Paragraph 2 with bold specifications */}
      <p>
        By designing **immutable aspect-ratio grids and lazy-loaded image hooks**, we reduced Cumulative Layout Shift (CLS) scores to **0.4s**, rendering creative portfolios with buttery-smooth transition animations.
      </p>

      {/* Sandbox Visualizer Wrapper */}
      <div className="sandbox-container">
        <div className="bg-[#0b0b0e] border border-zinc-800/60 p-6 rounded-2xl space-y-6">
          <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold">// INTERACTIVE GRID SPACING</span>
            <span className="text-[9px] font-mono text-pink-400 font-bold bg-pink-500/10 px-2 py-0.5 rounded-full">VISUALIZER</span>
          </div>

          <div className="grid grid-cols-3 bg-zinc-900/50 p-4 border border-zinc-900 rounded-2xl transition-all duration-300" style={{ gap: `${gap}px` }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-square bg-zinc-800 border border-zinc-700 rounded flex items-center justify-center font-mono text-xs text-zinc-500">
                BOX_{i}
              </div>
            ))}
          </div>

          <div className="text-left">
            <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-1">
              <span>Grid Container Gap</span>
              <span>{gap}px</span>
            </div>
            <input 
              type="range" 
              min="4" 
              max="32" 
              value={gap} 
              onChange={(e) => setGap(Number(e.target.value))} 
              className="w-full accent-pink-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ArtifyoContent;
