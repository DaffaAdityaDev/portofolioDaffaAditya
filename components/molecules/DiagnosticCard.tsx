import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { diagnosticStack } from '@/data/DiagnosticStack';

type Module = typeof diagnosticStack[0];

interface DiagnosticCardProps {
  module: Module;
}

const DiagnosticCard: React.FC<DiagnosticCardProps> = ({ module }) => {
  return (
    <div className="bg-[#0a0a0a] border border-zinc-800 p-6 flex flex-col hover:border-zinc-600 transition-colors group">
      
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
          <div key={idx} className="flex justify-between items-center font-mono text-sm py-1 border-b border-zinc-900/50 group-hover:border-zinc-800 transition-colors">
            <span className="text-zinc-400 group-hover:text-zinc-300">{proc.name}</span>
            <span className="text-zinc-600">[{proc.version}]</span>
          </div>
        ))}
      </div>

      {/* Footer Metrics */}
      {/* <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
         <div className="flex flex-col">
            <span className="font-mono text-xs text-zinc-600 uppercase">Uptime</span>
            <span className="font-mono text-sm text-white font-bold">{module.uptime}</span>
         </div>
         <div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-600 group-hover:text-white group-hover:bg-zinc-900 transition-all">
            <CheckCircle2 size={14} />
         </div>
      </div> */}
    </div>
  );
};

export default DiagnosticCard;
