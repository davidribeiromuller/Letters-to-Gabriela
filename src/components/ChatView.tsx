import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Character, ChatMessage } from '../types';
import { CharacterAvatar } from './CharacterAvatar';
import {
  playMessageSend,
  playMessageReceived,
  toggleSound,
  isSoundEnabled,
} from '../utils/audio';
import {
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  Mail,
  Heart,
  AlertCircle,
  Smile,
  WifiOff,
} from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { PWAInstallButton } from './PWAInstallButton';
import { getOfflineResponse, isDavidQuestion, MANDATORY_DAVID_PHRASE } from '../utils/offlineDialogues';

interface ChatViewProps {
  onBackToLetter: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'init-1',
    role: 'assistant',
    character: 'elsa',
    text: 'Oi! Que alegria ver você. Nós estávamos esperando por você com todo o nosso coração. ✨',
    timestamp: Date.now() - 2000,
  },
  {
    id: 'init-2',
    role: 'assistant',
    character: 'anna',
    text: 'Você está bem? Como foi o seu dia? Pode nos contar tudinho, a gente adora conversar com você!',
    timestamp: Date.now() - 1000,
  },
];

const SUGGESTION_CHIPS = [
  { label: 'Estou um pouco triste...', icon: '💙' },
  { label: 'Quero contar uma coisa!', icon: '✨' },
  { label: 'Hoje estou muito feliz!', icon: '🌟' },
  { label: 'Como é viver em Arendelle?', icon: '🏰' },
  { label: 'Olaf gosta de abraços quentinhos?', icon: '⛄' },
];

export const ChatView: React.FC<ChatViewProps> = ({ onBackToLetter }) => {
  const isOnline = useOnlineStatus();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('arendelle_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      // ignore
    }
    return INITIAL_MESSAGES;
  });
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState<Character | null>(null);
  const [soundActive, setSoundActive] = useState(isSoundEnabled());
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const [burstParticles, setBurstParticles] = useState<
    { id: number; x: number; y: number; size: number; color: string; rotation: number }[]
  >([]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Persist conversation to localStorage for seamless offline usage
  useEffect(() => {
    try {
      localStorage.setItem('arendelle_chat_history', JSON.stringify(messages));
    } catch (e) {
      // ignore
    }
  }, [messages]);

  // Auto-scroll on new messages or typing state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Initial chime when chat loads
  useEffect(() => {
    playMessageReceived();
  }, []);

  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundActive(newState);
  };

  const handleResetChat = () => {
    if (window.confirm('Quer recomeçar a nossa conversa mágica com Elsa e Anna?')) {
      setMessages(INITIAL_MESSAGES);
      try {
        localStorage.removeItem('arendelle_chat_history');
      } catch (e) {
        // ignore
      }
      setErrorNotice(null);
      setLastFailedMessage(null);
      playMessageReceived();
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    setErrorNotice(null);
    setInputValue('');
    playMessageSend();

    // Trigger enchanting send sparkle burst
    const newSparkles = Array.from({ length: 14 }).map((_, idx) => {
      const angle = (idx / 14) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const distance = Math.random() * 60 + 25;
      const colors = ['#bae6fd', '#38bdf8', '#fef08a', '#ffffff', '#7dd3fc'];
      return {
        id: Date.now() + idx,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
      };
    });
    setBurstParticles(newSparkles);
    setTimeout(() => setBurstParticles([]), 700);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: Date.now(),
    };

    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);

    // Initial character typing indicator
    const firstSpeaker: Character = text.toLowerCase().includes('brincar') || text.toLowerCase().includes('feliz') ? 'anna' : 'elsa';
    setIsTyping(firstSpeaker);

    let responsesList: { character: Character; text: string }[] = [];

    // If offline, immediately use the rich in-browser offline dialogues
    if (!navigator.onLine) {
      const offlineReply = getOfflineResponse(text);
      responsesList = [{ character: offlineReply.character, text: offlineReply.text }];
    } else {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            history: updatedHistory.map((m) => ({
              role: m.role,
              character: m.character,
              text: m.text,
            })),
            message: text,
          }),
        });

        if (!response.ok) {
          throw new Error('Falha no servidor');
        }

        const data = await response.json();
        responsesList = data.responses || [];

        if (responsesList.length === 0) {
          throw new Error('Sem resposta do servidor');
        }
      } catch (err) {
        console.warn('Conexão instável ou offline, ativando motor de diálogos local:', err);
        // Seamless fallback to comprehensive offline dialogues
        const offlineReply = getOfflineResponse(text);
        responsesList = [{ character: offlineReply.character, text: offlineReply.text }];
      }
    }

    // Priority rule enforcement for questions about David
    if (isDavidQuestion(text)) {
      const hasMandatory = responsesList.some(
        (item) => item.text && item.text.includes(MANDATORY_DAVID_PHRASE)
      );
      if (!hasMandatory) {
        if (responsesList.length > 0) {
          responsesList[0].text = `${MANDATORY_DAVID_PHRASE}. ${responsesList[0].text}`.trim();
        } else {
          const offlineReply = getOfflineResponse(text);
          responsesList = [{ character: offlineReply.character, text: offlineReply.text }];
        }
      }
    }

    try {
      // Stagger responses sequentially with character typing indicators
      for (let i = 0; i < responsesList.length; i++) {
        const item = responsesList[i];
        setIsTyping(item.character);

        // Natural typing pause (800ms - 1100ms)
        await new Promise((r) => setTimeout(r, 850));

        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}-${i}`,
          role: 'assistant',
          character: item.character,
          text: item.text,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, aiMessage]);
        playMessageReceived();

        // Brief delay before the next sister speaks if multiple
        if (i < responsesList.length - 1) {
          await new Promise((r) => setTimeout(r, 450));
        }
      }
    } catch (err) {
      console.error('Chat display error:', err);
    } finally {
      setIsTyping(null);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="relative flex flex-col h-full max-h-full w-full max-w-3xl mx-auto z-10 select-text overflow-hidden min-h-0">
      {/* Top Royal Navigation & Character Status */}
      <header className="flex-shrink-0 px-3 sm:px-4 py-2.5 sm:py-3 bg-[#0d1e38]/85 backdrop-blur-md border-b border-cyan-500/20 flex items-center justify-between shadow-lg min-w-0">
        {/* Left: Characters Presence */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex -space-x-2 shrink-0">
            <CharacterAvatar character="elsa" size="md" />
            <CharacterAvatar character="anna" size="md" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <h2 className="text-xs sm:text-base font-bold text-white tracking-wide font-serif truncate">
                Elsa & Anna
              </h2>
              <span
                className={`inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${
                  isOnline
                    ? 'text-cyan-300 bg-cyan-950/60 border-cyan-400/30'
                    : 'text-sky-200 bg-sky-950/80 border-sky-400/40'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-sky-300'
                  }`}
                />
                {isOnline ? 'Arendelle' : 'Offline Mágico'}
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-cyan-200/70 hidden sm:block truncate">
              {isOnline
                ? 'Conversando com carinho e acolhimento'
                : 'Diálogos de Arendelle disponíveis sem internet'}
            </p>
          </div>
        </div>

        {/* Right: Actions (PWA Install, Sound toggle, Restart, Back to letter) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <PWAInstallButton />

          <button
            onClick={handleSoundToggle}
            id="toggle-sound-button"
            className="p-1.5 sm:p-2 rounded-full hover:bg-cyan-900/50 text-cyan-200 transition-colors"
            title={soundActive ? 'Desativar sons' : 'Ativar sons'}
          >
            {soundActive ? <Volume2 className="w-4 h-4 text-cyan-300" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          <button
            onClick={handleResetChat}
            id="reset-chat-button"
            className="p-1.5 sm:p-2 rounded-full hover:bg-cyan-900/50 text-cyan-200 transition-colors"
            title="Recomeçar conversa"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onBackToLetter}
            id="back-to-letter-button"
            className="flex items-center gap-1 text-xs px-2.5 sm:px-3 py-1.5 rounded-full bg-cyan-900/40 hover:bg-cyan-800/60 text-cyan-200 border border-cyan-400/30 transition-colors shrink-0"
          >
            <Mail className="w-3.5 h-3.5 text-cyan-300" />
            <span className="hidden sm:inline">Ver Carta</span>
          </button>
        </div>
      </header>

      {/* Offline Status Informative Banner */}
      {!isOnline && (
        <div className="bg-sky-950/90 border-b border-sky-400/30 px-3 py-1.5 text-center text-[11px] sm:text-xs text-sky-200 flex items-center justify-center gap-1.5 backdrop-blur-sm shadow-inner shrink-0">
          <WifiOff className="w-3.5 h-3.5 text-sky-300 shrink-0" />
          <span>Modo Offline Ativo — Elsa e Anna continuam conversando com você pela magia guardada no seu dispositivo! ❄️</span>
        </div>
      )}

      {/* Message Stream Area */}
      <main className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 scroll-smooth">
        {/* Decorative Top Welcoming Banner */}
        <div className="text-center py-1 sm:py-2">
          <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-cyan-200/60 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-500/15 max-w-full">
            <Sparkles className="w-3 h-3 text-cyan-300 shrink-0" />
            <span className="truncate">Você abriu a carta mágica de Arendelle</span>
            <Sparkles className="w-3 h-3 text-cyan-300 shrink-0" />
          </div>
        </div>

        {/* Message Bubbles */}
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isChild = msg.role === 'user';
            const isElsa = msg.character === 'elsa';
            const isAnna = msg.character === 'anna';

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={`flex gap-2 sm:gap-3 ${isChild ? 'justify-end' : 'justify-start'}`}
              >
                {/* Character Avatar for Assistant */}
                {!isChild && msg.character && (
                  <div className="flex-shrink-0 self-end mb-1">
                    <CharacterAvatar character={msg.character} size="sm" />
                  </div>
                )}

                <div className={`max-w-[88%] sm:max-w-[78%] md:max-w-[72%] flex flex-col ${isChild ? 'items-end' : 'items-start'}`}>
                  {/* Speaker Label */}
                  {!isChild && (
                    <div className="flex items-center gap-1.5 mb-1 px-1">
                      <span
                        className={`text-xs font-bold font-serif ${
                          isElsa ? 'text-cyan-300' : 'text-pink-300'
                        }`}
                      >
                        {isElsa ? 'Elsa ✨' : 'Anna 🌻'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {isElsa ? 'Irmã mais velha' : 'Irmã caçula'}
                      </span>
                    </div>
                  )}

                  {/* Speech Bubble */}
                  <div
                    className={`rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base leading-relaxed shadow-md backdrop-blur-sm ${
                      isChild
                        ? 'bg-gradient-to-br from-sky-100 to-cyan-50 text-slate-900 rounded-br-xs font-medium border border-white/80 shadow-sky-900/30'
                        : isElsa
                        ? 'bg-gradient-to-br from-[#0c2e4e]/95 via-[#0e3b64]/95 to-[#0b2b48]/95 text-cyan-50 rounded-bl-xs border border-cyan-400/35 shadow-cyan-950/40'
                        : 'bg-gradient-to-br from-[#4a0e2e]/95 via-[#5c133a]/95 to-[#3b0b24]/95 text-pink-50 rounded-bl-xs border border-pink-400/35 shadow-pink-950/40'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{msg.text}</p>
                  </div>
                </div>

                {/* Child User Avatar Indicator */}
                {isChild && (
                  <div className="flex-shrink-0 self-end mb-1 w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 border border-amber-100 flex items-center justify-center text-amber-900 shadow-sm font-bold text-xs">
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Dynamic Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center gap-2 text-xs py-1"
            >
              <CharacterAvatar character={isTyping} size="sm" />
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm ${
                  isTyping === 'elsa'
                    ? 'bg-cyan-950/80 border-cyan-500/30 text-cyan-200'
                    : 'bg-pink-950/80 border-pink-500/30 text-pink-200'
                }`}
              >
                <span>{isTyping === 'elsa' ? 'Elsa está escrevendo com calma...' : 'Anna está escrevendo animada...'}</span>
                <span className="flex items-center gap-1">
                  <motion.span
                    animate={{ scale: [0.8, 1.4, 0.8] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                    className={`w-1.5 h-1.5 rounded-full ${isTyping === 'elsa' ? 'bg-cyan-400' : 'bg-pink-400'}`}
                  />
                  <motion.span
                    animate={{ scale: [0.8, 1.4, 0.8] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                    className={`w-1.5 h-1.5 rounded-full ${isTyping === 'elsa' ? 'bg-cyan-400' : 'bg-pink-400'}`}
                  />
                  <motion.span
                    animate={{ scale: [0.8, 1.4, 0.8] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                    className={`w-1.5 h-1.5 rounded-full ${isTyping === 'elsa' ? 'bg-cyan-400' : 'bg-pink-400'}`}
                  />
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Friendly Error Banner with Retry */}
        {errorNotice && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-400/40 text-amber-100 flex items-start gap-3 shadow-md"
          >
            <AlertCircle className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-xs sm:text-sm">
              <p>{errorNotice}</p>
              {lastFailedMessage && (
                <button
                  onClick={() => handleSendMessage(lastFailedMessage)}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/40 text-amber-200 border border-amber-300/40 text-xs font-semibold transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Tentar enviar novamente
                </button>
              )}
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Starter Suggestion Chips */}
      <div className="px-3 sm:px-4 py-1.5 sm:py-2 overflow-x-auto no-scrollbar flex items-center gap-1.5 sm:gap-2 flex-shrink-0 bg-[#0d1e38]/60 backdrop-blur-xs border-t border-cyan-500/10 touch-pan-x">
        <span className="text-[10px] sm:text-[11px] text-cyan-300/70 font-medium flex items-center gap-1 flex-shrink-0">
          <Smile className="w-3 h-3 text-cyan-300" />
          Sugestões:
        </span>
        {SUGGESTION_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip.label)}
            disabled={!!isTyping}
            className="flex-shrink-0 text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-cyan-950/50 hover:bg-cyan-800/60 text-cyan-100 border border-cyan-400/20 hover:border-cyan-300/50 transition-all flex items-center gap-1 sm:gap-1.5 disabled:opacity-50 active:scale-95"
          >
            <span>{chip.icon}</span>
            <span className="whitespace-nowrap">{chip.label}</span>
          </button>
        ))}
      </div>

      {/* Free Text Input Form */}
      <footer className="p-2 sm:p-4 bg-[#0a182d]/90 backdrop-blur-md border-t border-cyan-500/20 flex-shrink-0 safe-bottom">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-1.5 sm:gap-2 max-w-3xl mx-auto w-full"
        >
          <div className="relative flex-1 min-w-0">
            <input
              ref={inputRef}
              type="text"
              id="chat-message-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!!isTyping}
              placeholder="Escreva sua mensagem para Elsa e Anna..."
              className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 pr-8 sm:pr-10 rounded-full bg-slate-900/80 border border-cyan-400/30 focus:border-cyan-300 text-white placeholder-cyan-200/50 text-xs sm:text-sm md:text-base outline-none ring-2 ring-transparent focus:ring-cyan-500/30 transition-all shadow-inner disabled:opacity-60"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400/40 pointer-events-none text-xs sm:text-sm">
              ✨
            </div>
          </div>

          <div className="relative shrink-0">
            <button
              type="submit"
              id="send-message-button"
              disabled={!inputValue.trim() || !!isTyping}
              className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold shadow-md shadow-cyan-500/25 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center justify-center border border-cyan-300/40 active:scale-95 relative z-10 shrink-0"
              title="Enviar mensagem"
            >
              <Send className="w-4 h-4 text-white" />
            </button>

            {/* Magical Sparkle Burst on Send */}
            <AnimatePresence>
              {burstParticles.map((sp) => (
                <motion.div
                  key={sp.id}
                  initial={{ opacity: 1, scale: 0, x: 0, y: 0, rotate: 0 }}
                  animate={{
                    opacity: [1, 1, 0],
                    scale: [0, 1.4, 0.2],
                    x: sp.x,
                    y: sp.y,
                    rotate: sp.rotation,
                  }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="absolute left-1/2 top-1/2 pointer-events-none z-20"
                  style={{ marginLeft: -sp.size / 2, marginTop: -sp.size / 2 }}
                >
                  <svg
                    width={sp.size}
                    height={sp.size}
                    viewBox="0 0 24 24"
                    fill="none"
                    className="drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]"
                  >
                    <path
                      d="M12 0 C12 7 17 12 24 12 C17 12 12 17 12 24 C12 17 7 12 0 12 C7 12 12 7 12 0 Z"
                      fill={sp.color}
                    />
                    <circle cx="12" cy="12" r="3" fill="#ffffff" />
                  </svg>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </form>
        <p className="text-center text-[10px] sm:text-xs text-cyan-200/40 mt-1 sm:mt-1.5 font-light truncate px-2">
          Um espaço seguro, carinhoso e mágico direto do reino de Arendelle ❄️
        </p>
      </footer>
    </div>
  );
};
