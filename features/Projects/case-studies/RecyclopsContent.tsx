import React, { useState } from 'react';

const RecyclopsContent: React.FC = () => {
  const [points, setPoints] = useState(120);

  return (
    <>
      {/* Category Monospace Subtitle */}
      <div className="mono-specs">
        01 // COMMUNITY GAMIFICATION
      </div>

      {/* Serif Main Title */}
      <h2 className="font-serif">Gamified Mobile Architectures and Geo-Location Systems</h2>

      {/* Lead Paragraph with dropcap hook */}
      <p className="lead">
        Recyclops motivates communities using mobile-first gamification frameworks. We integrated <strong>real-time coordinate logging and carbon footprint calculators</strong>, connected directly to Firebase backend listeners.
      </p>

      {/* Geo tracking callout hook */}
      <blockquote className="border-l-2 border-red-500 bg-red-950/10 p-5 my-6 max-w-[42rem] mx-auto text-left">
        <span className="text-[9px] font-mono text-red-500 uppercase tracking-wider block font-bold mb-1">// REAL-TIME GPS ACCURACY</span>
        <p className="text-zinc-300 text-xs leading-relaxed m-0 italic font-mono">
          "Tracking coordinate points in high-density areas required lightweight state uploads to prevent high network usage bills for mobile users. We optimized payload packet weight down to 2KB."
        </p>
      </blockquote>

      {/* Paragraph 2 with bold specifications */}
      <p>
        By designing **lightweight geolocation trackers and custom database listener mappings**, we enabled responsive coordinate updates with over **92% CPU execution efficiency**.
      </p>

      {/* Sandbox Visualizer Wrapper */}
      <div className="sandbox-container">
        <div className="bg-[#0b0b0e] border border-zinc-800/60 p-6 rounded-2xl space-y-6">
          <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold">// GEO SANDBOX ENVIRONMENT</span>
            <span className="text-[9px] font-mono text-teal-400 font-bold bg-teal-500/10 px-2 py-0.5 rounded-full animate-pulse">GPS_CALIBRATING</span>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between items-center min-h-[120px]">
            <span className="text-[9px] font-mono text-zinc-500 uppercase">Simulated Recycle Registry Point</span>
            <span className="text-2xl font-bold font-mono text-white mt-2">{points} kg CO2 Saved</span>
            <p className="text-[9px] text-zinc-500 text-center font-mono mt-1">LAT: -6.2088 // LNG: 106.8456</p>
          </div>

          <button 
            onClick={() => setPoints(prev => prev + Math.floor(Math.random() * 5) + 3)}
            className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-[10px] font-mono uppercase tracking-wider text-zinc-300 transition-colors border border-zinc-850 cursor-pointer"
          >
            Simulate User Recycle Submission
          </button>
        </div>
      </div>
    </>
  );
};

export default RecyclopsContent;
