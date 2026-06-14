import React, { useState } from 'react';

const OmbudsmanContent: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([
    'INIT: Secure authentication check passed',
    'DB: Connection pools established on port 5432'
  ]);

  const addLog = () => {
    const events = [
      'SECURE: RBAC rule validation completed',
      'CACHE: Evicted stale inventory records',
      'POST: Audit log serial ID pushed successfully',
      'API: Handshake response verified by server'
    ];
    setLogs(prev => [events[Math.floor(Math.random() * events.length)], ...prev.slice(0, 3)]);
  };

  return (
    <>
      {/* Category Monospace Subtitle */}
      <div className="mono-specs">
        01 // GOVERNMENT SYSTEM SECURITY
      </div>

      {/* Serif Main Title */}
      <h2 className="font-serif">Role-Based Inventory Scaffolding for Government Audit Trails</h2>

      {/* Lead Paragraph with dropcap hook */}
      <p className="lead">
        Government platforms demand absolute transparency. We built a <strong>custom logging pipeline that serializes transaction records</strong> into cryptographically isolated log blocks, protecting state records from tampering.
      </p>

      {/* Security callout hook */}
      <blockquote className="border-l-2 border-red-500 bg-red-950/10 p-5 my-6 max-w-[42rem] mx-auto text-left">
        <span className="text-[9px] font-mono text-red-500 uppercase tracking-wider block font-bold mb-1">// GOVERNMENT INTEGRITY MANDATE</span>
        <p className="text-zinc-300 text-xs leading-relaxed m-0 italic font-mono">
          "Government system databases must withstand administrative auditing. Transaction history logs must be isolated from standard deletion commands, establishing mathematical proof of audit trail consistency."
        </p>
      </blockquote>

      {/* Paragraph 2 with bold specifications */}
      <p>
        By structuring <strong>immutable audit blocks and strictly scoped role-based access rules</strong>, we prevented unauthorized database operations and ensured strict adherence to legislative reporting requirements.
      </p>

      {/* Sandbox Visualizer Wrapper */}
      <div className="sandbox-container">
        <div className="bg-[#0b0b0e] border border-zinc-800/60 p-6 rounded-2xl space-y-6">
          <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold">// AUDIT LOGGING REGISTRY</span>
            <span className="text-[9px] font-mono text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded-full animate-pulse">ENCRYPTED</span>
          </div>

          <div className="bg-black/80 rounded-2xl p-4 border border-zinc-900 h-40 overflow-y-auto font-mono text-[10px] text-zinc-450 space-y-2 text-left">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-2 border-b border-zinc-950 pb-1.5 last:border-0">
                <span className="text-purple-500 shrink-0">// [LOG]</span>
                <span className="break-all">{log}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={addLog}
            className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-[10px] font-mono uppercase tracking-wider text-zinc-300 transition-colors border border-zinc-850 cursor-pointer"
          >
            Generate Secure Audit Transaction
          </button>
        </div>
      </div>
    </>
  );
};

export default OmbudsmanContent;
