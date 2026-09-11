import React, { useState } from 'react';
import { Download, Sparkles, X, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed or neither installable nor iOS, render nothing
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        id="pwa-install-button"
        className="flex items-center gap-1.5 text-xs px-2.5 sm:px-3 py-1.5 rounded-full bg-gradient-to-r from-sky-600/80 to-blue-700/80 hover:from-sky-500 hover:to-blue-600 text-cyan-100 border border-cyan-400/40 shadow-sm transition-all active:scale-95 shrink-0"
        title="Instalar aplicativo para usar offline"
      >
        <Download className="w-3.5 h-3.5 text-cyan-300 animate-bounce" />
        <span className="hidden xs:inline">Instalar App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          id="pwa-install-ios-button"
          className="flex items-center gap-1.5 text-xs px-2.5 sm:px-3 py-1.5 rounded-full bg-cyan-900/50 hover:bg-cyan-800/70 text-cyan-200 border border-cyan-400/30 transition-all shrink-0"
          title="Instalar no iPhone / iPad"
        >
          <Smartphone className="w-3.5 h-3.5 text-cyan-300" />
          <span className="hidden xs:inline">Instalar</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-[#0d1e38] border border-cyan-400/40 p-5 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <h3 className="text-sm font-serif font-bold text-white">Instalar no iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs sm:text-sm text-cyan-100/90 leading-relaxed font-sans">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-900/80 border border-cyan-400/40 flex items-center justify-center font-bold text-xs shrink-0 text-cyan-200">
                    1
                  </span>
                  <p>
                    Toque no botão de <strong>Compartilhar</strong> (ícone de quadrado com seta para cima) na barra do Safari.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-900/80 border border-cyan-400/40 flex items-center justify-center font-bold text-xs shrink-0 text-cyan-200">
                    2
                  </span>
                  <p>
                    Role as opções para baixo e selecione <strong>Adicionar à Tela de Início</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-900/80 border border-cyan-400/40 flex items-center justify-center font-bold text-xs shrink-0 text-cyan-200">
                    3
                  </span>
                  <p>
                    Pronto! O aplicativo de Elsa e Anna estará disponível mesmo offline!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md hover:from-cyan-400 hover:to-blue-500 transition"
              >
                Entendi ✨
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
