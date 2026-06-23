import React from 'react';
import { Module } from '../constants';

interface DiagnosticCardProps {
  module: Module;
}

const DiagnosticCard: React.FC<DiagnosticCardProps> = ({ module }) => {
  return (
    <div className="bg-[#0a0a0a] border border-zinc-800 p-6 flex flex-col transition-colors group relative">
      
      {/* Clockwise Border Animation Overlay */}
      <svg className="border-trace-svg" aria-hidden="true">
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          pathLength="100"
          className="border-trace-rect"
        />
      </svg>
      
      {/* Card Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <div className="text-zinc-500 group-hover:text-white transition-colors">{module.icon}</div>
             <span className="font-mono text-sm font-bold text-white tracking-widest uppercase">{module.name}</span>
           </div>
           <div className="font-mono text-xs text-zinc-600 uppercase">Module ID: {module.id}</div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-900/10 border border-emerald-900/20 rounded-sm">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
           <span className="font-mono text-xs text-emerald-500">{module.status}</span>
        </div>
      </div>

      {/* Processes List */}
      <div className="space-y-2">
        {module.processes.map((proc, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center font-mono text-sm py-1 border-b border-zinc-900/50 transition-colors relative"
          >
            <span className="text-zinc-400 group-hover:text-zinc-300 z-10 transition-colors">
              {proc.name}
            </span>
            <span className="text-zinc-600 z-10">[{proc.version}]</span>
            
            {/* Row Underline Trace Animation */}
            <span
              className="border-trace-line"
              style={{ transitionDelay: `${idx * 30}ms` }}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiagnosticCard;
