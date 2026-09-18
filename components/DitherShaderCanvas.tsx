"use client";

import { useEffect, useRef } from "react";

export function DitherShaderCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      time += 0.012;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      // Density across canvas width
      const density = 71;
      const cellSize = width / density;
      const rows = Math.ceil(height / cellSize);

      ctx.fillStyle = "#003df5"; // Brand Blue

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < density; c++) {
          const cx = (c + 0.5) * cellSize;
          const cy = (r + 0.5) * cellSize;

          const nx = c / density;
          const ny = r / rows;

          // Distance to mouse for interactive ripple
          const dx = cx - mouseX;
          const dy = cy - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const mouseEffect = Math.max(0, 1 - dist / 220);

          // Ambient wave pattern matching WGSL dither shader
          const wave =
            Math.sin(nx * 6 + time) * 0.3 +
            Math.cos(ny * 6 - time * 0.7) * 0.3 +
            Math.sin((nx + ny) * 10 + time * 1.1) * 0.2 +
            0.5;

          const factor = Math.min(1, Math.max(0.08, wave + mouseEffect * 0.6));
          const dotSize = factor * cellSize * 0.8;

          if (dotSize > 0.4) {
            const x = cx - dotSize / 2;
            const y = cy - dotSize / 2;
            ctx.fillRect(x, y, dotSize, dotSize);
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[450px] overflow-hidden bg-[#ffffff]">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
