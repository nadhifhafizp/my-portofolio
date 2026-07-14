"use client";

import { useEffect, useRef } from "react";

interface BackgroundPixelStarsProps {
  density?: number; // bintang per pixel²
}

export function BackgroundPixelStars({ density = 0.00015 }: BackgroundPixelStarsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let stars: { x: number; y: number; size: number; baseAlpha: number; speed: number; phase: number }[] = [];

    const generateStars = () => {
      const count = Math.floor(canvas.width * canvas.height * density);
      stars = Array.from({ length: count }, () => ({
        x: Math.floor(Math.random() * canvas.width),
        y: Math.floor(Math.random() * canvas.height),
        size: Math.random() < 0.85 ? 1 : 2,
        baseAlpha: Math.random() * 0.5 + 0.3,
        speed: Math.random() * 0.02 + 0.006,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent ? parent.clientWidth : window.innerWidth;
      canvas.height = parent ? parent.clientHeight : window.innerHeight;
      generateStars();
    };

    let time = 0;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const star of stars) {
        const twinkle = Math.sin(time * star.speed + star.phase) * 0.5 + 0.5;
        const alpha = star.baseAlpha * (0.35 + twinkle * 0.65);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fillRect(star.x, star.y, star.size, star.size); // kotak, bukan bulat = "pixel"
      }
    };

    window.addEventListener("resize", resize);
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [density]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}