import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';

interface LoadingScreenProps {
  onLoaded: () => void;
  minDurationMs?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onLoaded,
  minDurationMs = 2800,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / minDurationMs) * 100));
      setProgress(pct);

      if (elapsed >= minDurationMs) {
        clearInterval(interval);
        onLoaded();
      }
    }, 40);

    return () => clearInterval(interval);
  }, [minDurationMs, onLoaded]);

  return (
    <motion.div
      id="loading-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(10px)' }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
      onClick={onLoaded}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#070e1a] via-[#091527] to-[#050a14] cursor-pointer select-none overflow-hidden"
    >
      {/* Background Soft Glow Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.25, 0.45, 0.25],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-cyan-400/20 blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-72 h-72 rounded-full bg-pink-400/15 blur-[90px] pointer-events-none"
      />

      {/* Main Center Message Box */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-sm sm:max-w-md mx-auto">
        {/* Glowing Heart Icon with Orbiting Sparkles */}
        <div className="relative mb-6 flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.12, 1],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-cyan-500/30 via-pink-500/20 to-sky-400/30 border border-cyan-300/40 backdrop-blur-md flex items-center justify-center shadow-[0_0_25px_rgba(56,189,248,0.35)]"
          >
            <Heart className="w-8 h-8 sm:w-9 sm:h-9 text-pink-300 fill-pink-300/60 drop-shadow-[0_0_10px_rgba(244,114,182,0.6)]" />
          </motion.div>

          {/* Floating decorative sparkles */}
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-[-10px] pointer-events-none"
          >
            <Sparkles className="absolute top-0 right-1 w-4 h-4 text-cyan-200 animate-pulse" />
            <Sparkles className="absolute bottom-1 left-0 w-3.5 h-3.5 text-pink-200 animate-pulse" />
          </motion.div>
        </div>

        {/* The Requested Message: "Com amor, David" */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-2"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif italic font-medium tracking-wide bg-gradient-to-r from-cyan-100 via-pink-100 to-sky-200 bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(165,243,252,0.4)]">
            Com amor, David
          </h1>
          <p className="text-xs sm:text-sm text-cyan-200/70 font-sans tracking-wider uppercase flex items-center justify-center gap-1.5 pt-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            Preparando a magia de Arendelle...
          </p>
        </motion.div>

        {/* Delicate Progress Shimmer Line */}
        <div className="w-48 sm:w-56 h-1 bg-cyan-950/60 rounded-full mt-8 overflow-hidden border border-cyan-500/20 p-[1px]">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 via-pink-400 to-sky-300 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>

        {/* Subtle touch hint */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[11px] text-slate-400 mt-4 tracking-wide font-sans"
        >
          Toque para entrar
        </motion.span>
      </div>
    </motion.div>
  );
};
