import React from 'react';
import { Character } from '../types';

interface CharacterAvatarProps {
  character: Character;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  character,
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
  };

  const isElsa = character === 'elsa';

  return (
    <div
      className={`relative rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden border-2 shadow-md transition-transform duration-300 hover:scale-105 ${
        sizeMap[size]
      } ${
        isElsa
          ? 'border-cyan-300/80 bg-gradient-to-b from-sky-900 to-cyan-950 shadow-cyan-500/20'
          : 'border-pink-300/80 bg-gradient-to-b from-rose-900 to-purple-950 shadow-pink-500/20'
      } ${className}`}
      title={isElsa ? 'Elsa de Arendelle' : 'Anna de Arendelle'}
    >
      {isElsa ? (
        // Custom Elsa Vector Avatar: Platinum hair, Ice Tiara, Crystalline Gown, Calm Loving Eyes
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <defs>
            <linearGradient id="elsaBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#082f49" />
            </linearGradient>
            <linearGradient id="elsaHair" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#bae6fd" />
            </linearGradient>
            <linearGradient id="elsaGown" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>

          {/* Background */}
          <circle cx="50" cy="50" r="50" fill="url(#elsaBg)" />

          {/* Ice cape / sparkles */}
          <circle cx="20" cy="30" r="1.5" fill="#bae6fd" opacity="0.8" />
          <circle cx="80" cy="35" r="2" fill="#ffffff" opacity="0.9" />
          <circle cx="75" cy="18" r="1" fill="#e0f2fe" opacity="0.7" />

          {/* Gown & Shoulders */}
          <path
            d="M20 90 C 25 75, 40 70, 50 70 C 60 70, 75 75, 80 90 Z"
            fill="url(#elsaGown)"
          />
          {/* Crystalline collar trim */}
          <path
            d="M36 72 Q 50 78 64 72"
            stroke="#e0f2fe"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Neck */}
          <rect x="44" y="58" width="12" height="15" rx="3" fill="#fed7aa" />

          {/* Face */}
          <path
            d="M32 40 C 32 26, 68 26, 68 40 C 68 56, 58 64, 50 64 C 42 64, 32 56, 32 40 Z"
            fill="#ffedd5"
          />

          {/* Soft Blushing Cheeks */}
          <circle cx="39" cy="48" r="3.5" fill="#fda4af" opacity="0.5" />
          <circle cx="61" cy="48" r="3.5" fill="#fda4af" opacity="0.5" />

          {/* Calm, warm blue eyes */}
          <ellipse cx="41" cy="43" rx="2.8" ry="3.2" fill="#0284c7" />
          <ellipse cx="59" cy="43" rx="2.8" ry="3.2" fill="#0284c7" />
          <circle cx="42" cy="42" r="1" fill="#ffffff" />
          <circle cx="60" cy="42" r="1" fill="#ffffff" />
          {/* Eyelashes & Brows */}
          <path d="M37 40 Q 41 38 45 40" stroke="#0369a1" strokeWidth="1.2" fill="none" />
          <path d="M55 40 Q 59 38 63 40" stroke="#0369a1" strokeWidth="1.2" fill="none" />
          <path d="M38 36 Q 42 34 45 36" stroke="#94a3b8" strokeWidth="1.4" fill="none" />
          <path d="M55 36 Q 58 34 62 36" stroke="#94a3b8" strokeWidth="1.4" fill="none" />

          {/* Gentle, serene smile */}
          <path
            d="M45 54 Q 50 58 55 54"
            stroke="#e11d48"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />

          {/* Elsa's Swept Platinum Hair & French Braid */}
          <path
            d="M28 36 C 28 16, 72 16, 72 36 C 72 38, 68 30, 50 28 C 32 30, 28 38, 28 36 Z"
            fill="url(#elsaHair)"
          />
          {/* Swept hair bangs */}
          <path
            d="M30 32 C 40 22, 54 26, 68 34 C 58 32, 44 26, 30 32 Z"
            fill="#ffffff"
          />
          {/* Braid over left shoulder */}
          <path
            d="M32 50 C 26 56, 24 68, 27 82 C 30 84, 34 76, 36 68 C 38 62, 36 54, 32 50 Z"
            fill="url(#elsaHair)"
            stroke="#bae6fd"
            strokeWidth="0.8"
          />

          {/* Crystal Tiara */}
          <path
            d="M43 25 L 47 18 L 50 24 L 53 18 L 57 25 Z"
            fill="#e0f2fe"
            stroke="#7dd3fc"
            strokeWidth="1"
          />
          <circle cx="50" cy="22" r="1.5" fill="#38bdf8" />
        </svg>
      ) : (
        // Custom Anna Vector Avatar: Auburn Hair, Twin Braids with Ribbon, Warm Smile, Rosemaling Collar
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <defs>
            <linearGradient id="annaBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9d174d" />
              <stop offset="100%" stopColor="#4a044e" />
            </linearGradient>
            <linearGradient id="annaHair" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="50%" stopColor="#92400e" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <linearGradient id="annaCape" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#db2777" />
              <stop offset="100%" stopColor="#be185d" />
            </linearGradient>
          </defs>

          {/* Background */}
          <circle cx="50" cy="50" r="50" fill="url(#annaBg)" />

          {/* Sparkles / Nordic stars */}
          <circle cx="22" cy="25" r="1.5" fill="#fbcfe8" opacity="0.8" />
          <circle cx="78" cy="28" r="2" fill="#fef08a" opacity="0.9" />

          {/* Cape & Shoulders */}
          <path
            d="M20 90 C 25 74, 40 70, 50 70 C 60 70, 75 74, 80 90 Z"
            fill="url(#annaCape)"
          />
          {/* Nordic Rosemaling collar */}
          <path
            d="M38 72 Q 50 76 62 72"
            stroke="#fef08a"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="50" cy="74" r="2" fill="#047857" />

          {/* Neck */}
          <rect x="44" y="58" width="12" height="15" rx="3" fill="#fed7aa" />

          {/* Face */}
          <path
            d="M32 40 C 32 26, 68 26, 68 40 C 68 56, 58 64, 50 64 C 42 64, 32 56, 32 40 Z"
            fill="#ffedd5"
          />

          {/* Cheerful Freckles & Rosy Cheeks */}
          <circle cx="38" cy="49" r="4" fill="#fb7185" opacity="0.55" />
          <circle cx="62" cy="49" r="4" fill="#fb7185" opacity="0.55" />
          <circle cx="43" cy="50" r="0.8" fill="#d97706" />
          <circle cx="45" cy="52" r="0.8" fill="#d97706" />
          <circle cx="55" cy="52" r="0.8" fill="#d97706" />
          <circle cx="57" cy="50" r="0.8" fill="#d97706" />

          {/* Big, sparkling turquoise-blue eyes */}
          <ellipse cx="41" cy="43" rx="3.2" ry="3.6" fill="#0284c7" />
          <ellipse cx="59" cy="43" rx="3.2" ry="3.6" fill="#0284c7" />
          <circle cx="42.5" cy="41.5" r="1.3" fill="#ffffff" />
          <circle cx="60.5" cy="41.5" r="1.3" fill="#ffffff" />
          {/* Excited eyebrows */}
          <path d="M37 36 Q 41 33 45 35" stroke="#78350f" strokeWidth="1.6" fill="none" />
          <path d="M55 35 Q 59 33 63 36" stroke="#78350f" strokeWidth="1.6" fill="none" />

          {/* Big happy smile! */}
          <path
            d="M44 54 Q 50 61 56 54"
            stroke="#e11d48"
            strokeWidth="2"
            strokeLinecap="round"
            fill="#ffffff"
          />

          {/* Anna's Auburn Hair with Bangs and signature white streak */}
          <path
            d="M26 36 C 26 15, 74 15, 74 36 C 74 38, 66 30, 50 30 C 34 30, 26 38, 26 36 Z"
            fill="url(#annaHair)"
          />
          {/* Hair Bangs */}
          <path
            d="M33 32 Q 42 36 50 31 Q 58 36 67 32 Q 50 24 33 32 Z"
            fill="#d97706"
          />
          {/* Signature platinum lock on Anna's right side */}
          <path
            d="M62 31 C 65 35, 66 42, 65 48"
            stroke="#fef08a"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Twin Braids */}
          {/* Left Braid */}
          <path
            d="M28 46 C 24 54, 22 66, 26 80"
            stroke="#92400e"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="26" cy="76" r="3" fill="#ec4899" />
          {/* Right Braid */}
          <path
            d="M72 46 C 76 54, 78 66, 74 80"
            stroke="#92400e"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="74" cy="76" r="3" fill="#ec4899" />
        </svg>
      )}

      {/* Little glow dot */}
      <span
        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-slate-900 ${
          isElsa ? 'bg-cyan-400 shadow-[0_0_8px_#38bdf8]' : 'bg-pink-400 shadow-[0_0_8px_#f472b6]'
        }`}
      />
    </div>
  );
};
