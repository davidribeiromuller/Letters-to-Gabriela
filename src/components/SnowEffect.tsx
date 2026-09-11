import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  opacity: number;
  isSparkle: boolean;
  pulseSpeed: number;
  angle: number;
}

export const SnowEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Create 45 snow particles + 15 magical sparkles
    const count = 55;
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const isSparkle = Math.random() < 0.25;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: isSparkle ? Math.random() * 2.5 + 1.5 : Math.random() * 2.8 + 1.2,
        speedY: isSparkle ? Math.random() * 0.4 + 0.2 : Math.random() * 0.7 + 0.4,
        speedX: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.6 + 0.3,
        isSparkle,
        pulseSpeed: Math.random() * 0.04 + 0.015,
        angle: Math.random() * Math.PI * 2,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += Math.sin(p.angle) * 0.4 + p.speedX;
        p.angle += 0.02;

        if (p.isSparkle) {
          p.opacity = 0.3 + Math.sin(p.angle * 3) * 0.4;
        }

        // Wrap around
        if (p.y > height + 10) {
          p.y = -10;
          p.x = Math.random() * width;
        }
        if (p.x > width + 10) p.x = -10;
        if (p.x < -10) p.x = width + 10;

        ctx.save();
        ctx.beginPath();
        if (p.isSparkle) {
          // Draw 4-point glittering star
          const sz = p.radius * 2;
          ctx.translate(p.x, p.y);
          ctx.fillStyle = `rgba(186, 230, 253, ${Math.max(0.1, p.opacity)})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#38bdf8';

          ctx.beginPath();
          ctx.moveTo(0, -sz);
          ctx.quadraticCurveTo(0, 0, sz, 0);
          ctx.quadraticCurveTo(0, 0, 0, sz);
          ctx.quadraticCurveTo(0, 0, -sz, 0);
          ctx.quadraticCurveTo(0, 0, 0, -sz);
          ctx.fill();
        } else {
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(224, 242, 254, ${p.opacity * 0.7})`;
          ctx.shadowBlur = 4;
          ctx.shadowColor = '#bae6fd';
          ctx.fill();
        }
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
