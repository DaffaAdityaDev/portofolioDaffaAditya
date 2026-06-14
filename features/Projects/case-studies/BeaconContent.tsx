import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: number;
  sender: 'agent' | 'user';
  text: string;
}

const BeaconContent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'agent', text: "Foreign environment perceived. Establishing the invisible boundary." }
  ]);
  const [inputValue, setInputValue] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = { id: Date.now(), sender: 'user', text: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    setTimeout(() => {
      const responses = [
        "Signal intercepted. Translation layer active.",
        "Encapsulated event logged. Host application styles did not leak.",
        "Attempt to query state denied. The Shadow DOM boundary is absolute.",
        "controlledWhisper() callback executed. Signal dispatched to host."
      ];
      const botMessage: Message = {
        id: Date.now() + 1,
        sender: 'agent',
        text: responses[Math.floor(Math.random() * responses.length)]
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      {/* Intro Paragraph 1 */}
      <p>
        To exist everywhere yet touch nothing. The challenge of the embeddable interface is a study in the philosophy of isolation. How does one dwell within foreign landscapes without disturbing the native soil?
      </p>

      {/* Intro Paragraph 2 */}
      <p>
        We shaped a resilient architecture born of the Shadow DOM. An artful boundary, invisible but absolute. It allows the entity to breathe within unpredictable territories, shielding its inner harmony from the chaos of external elements, while gently whispering across the void when interaction calls.
      </p>

      {/* Model 1: Structural Insulation Diagram */}
      <div className="sandbox-container">
        <div className="bg-[#0b0b0e] border border-zinc-800/60 p-5 rounded-2xl font-mono text-[11px] text-zinc-400 relative">
          <div className="flex items-center gap-2 border-b border-zinc-900 pb-3 mb-3 text-zinc-500 text-[10px] tracking-wider uppercase font-bold text-left">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            <span>STRUCTURAL INSULATION MODEL</span>
          </div>
          <div className="space-y-2 text-left pt-2">
            <div className="text-zinc-500">// HOST DOCUMENT LEVEL</div>
            <div className="text-zinc-300">CSS: Global Resets -{">"} Styles Blocked</div>
            <div className="flex items-center gap-2 pl-4 text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>#SHADOW-ROOT [OPEN]</span>
            </div>
            <div className="pl-8 text-zinc-500">// Scope isolation layer active</div>
            <div className="pl-8 text-zinc-300">Scoped CSS Core Applied</div>
          </div>
        </div>
      </div>

      {/* Interactive Mock Sandbox: BEACON_CORE_V2.0 */}
      <div className="sandbox-container pt-4">
        <div className="w-full max-w-[420px] mx-auto bg-zinc-950/80 border border-purple-900/20 rounded-3xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-950/60 to-indigo-950/60 px-5 py-4 text-white flex justify-between items-center text-left border-b border-purple-900/10">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <div>
                <h4 className="text-[10px] font-bold tracking-wider font-mono uppercase">BEACON_CORE_V2.0</h4>
                <span className="text-[8px] font-mono text-purple-400 uppercase tracking-widest">#SHADOWDOM ACTIVE</span>
              </div>
            </div>
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
            </div>
          </div>

          {/* Chat Panel */}
          <div className="p-5 h-64 overflow-y-auto flex flex-col gap-4 bg-[#080718]/40">
            <div className="text-center">
              <span className="text-[8px] text-purple-400/50 font-mono tracking-widest uppercase border border-purple-900/20 bg-purple-900/5 px-2 py-0.5 rounded-full">
                SHADOW DOM INITIALIZED. ISOLATION: 100%
              </span>
            </div>
            
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col gap-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <span className="text-[7px] font-mono text-zinc-500 uppercase tracking-widest">
                  {msg.sender === 'user' ? 'Host Site Environment' : 'Encapsulated Core'}
                </span>
                <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-zinc-900 text-zinc-200 rounded-tr-none border border-zinc-800 text-right' 
                    : 'bg-purple-950/30 text-purple-300 rounded-tl-none border border-purple-900/20 text-left'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Form */}
          <form onSubmit={handleSendMessage} className="border-t border-purple-900/20 bg-[#060512] flex items-center pr-3">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Whisper into the ether..."
              className="flex-1 bg-transparent px-5 py-3.5 text-xs text-zinc-300 outline-none placeholder-zinc-700 font-mono"
            />
            <button type="submit" className="p-2 text-purple-400 hover:text-white transition-colors cursor-pointer group">
              <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Serif Title Section */}
      <h2 className="font-serif">The Art of the Invisible Boundary</h2>

      {/* Section Paragraph 1 */}
      <p>
        Beyond the visual walls lies the delicate dance of interaction. True isolation requires mastering the silence between realms. We conceived a mechanism of controlled whispers across the boundary.
      </p>

      {/* Section Paragraph 2 */}
      <p>
        By intercepting the raw noise of the outside world and selectively translating it, we preserve the purity of the internal state. The host environment receives only the poetry of intended signals, never the chaotic static of the underlying machinery.
      </p>

      {/* Spec sheet metadata */}
      <div className="mono-specs">
        EVENT_MODEL: SYNTHETIC_PROXY <br />
        COMPOSED_PATH: RESTRICTED <br />
        BUBBLES: FALSE
      </div>

      {/* Model 2: Event Tunneling Topology Diagram */}
      <div className="sandbox-container">
        <div className="bg-[#0b0b0e] border border-zinc-800/60 p-6 rounded-2xl relative">
          <div className="flex items-center justify-center gap-2 border-b border-zinc-900 pb-3 mb-6 text-zinc-500 text-[10px] tracking-wider uppercase font-bold font-mono">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
            <span>EVENT TUNNELING TOPOLOGY</span>
          </div>
          <div className="flex flex-col items-center gap-4 text-center font-mono text-xs">
            <div className="bg-zinc-900/60 border border-zinc-800/60 px-6 py-3.5 rounded-xl w-full max-w-[300px]">
              <span className="text-zinc-400 block mb-1 text-[10px] font-bold">HOST APPLICATION</span>
              <span className="text-[9px] text-zinc-600 uppercase tracking-wider">onMouseMove() / onClick()</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-[1px] h-8 bg-zinc-800 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
              </div>
            </div>
            
            <div className="bg-purple-950/20 border border-purple-500/20 px-6 py-3.5 rounded-xl w-full max-w-[300px]">
              <span className="text-purple-400 block mb-1 text-[10px] font-bold">SHADOW DOM (ISOLATED)</span>
              <span className="text-[9px] text-purple-600 uppercase tracking-wider">Raw Client Event | Scoped State</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BeaconContent;
