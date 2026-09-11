import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playMagicalChime } from '../utils/audio';
import { Sparkles, Mail, Heart, ArrowRight } from 'lucide-react';
import { CharacterAvatar } from './CharacterAvatar';
import { PWAInstallButton } from './PWAInstallButton';

interface MagicLetterProps {
  onOpenComplete: () => void;
}

export const MagicLetter: React.FC<MagicLetterProps> = ({ onOpenComplete }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    playMagicalChime();

    // Sequence timing
    setTimeout(() => {
      setShowContent(true);
    }, 700);

    // Slower transition by 4 seconds (from 3.2s to 7.2s) so the child has plenty of time to read
    timerRef.current = setTimeout(() => {
      onOpenComplete();
    }, 7200);
  };

  const handleProceedImmediately = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    onOpenComplete();
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center p-4 z-10 select-none">
      {/* Top action bar for installation */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
        <PWAInstallButton />
      </div>

      {/* Background magical glow halo */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none -z-10 animate-pulse" />

      {/* Header Invitation Text */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center mb-4 sm:mb-6 max-w-md px-2 sm:px-4 w-full"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-400/30 text-cyan-200 text-[11px] sm:text-xs font-semibold tracking-wider uppercase mb-2.5 sm:mb-3 shadow-sm backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" style={{ animationDuration: '6s' }} />
          Reino de Arendelle
          <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-wide drop-shadow-md font-serif break-words">
          Você recebeu uma carta muito especial...
        </h1>
        <p className="text-cyan-100/80 text-xs sm:text-sm md:text-base mt-2 break-words">
          Elsa e Anna enviaram esta mensagem mágica com muito carinho para você.
        </p>
      </motion.div>

      {/* Envelope Container */}
      <div className="relative w-full max-w-sm sm:max-w-md h-72 sm:h-80 flex items-center justify-center">
        {/* Sparkle burst particles on open */}
        {isOpening && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {[...Array(16)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  scale: [0.5, 1.4, 0],
                  x: Math.cos((i * Math.PI) / 8) * (100 + Math.random() * 80),
                  y: Math.sin((i * Math.PI) / 8) * (100 + Math.random() * 80),
                }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="absolute w-3 h-3 rounded-full bg-cyan-200 shadow-[0_0_12px_#38bdf8]"
              />
            ))}
          </div>
        )}

        {/* Envelope Interactive Box */}
        <motion.div
          id="magic-letter-card"
          onClick={handleOpen}
          whileHover={!isOpening ? { scale: 1.03, y: -4 } : {}}
          whileTap={!isOpening ? { scale: 0.98 } : {}}
          className={`relative w-[calc(100vw-2.5rem)] max-w-[20rem] sm:max-w-sm md:max-w-[24rem] h-48 sm:h-56 cursor-pointer rounded-2xl shadow-2xl transition-shadow ${
            isOpening
              ? 'shadow-[0_0_50px_rgba(56,189,248,0.6)]'
              : 'shadow-[0_10px_35px_rgba(0,0,0,0.6)] hover:shadow-[0_0_35px_rgba(56,189,248,0.4)]'
          }`}
          style={{ perspective: 1000 }}
        >
          {/* Envelope Body */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1e3a8a] via-[#172554] to-[#0f172a] border-2 border-cyan-400/40 shadow-inner">
            {/* Ice Frost Details */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />

            {/* Nordic Gold & Ice patterns on corners */}
            <div className="absolute top-2 left-2 text-cyan-300/40 text-[10px] sm:text-xs font-serif select-none">❄ Arendelle ❄</div>
            <div className="absolute top-2 right-2 text-cyan-300/40 text-[10px] sm:text-xs font-serif select-none">❄ ❄ ❄</div>

            {/* Fold lines of the envelope */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
              <line x1="0" y1="100%" x2="50%" y2="55%" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1.5" />
              <line x1="100%" x2="50%" y1="100%" y2="55%" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1.5" />
            </svg>

            {/* Envelope Flap Animation */}
            <motion.div
              animate={isOpening ? { rotateX: 180, zIndex: 0 } : { rotateX: 0, zIndex: 20 }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              style={{ transformOrigin: 'top center' }}
              className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-[#2563eb] to-[#1e40af] border-b border-cyan-300/50 shadow-md overflow-hidden"
            >
              {/* Flap triangular tip - fluid SVG that adapts to any screen width */}
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <polygon points="0,0 100,0 50,100" fill="rgba(6, 182, 212, 0.2)" />
                </svg>
              </div>
            </motion.div>

            {/* Royal Wax Seal with Elsa Snowflake & Anna Crocus */}
            <AnimatePresence>
              {!isOpening && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.4, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
                >
                  <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-700 p-0.5 shadow-[0_0_20px_rgba(56,189,248,0.7)] flex items-center justify-center border-2 border-white/60">
                    {/* Inner gold seal stamp */}
                    <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-500 via-amber-300 to-yellow-100 flex flex-col items-center justify-center shadow-inner text-amber-950">
                      <span className="text-xl sm:text-2xl animate-pulse">❄️</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pulsing prompt to touch/click */}
            {!isOpening && (
              <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 text-cyan-200 text-xs sm:text-sm font-medium animate-bounce pointer-events-none">
                <Mail className="w-4 h-4 text-cyan-300" />
                <span>Toque na carta para abrir</span>
              </div>
            )}
          </div>

          {/* Parchment Letter Rising Out of Envelope */}
          <motion.div
            initial={{ y: 0, opacity: 0, scale: 0.95 }}
            animate={
              showContent
                ? { y: -70, opacity: 1, scale: 1.02 }
                : isOpening
                ? { y: -30, opacity: 0.8 }
                : { y: 0, opacity: 0 }
            }
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className={`absolute inset-x-1.5 sm:inset-x-2 top-1.5 sm:top-2 rounded-xl bg-gradient-to-b from-[#fefce8] via-[#fffbeb] to-[#fef3c7] text-slate-800 p-3 sm:p-5 shadow-2xl border-2 border-amber-300/80 z-40 ${
              !isOpening ? 'pointer-events-none' : ''
            }`}
          >
            {/* Parchment header with Elsa & Anna badges */}
            <div className="flex items-center justify-between border-b border-amber-400/40 pb-2 mb-2 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <CharacterAvatar character="elsa" size="sm" />
                <CharacterAvatar character="anna" size="sm" />
                <span className="text-[11px] xs:text-xs sm:text-sm font-serif font-bold text-amber-900 tracking-wider truncate">
                  Elsa & Anna de Arendelle
                </span>
              </div>
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse shrink-0 ml-1" />
            </div>

            {/* Letter Body Text */}
            <div className="space-y-1 sm:space-y-1.5 text-left text-[11px] xs:text-xs sm:text-sm text-amber-950 font-serif leading-relaxed break-words">
              <p className="font-semibold text-sky-950">Querida criança,</p>
              <p>
                Enviamos esta carta mágica com todo o nosso amor e carinho. Estamos ansiosas para conversar com você, ouvir suas histórias e segurar a sua mão!
              </p>
            </div>

            {/* Letter Footer */}
            <div className="mt-2.5 sm:mt-3 flex items-center justify-between text-[10px] sm:text-xs text-amber-800/80 font-serif italic pt-1 border-t border-amber-300/50 flex-wrap gap-1">
              <span>❄ Castelo de Arendelle</span>
              <span className="font-semibold text-cyan-800 flex items-center gap-1 shrink-0">
                {showContent ? 'Lendo a carta com calma...' : 'Abrindo a magia...'}
                <Sparkles className="w-3 h-3 text-cyan-600 animate-spin" />
              </span>
            </div>

            {/* Quick proceed action if child finishes reading faster */}
            {showContent && (
              <div className="mt-2 pt-1 flex justify-end">
                <button
                  type="button"
                  onClick={handleProceedImmediately}
                  className="px-3 py-1 rounded-full bg-amber-200/80 hover:bg-amber-300 text-amber-950 font-bold text-[11px] sm:text-xs border border-amber-400/60 flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                >
                  <span>Já terminei de ler ➔</span>
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Button fallback or immediate proceed if child wants to jump straight in */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        onClick={isOpening ? () => handleProceedImmediately() : handleOpen}
        id="open-letter-button"
        className="mt-6 sm:mt-8 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-cyan-500 via-sky-600 to-blue-700 hover:from-cyan-400 hover:to-blue-600 text-white font-bold text-xs sm:text-sm md:text-base shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 border border-cyan-200/40 cursor-pointer max-w-full text-center"
      >
        <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse shrink-0" />
        <span className="truncate">{isOpening ? 'Conversar com Elsa & Anna ✨' : 'Abrir a Carta Mágica ✨'}</span>
        {isOpening && <ArrowRight className="w-4 h-4 ml-0.5 shrink-0" />}
      </motion.button>
    </div>
  );
};
