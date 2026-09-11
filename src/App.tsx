import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppStage } from './types';
import { SnowEffect } from './components/SnowEffect';
import { SparkleTrail } from './components/SparkleTrail';
import { LoadingScreen } from './components/LoadingScreen';
import { MagicLetter } from './components/MagicLetter';
import { ChatView } from './components/ChatView';

export default function App() {
  const [stage, setStage] = useState<AppStage>('loading');

  return (
    <div className="min-h-[100dvh] h-[100dvh] w-full bg-gradient-to-b from-[#091424] via-[#0b1a30] to-[#060e1a] text-slate-100 flex flex-col relative overflow-hidden font-sans">
      {/* Falling Snowflakes & Star Sparkles */}
      <SnowEffect />

      {/* Magical cursor sparkle trail */}
      <SparkleTrail />

      {/* Decorative Frost Shimmer Background Gradients */}
      <div className="fixed top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-sky-500/10 blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-pink-500/10 blur-[120px] pointer-events-none -z-10" />

      {/* Main Flow Container */}
      <div className="relative z-10 flex-1 flex flex-col w-full h-full min-h-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {stage === 'loading' && (
            <LoadingScreen
              key="loading"
              onLoaded={() => setStage('letter_closed')}
            />
          )}

          {stage === 'letter_closed' && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="flex-1 flex items-center justify-center w-full overflow-y-auto overflow-x-hidden p-2 sm:p-4 min-h-0"
            >
              <MagicLetter onOpenComplete={() => setStage('chat')} />
            </motion.div>
          )}

          {stage === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex-1 flex flex-col w-full h-full min-h-0 overflow-hidden"
            >
              <ChatView onBackToLetter={() => setStage('letter_closed')} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
