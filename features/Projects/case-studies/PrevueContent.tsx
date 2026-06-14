import React, { useState, useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

const PrevueContent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawingColor, setDrawingColor] = useState('#00d1ff');
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokePoints, setStrokePoints] = useState<Point[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleResize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
      }
      canvas.height = 280;
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e && e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    
    const mouseEvent = e as React.MouseEvent<HTMLCanvasElement>;
    return {
      x: mouseEvent.clientX - rect.left,
      y: mouseEvent.clientY - rect.top
    };
  };

  const handleStartDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const coords = getCoordinates(e);
    setStrokePoints([coords]);
  };

  const handleDrawMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const coords = getCoordinates(e);
    
    const newPoints = [...strokePoints, coords];
    setStrokePoints(newPoints);

    ctx.strokeStyle = drawingColor;
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(newPoints[0].x, newPoints[0].y);

    for (let i = 1; i < newPoints.length - 1; i++) {
      const xc = (newPoints[i].x + newPoints[i + 1].x) / 2;
      const yc = (newPoints[i].y + newPoints[i + 1].y) / 2;
      ctx.quadraticCurveTo(newPoints[i].x, newPoints[i].y, xc, yc);
    }
    ctx.stroke();
  };

  const handleEndDraw = () => {
    setIsDrawing(false);
    setStrokePoints([]);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <>
      {/* Category Monospace Subtitle */}
      <div className="mono-specs">
        01 // THE COLLABORATIVE LATENCY WALL
      </div>

      {/* Serif Main Title */}
      <h2 className="font-serif">Eliminating Drawing Jaggedness Under Heavy Packet Overhead</h2>

      {/* Lead Paragraph with dropcap hook */}
      <p className="lead">
        When developers attempt to build vector collaboration engines using raw HTML elements or JSON coordinate points, <strong>coordinate synchronization quickly becomes sluggish</strong>. Canvas pipelines bottleneck when rendering more than 1,000 vector stroke steps per frame.
      </p>

      {/* Vector latency callout hook */}
      <blockquote className="border-l-2 border-red-500 bg-red-950/10 p-5 my-6 max-w-[42rem] mx-auto text-left">
        <span className="text-[9px] font-mono text-red-500 uppercase tracking-wider block font-bold mb-1">// REAL-TIME VECTOR PIPELINES</span>
        <p className="text-zinc-300 text-xs leading-relaxed m-0 italic font-mono">
          "JSON serialized coordinates caused massive serialization overhead, lagging mouse-drawing paths under heavy network congestion. We implemented WebGL canvas drawing buffers for instant local rendering."
        </p>
      </blockquote>

      {/* Paragraph 2 with bold specifications */}
      <p>
        By designing **bezier path interpolation models and low-latency WebSocket channels**, we achieved coordinate broadcast times below **15ms**, ensuring smooth, synchronized cursor paths.
      </p>

      {/* Sandbox Visualizer Wrapper */}
      <div className="sandbox-container">
        <div className="bg-[#0b0b0e] border border-zinc-800/60 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
            <span className="font-bold uppercase">// SANDBOX VECTOR DRAWING VIEW</span>
            <button onClick={clearCanvas} className="text-rose-500 hover:text-rose-455 uppercase tracking-widest font-bold cursor-pointer">Clear Canvas</button>
          </div>

          <div className="w-full relative bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden h-[280px]">
            <canvas 
              ref={canvasRef} 
              onMouseDown={handleStartDraw}
              onMouseMove={handleDrawMove}
              onMouseUp={handleEndDraw}
              onMouseLeave={handleEndDraw}
              onTouchStart={handleStartDraw}
              onTouchMove={handleDrawMove}
              onTouchEnd={handleEndDraw}
              className="w-full h-full cursor-crosshair block touch-none"
            />
            <div className="absolute bottom-4 left-4 pointer-events-none bg-zinc-900/90 border border-zinc-800 px-3.5 py-1.5 rounded-full text-[9px] font-mono uppercase tracking-wider text-zinc-400">
              Drag or Touch anywhere to draw smooth vectors
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-zinc-900 pt-3">
            <span className="text-[10px] font-mono text-zinc-500">Dynamic Bezier Path Smoothing Engine</span>
            <div className="flex gap-2">
              {['#00d1ff', '#10b981', '#a855f7'].map((col) => (
                <button 
                  key={col} 
                  onClick={() => setDrawingColor(col)}
                  className={`w-5 h-5 rounded-full border-2 transition-transform cursor-pointer ${drawingColor === col ? 'scale-125 border-white' : 'border-transparent'}`}
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrevueContent;
