"use client";

import { useEffect, useRef } from "react";

interface AetherFlowBackgroundProps {
  isDark?: boolean;
  className?: string;
}

class Particle {
  x: number; y: number; dx: number; dy: number; size: number;
  constructor(x: number, y: number, dx: number, dy: number, size: number) {
    this.x = x; this.y = y; this.dx = dx; this.dy = dy; this.size = size;
  }
}

export default function AetherFlowBackground({ isDark = true, className = "" }: AetherFlowBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDarkRef = useRef(isDark);
  isDarkRef.current = isDark;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouse = { x: null as number | null, y: null as number | null, radius: 140 };

    const drawParticle = (p: Particle) => {
      const [r, g, b] = isDarkRef.current ? [255, 255, 255] : [0, 0, 0];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},0.5)`;
      ctx.fill();
    };

    const updateParticle = (p: Particle) => {
      if (p.x > canvas.width || p.x < 0) p.dx = -p.dx;
      if (p.y > canvas.height || p.y < 0) p.dy = -p.dy;

      if (mouse.x !== null && mouse.y !== null) {
        const distX = mouse.x - p.x;
        const distY = mouse.y - p.y;
        const dist = Math.sqrt(distX * distX + distY * distY);
        if (dist < mouse.radius + p.size) {
          const forceX = distX / dist;
          const forceY = distY / dist;
          const force = (mouse.radius - dist) / mouse.radius;
          p.x -= forceX * force * 4;
          p.y -= forceY * force * 4;
        }
      }

      p.x += p.dx;
      p.y += p.dy;
      drawParticle(p);
    };

    const init = () => {
      particles = [];
      const count = (canvas.height * canvas.width) / 13000;
      for (let i = 0; i < count; i++) {
        const size = Math.random() * 1.6 + 0.8;
        const x = Math.random() * (canvas.width - size * 2) + size;
        const y = Math.random() * (canvas.height - size * 2) + size;
        const dx = Math.random() * 0.3 - 0.15;
        const dy = Math.random() * 0.3 - 0.15;
        particles.push(new Particle(x, y, dx, dy, size));
      }
    };

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent ? parent.clientWidth : window.innerWidth;
      canvas.height = parent ? parent.clientHeight : window.innerHeight;
      init();
    };

    const connect = () => {
      const [r, g, b] = isDarkRef.current ? [255, 255, 255] : [0, 0, 0];
      const maxDist = (canvas.width / 7) * (canvas.height / 7);

      for (let a = 0; a < particles.length; a++) {
        for (let bIdx = a; bIdx < particles.length; bIdx++) {
          const dist =
            (particles[a].x - particles[bIdx].x) ** 2 +
            (particles[a].y - particles[bIdx].y) ** 2;

          if (dist < maxDist) {
            let opacity = (1 - dist / maxDist) * 0.35;

            if (mouse.x !== null && mouse.y !== null) {
              const dxm = particles[a].x - mouse.x;
              const dym = particles[a].y - mouse.y;
              if (Math.sqrt(dxm * dxm + dym * dym) < mouse.radius) {
                opacity = Math.min(opacity * 2.2, 0.9);
              }
            }

            ctx.strokeStyle = `rgba(${r},${g},${b},${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[bIdx].x, particles[bIdx].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(updateParticle);
      connect();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseLeave);

    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full z-0 pointer-events-none ${className}`}
    />
  );
}