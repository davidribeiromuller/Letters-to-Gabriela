import React, { useEffect, useRef } from 'react';

interface Sparkle {
  x: number;
  y: number;
  size: number;
  color: string;
  glowColor: string;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  rotation: number;
  rotationSpeed: number;
  isStar: boolean;
}

const PALETTE = [
  { fill: 'rgba(224, 242, 254, ', glow: '#38bdf8' }, // sky-100 / cyan-400
  { fill: 'rgba(186, 230, 253, ', glow: '#0ea5e9' }, // sky-200 / sky-500
  { fill: 'rgba(254, 249, 195, ', glow: '#facc15' }, // starlight yellow
  { fill: 'rgba(255, 255, 255, ', glow: '#7dd3fc' }, // pure white ice
];

export const SparkleTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const sparkles: Sparkle[] = [];
    let lastTime = 0;
    let lastPos = { x: -100, y: -100 };

    const addSparkle = (x: number, y: number, count = 1) => {
      for (let i = 0; i < count; i++) {
        const theme = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        const isStar = Math.random() < 0.7;
        const size = isStar ? Math.random() * 4 + 3 : Math.random() * 2.5 + 1.5;
        const maxLife = Math.random() * 25 + 20; // 20-45 frames
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.2 + 0.3;

        sparkles.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y + (Math.random() - 0.5) * 12,
          size,
          color: theme.fill,
          glowColor: theme.glow,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.4, // float slightly upward
          life: 0,
          maxLife,
          rotation: Math.random() * Math.PI,
          rotationSpeed: (Math.random() - 0.5) * 0.15,
          isStar,
        });
      }

      if (sparkles.length > 90) {
        sparkles.splice(0, sparkles.length - 90);
      }
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const now = performance.now();
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        return;
      }

      const dist = Math.hypot(clientX - lastPos.x, clientY - lastPos.y);

      // Only add sparkles if cursor moved enough or sufficient time passed
      if (dist > 8 && now - lastTime > 25) {
        lastTime = now;
        lastPos = { x: clientX, y: clientY };
        addSparkle(clientX, clientY, Math.random() < 0.5 ? 2 : 1);
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    let animId: number;

    const drawStar = (
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      r: number,
      rot: number,
      alpha: number,
      color: string,
      glow: string
    ) => {
      context.save();
      context.translate(cx, cy);
      context.rotate(rot);
      context.beginPath();
      context.fillStyle = `${color}${alpha})`;
      context.shadowBlur = 10;
      context.shadowColor = glow;

      // 4-pointed Frozen diamond star
      context.moveTo(0, -r);
      context.quadraticCurveTo(0, 0, r, 0);
      context.quadraticCurveTo(0, 0, 0, r);
      context.quadraticCurveTo(0, 0, -r, 0);
      context.quadraticCurveTo(0, 0, 0, -r);
      context.fill();

      // Subtle center highlight
      context.beginPath();
      context.arc(0, 0, r * 0.35, 0, Math.PI * 2);
      context.fillStyle = `rgba(255, 255, 255, ${Math.min(1, alpha * 1.5)})`;
      context.fill();

      context.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = sparkles.length - 1; i >= 0; i--) {
        const sp = sparkles[i];
        sp.life += 1;
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.rotation += sp.rotationSpeed;

        const progress = sp.life / sp.maxLife;
        if (progress >= 1) {
          sparkles.splice(i, 1);
          continue;
        }

        // Bell curve alpha: rises quickly, fades out softly
        const alpha = Math.sin(progress * Math.PI) * 0.85;
        const currentSize = sp.size * (1 - progress * 0.3);

        if (sp.isStar) {
          drawStar(ctx, sp.x, sp.y, currentSize, sp.rotation, alpha, sp.color, sp.glowColor);
        } else {
          ctx.save();
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, currentSize, 0, Math.PI * 2);
          ctx.fillStyle = `${sp.color}${alpha})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = sp.glowColor;
          ctx.fill();
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      aria-hidden="true"
    />
  );
};
