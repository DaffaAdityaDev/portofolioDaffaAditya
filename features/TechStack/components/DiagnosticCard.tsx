import React from 'react';
import { motion } from 'framer-motion';
import { Module } from '../constants';
import { SPRING_MOBILE_OS } from '@/constant/animations';

interface DiagnosticCardProps {
  module: Module;
  onSelect?: (module: Module) => void;
}

const DiagnosticCard: React.FC<DiagnosticCardProps> = ({ module, onSelect }) => {
  return (
    <motion.div
      layoutId={`diagnostic-module-${module.id}`}
      transition={SPRING_MOBILE_OS}
      onClick={() => onSelect?.(module)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.(module);
        }
      }}
      className="bg-[#0a0a0a] border border-zinc-800 hover:border-zinc-700 p-6 flex flex-col transition-colors group relative cursor-pointer rounded-xl focus:outline-none focus-visible:ring-1 focus-visible:ring-red-500/50"
    >
      {/* Clockwise Border Animation Overlay */}
      <svg className="border-trace-svg rounded-xl" aria-hidden="true">
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          rx="12"
          ry="12"
          pathLength="100"
          className="border-trace-rect"
        />
      </svg>
      
      {/* Card Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="text-zinc-500 group-hover:text-red-400 transition-colors">{module.icon}</div>
            <span className="font-mono text-sm font-bold text-white tracking-widest uppercase">
              {module.name}
            </span>
          </div>
          <div className="font-mono text-xs text-zinc-600 uppercase">Module ID: {module.id}</div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-900/10 border border-emerald-900/20 rounded-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-xs text-emerald-500">{module.status}</span>
        </div>
      </div>

      {/* Processes List */}
      <div className="relative z-10 space-y-2 flex-1">
        {module.processes.map((proc, idx) => (
          <div
            key={idx}
            className="flex justify-between items-baseline gap-3 font-mono text-sm py-1 border-b border-zinc-900/50 last:border-b-0 transition-colors relative"
          >
            <span className="text-zinc-400 group-hover:text-zinc-300 z-10 transition-colors leading-snug">
              {proc.name}
            </span>
            <span className="text-zinc-500 font-mono text-xs z-10 shrink-0 whitespace-nowrap text-right">
              [{proc.roleLabel}]
            </span>
            
            {/* Row Underline Trace Animation */}
            <span
              className="border-trace-line"
              style={{ transitionDelay: `${idx * 30}ms` }}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>

      {/* Footer hint */}
      <div className="relative z-10 mt-4 pt-3 border-t border-zinc-900 flex justify-between items-center text-[10px] font-mono text-zinc-600 group-hover:text-zinc-400 transition-colors">
        <span>VIEW BLUEPRINT</span>
        <span className="text-zinc-700 group-hover:text-red-400 font-bold transition-colors">TAP // &rarr;</span>
      </div>
    </motion.div>
  );
};

export default DiagnosticCard;

