import React, { useState, useEffect, useRef } from 'react';

const RivianContent: React.FC = () => {
  const [chargingRate, setChargingRate] = useState(125);
  const [voltage, setVoltage] = useState(380);
  const [isCharging, setIsCharging] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationId: number;
    let offset = 0;

    const resizeCanvas = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
      }
      canvas.height = 140;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(255, 107, 0, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 30) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      ctx.strokeStyle = '#ff6b00';
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(255, 107, 0, 0.4)';
      ctx.beginPath();
      
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + 
          Math.sin(x * 0.02 + offset) * 20 * (isCharging ? 1 : 0.1) + 
          Math.cos(x * 0.05 - offset * 0.5) * 5 * (isCharging ? 1 : 0.1);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      offset += 0.05;
      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isCharging]);

  const toggleChargeState = () => {
    setIsCharging(!isCharging);
    if (isCharging) {
      setChargingRate(125);
      setVoltage(380);
    } else {
      setChargingRate(0);
      setVoltage(0);
    }
  };

  return (
    <>
      {/* Category Monospace Subtitle */}
      <div className="mono-specs">
        01 // THE CRITICAL INCIDENT
      </div>

      {/* Serif Main Title */}
      <h2 className="font-serif">When Thread Starvation Freezes Bluetooth Handshakes</h2>

      {/* Lead Paragraph with dropcap hook */}
      <p className="lead">
        During heavy user navigation inside remote parks, <strong>high-frequency telemetric feeds from the vehicle's onboard computer</strong> would constantly clash with the JavaScript main thread.
      </p>

      {/* BLE thread starvation callout hook */}
      <blockquote className="border-l-2 border-red-500 bg-red-950/10 p-5 my-6 max-w-[42rem] mx-auto text-left">
        <span className="text-[9px] font-mono text-red-500 uppercase tracking-wider block font-bold mb-1">// MAIN-THREAD STARVATION</span>
        <p className="text-zinc-300 text-xs leading-relaxed m-0 italic font-mono">
          "Processing high-frequency Bluetooth telemetry queues directly on the rendering main thread caused frame-drops. The socket connection timed out, causing up to 14.5% packet drop loss."
        </p>
      </blockquote>

      {/* Paragraph 2 with bold specifications */}
      <p>
        By isolating telemetric sockets to **web workers and background thread handlers**, we achieved a **99.94% BLE socket connection success rate** even during intensive UI interactions.
      </p>

      {/* Sandbox Visualizer Wrapper */}
      <div className="sandbox-container pt-4">
        <div className="w-full max-w-[340px] mx-auto aspect-[9/18.5] bg-[#16171d] rounded-[52px] p-3.5 shadow-2xl border-4 border-zinc-800 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-40 flex items-center justify-around px-4">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-800" />
            <span className="w-1.5 h-1.5 rounded-full bg-blue-950" />
          </div>

          <div className="w-full h-full bg-[#0c0d10] rounded-[38px] overflow-hidden flex flex-col justify-between pt-8 pb-4 px-5 relative">
            <div className="space-y-1 text-left">
              <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono">
                <span>RIVIAN R1S // ACTIVE</span>
                <span className="text-emerald-400 font-bold">● ONLINE</span>
              </div>
              <h3 className="text-[10px] font-bold text-zinc-400 font-mono">Joshua Tree Wilderness Route</h3>
            </div>

            <div className="my-3 bg-zinc-950/80 border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between overflow-hidden relative min-h-[160px]">
              <div className="flex justify-between items-center z-10">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">Engine Bus Current</span>
                <span className="text-[9px] font-mono text-[#ff6b00] font-bold bg-[#ff6b00]/10 px-2 py-0.5 rounded-full">
                  {isCharging ? 'Oscillating' : 'Stalled'}
                </span>
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-80">
                <canvas ref={canvasRef} className="w-full animate-fade-in" />
              </div>

              <div className="flex justify-between items-end z-10 pt-16">
                <div className="text-left">
                  <span className="text-[8px] font-mono text-zinc-600 block">CHARGING RATE</span>
                  <span className="text-sm font-bold text-zinc-200 font-mono">{chargingRate} kW</span>
                </div>
                <div className="text-left">
                  <span className="text-[8px] font-mono text-zinc-600 block">SYSTEM VOLTAGE</span>
                  <span className="text-sm font-bold text-zinc-200 font-mono">{voltage}V</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={toggleChargeState} 
                className="w-full py-3 rounded-2xl text-[10px] font-mono font-bold tracking-widest uppercase transition-all duration-300 border bg-[#ff6b00] text-black border-[#ff6b00] hover:bg-transparent hover:text-[#ff6b00] cursor-pointer"
              >
                {isCharging ? "TRIGGER SIGNAL OVERLOAD" : "RE-BOOT TELEMETRY FEED"}
              </button>
              <p className="text-[8px] text-zinc-600 text-center font-mono uppercase tracking-wider">
                Companion App Emulation
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RivianContent;
