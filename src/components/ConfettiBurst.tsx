import { useEffect, useRef } from 'react';

const CONFETTI_COLORS = [
  '#c8ff00', // Neon EM
  '#31b1ff', // Azul EM
  '#ce66ff', // Roxo EM
  '#ffcd40', // Amarelo EM
  '#ff61fe', // Rosa EM
  '#f80000', // Vermelho EM
  '#f4f4f4', // Off-White EM
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  opacity: number;
}

export function ConfettiBurst() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const particleCount = Math.min(90, Math.max(48, Math.floor(width / 14)));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i += 1) {
      const fromLeft = i % 2 === 0;
      const originX = fromLeft ? width * 0.25 : width * 0.75;
      const angleSpread = (Math.random() - 0.5) * 1.4;
      const speed = 5 + Math.random() * 8;

      particles.push({
        x: originX + (Math.random() - 0.5) * 120,
        y: Math.min(height * 0.22, 180) + (Math.random() - 0.5) * 40,
        vx: Math.sin(angleSpread) * speed + (fromLeft ? 1.2 : -1.2),
        vy: -Math.abs(Math.cos(angleSpread) * speed) * 0.85 - 1.5,
        width: 7 + Math.random() * 6,
        height: 4 + Math.random() * 5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.22,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        opacity: 1,
      });
    }

    let animationId = 0;
    const startTime = performance.now();
    const maxDurationMs = 2800;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);

      let aliveCount = 0;
      const fadeProgress =
        elapsed > 1900 ? Math.min(1, (elapsed - 1900) / 900) : 0;

      for (const p of particles) {
        p.vy += 0.24; // gravity
        p.vx *= 0.992; // air drag
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.opacity = Math.max(0, 1 - fadeProgress);

        if (p.y < height + 30 && p.opacity > 0.01) {
          aliveCount += 1;
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
          ctx.restore();
        }
      }

      if (aliveCount > 0 && elapsed < maxDurationMs) {
        animationId = window.requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    animationId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-40 pointer-events-none"
    />
  );
}
