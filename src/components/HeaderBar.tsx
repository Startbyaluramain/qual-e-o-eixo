import { useEffect, useRef, useState } from 'react';
import {
  Contrast,
  Moon,
  Settings,
  Sun,
  Trash2,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { ScreenId } from '../utils/gameLogic';

export type ThemeMode = 'dark' | 'light';

interface HeaderBarProps {
  currentScreen: ScreenId;
  hasSavedProgress: boolean;
  theme: ThemeMode;
  highContrast: boolean;
  soundEnabled: boolean;
  onChangeTheme: (theme: ThemeMode) => void;
  onToggleHighContrast: () => void;
  onToggleSound: () => void;
  onGoHome: () => void;
  onRequestClear: () => void;
}

const SCREEN_LABELS: Record<ScreenId, string> = {
  welcome: 'Início',
  classify: 'Classificação',
  review: 'Revisão',
  result: 'Resultado',
  revision: 'Nova tentativa',
  docs: 'Levar ao Docs',
};

export function HeaderBar({
  currentScreen,
  hasSavedProgress,
  theme,
  highContrast,
  soundEnabled,
  onChangeTheme,
  onToggleHighContrast,
  onToggleSound,
  onGoHome,
  onRequestClear,
}: HeaderBarProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!settingsOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSettingsOpen(false);
      }
    };

    const handlePointerDown = (event: MouseEvent) => {
      if (
        settingsContainerRef.current &&
        !settingsContainerRef.current.contains(event.target as Node)
      ) {
        setSettingsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handlePointerDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handlePointerDown);
    };
  }, [settingsOpen]);

  return (
    <header className="bg-white dark:bg-[#1e1d1d] border-b border-zinc-300 dark:border-[#3d3b3b] transition-colors relative z-30">
      <div className="h-1 w-full em-brand-gradient-bar" aria-hidden="true" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-5">
        <button
          type="button"
          onClick={onGoHome}
          className="font-display text-lg font-bold tracking-tight text-[#1e1d1d] dark:text-[#f4f4f4] hover:text-[#2076aa] dark:hover:text-[#c8ff00] transition-colors whitespace-nowrap shrink-0 min-h-[44px] inline-flex items-center gap-2.5"
        >
          <svg
            id="Camada_1"
            data-name="Camada 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1080 593"
            className="h-8 w-auto max-w-[140px] object-contain shrink-0"
            role="img"
            aria-label="Logo Alura Start"
          >
            <defs>
              <style>{`
                .cls-start-yellow { fill: #fac900; }
                .cls-start-red { fill: #f6543b; }
                .cls-start-purple { fill: #c75eeb; }
                .cls-start-blue { fill: #4ebfe9; }
                .cls-start-green { fill: #61e061; }
                .cls-start-text { fill: #1c1917; }
              `}</style>
            </defs>
            <g>
              <path className="cls-start-red" d="M300.87,218.37v-10.12c0-21.67-4.56-36.85-13.95-46.39-9.42-9.56-24.68-14.2-46.64-14.2h-28.8c-21.97,0-37.22,4.65-46.63,14.2-9.39,9.53-13.96,24.71-13.96,46.39v18.01c0,21.71,4.59,36.79,14.03,46.09,9.4,9.26,24.63,13.77,46.56,13.77h28.8c15.68,0,20.31,3.01,21.56,4.29,1.28,1.32,4.26,6.13,4.26,22.23v18.01c0,16.21-3.06,21.29-4.37,22.72-1.26,1.36-5.85,4.54-21.44,4.54h-28.8c-15.57,0-20.17-3.17-21.42-4.53-1.32-1.44-4.39-6.53-4.39-22.73v-10.12h-34.78v10.12c0,21.7,4.57,36.87,13.96,46.37,9.4,9.57,24.66,14.22,46.63,14.22h28.8c21.97,0,37.22-4.65,46.64-14.21,9.39-9.52,13.95-24.69,13.95-46.38v-18.01c0-21.71-4.59-36.78-14.02-46.08-9.42-9.28-24.65-13.79-46.57-13.79h-28.8c-15.68,0-20.3-3.01-21.55-4.3-1.28-1.32-4.26-6.12-4.26-22.21v-18.01c0-16.2,3.07-21.3,4.38-22.73,1.26-1.36,5.86-4.53,21.43-4.53h28.8c15.58,0,20.19,3.17,21.43,4.52,1.32,1.44,4.38,6.52,4.38,22.74v10.12h34.78Z" />
              <path className="cls-start-yellow" d="M397.46,357.91c-15.58,0-20.17-3.17-21.43-4.53-1.32-1.43-4.39-6.52-4.39-22.72v-149.65h75.61v-33.33h-75.61v-43.21h-34.79v226.19c0,21.7,4.57,36.88,13.97,46.37,9.41,9.57,24.67,14.22,46.63,14.22h53.39v-33.33h-53.39Z" />
              <path className="cls-start-green" d="M873.35,357.91c-15.58,0-20.17-3.17-21.43-4.53-1.32-1.43-4.39-6.52-4.39-22.72v-149.65h75.61v-33.33h-75.61v-43.21h-34.79v226.19c0,21.7,4.57,36.88,13.97,46.37,9.41,9.57,24.67,14.22,46.63,14.22h53.39v-33.33h-53.39Z" />
              <path className="cls-start-blue" d="M615.52,161.87h0c-9.42-9.56-24.68-14.2-46.65-14.2h-28.8c-21.96,0-37.21,4.65-46.61,14.2-9.4,9.52-13.98,24.69-13.98,46.39v10.11h34.79v-10.11c0-16.22,3.07-21.3,4.38-22.73,1.26-1.36,5.86-4.53,21.42-4.53h28.8c15.59,0,20.19,3.16,21.44,4.52,1.31,1.43,4.37,6.51,4.37,22.73v44.52h-54.61c-21.91,0-37.14,4.51-46.55,13.78-9.45,9.3-14.04,24.38-14.04,46.09v18.01c0,21.69,4.57,36.86,13.97,46.37,9.4,9.57,24.65,14.22,46.62,14.22h28.8c21.98,0,37.24-4.65,46.65-14.21,9.39-9.53,13.95-24.7,13.95-46.38v-122.4c0-21.69-4.56-36.86-13.95-46.39ZM594.68,286.12v44.53c0,16.22-3.06,21.29-4.38,22.73-1.25,1.36-5.84,4.53-21.43,4.53h-28.8c-15.56,0-20.16-3.17-21.42-4.54-1.32-1.43-4.38-6.52-4.38-22.72v-18.01c0-16.1,2.98-20.91,4.26-22.22,1.26-1.29,5.87-4.3,21.54-4.3h54.61Z" />
              <path className="cls-start-purple" d="M727.32,147.66c-21.96,0-37.21,4.65-46.62,14.2-9.41,9.52-13.98,24.7-13.98,46.39v182.99h34.79v-182.99c0-16.2,3.07-21.3,4.4-22.73,1.25-1.36,5.84-4.52,21.42-4.52h53.39v-33.33h-53.39Z" />
            </g>
            <g className="cls-start-text">
              <path d="M519.72,461.23h4.47v20.74c2.49-4.54,6.89-6.67,12.54-6.67,9.24,0,16.42,5.5,16.42,18.18s-7.18,18.18-16.42,18.18c-5.72,0-10.04-2.2-12.61-6.82l-.51,6.23h-3.89v-49.85ZM524.2,497.73c1.25,7.11,5.86,9.97,11.95,9.97,7.04,0,12.31-4.03,12.31-14.22s-5.2-14.22-12.31-14.22c-6.08,0-10.7,2.86-11.95,9.97v8.5Z" />
              <path d="M555.34,475.89h4.84l11.8,29.76,12.9-29.76h4.77l-17.52,40.39c-3.81,8.65-7.84,9.24-13.27,9.24v-4.18c4.03,0,6.82-1.1,8.8-5.72l1.98-4.69-14.29-35.04Z" />
            </g>
            <g id="Alura" className="cls-start-text">
              <path d="M676.37,511.92l-18.6-75.7c-.59-2.3-1.36-3.77-2.34-4.51-.99-.75-2.65-1.11-5.09-1.11s-4.1.36-5.09,1.11c-.98.75-1.75,2.23-2.34,4.51l-18.59,75.7h-11.77l19.25-78.39c1.06-4.04,3.32-7.36,6.72-9.83,3.41-2.47,7.38-3.73,11.82-3.73s8.42,1.26,11.82,3.73c3.4,2.47,5.65,5.78,6.72,9.85l19.25,78.37h-11.77.01Z" />
              <rect x="701.64" y="419.97" width="11.44" height="91.95" />
              <path d="M753.29,511.92c-7.58,0-13.5-2.02-17.58-5.99-4.08-3.97-6.15-9.73-6.15-17.12v-43.43h11.44v42.29c0,3.88.3,6.64.9,8.45.66,1.99,1.94,3.38,3.8,4.13,1.71.7,4.33,1.03,7.98,1.03h27.56v-55.9h11.44v66.54h-39.38Z" />
              <path d="M809.18,511.92v-43.43c0-7.37,2.19-13.12,6.51-17.09,4.35-3.98,10.57-6.01,18.52-6.01h12.9v10.63h-13.81c-3.65,0-6.27.34-7.98,1.03-1.86.76-3.14,2.14-3.8,4.13-.61,1.81-.9,4.58-.9,8.45v42.29h-11.45Z" />
              <path d="M880.26,511.92c-3.01,0-5.81-.74-8.33-2.2-2.53-1.47-4.58-3.46-6.09-5.93-1.51-2.44-2.26-5.18-2.26-8.11,0-3.33.99-6.42,2.95-9.19,1.95-2.78,4.55-4.78,7.72-5.97l40.85-15.26-.09-.8c-.15-1.34-.36-2.41-.65-3.28-.66-1.99-1.94-3.38-3.8-4.14-1.71-.7-4.33-1.03-7.98-1.03h-37.69v-10.63h36.78c7.94,0,14.17,2.02,18.52,6.01,4.33,3.97,6.51,9.72,6.51,17.09v30.24c0,3.65-1.29,6.69-3.93,9.31-2.65,2.61-5.79,3.88-9.61,3.88h-32.9ZM878.45,490.9c-1.47.51-2.38,1.1-2.82,1.84-.41.68-.6,1.74-.6,3.32,0,2.11.35,3.44,1.1,4.17.75.73,2.06,1.07,4.14,1.07h32.88c.38,0,.94-.1,1.47-.62.42-.41.64-.9.64-1.43v-22.14l-36.82,13.8Z" />
            </g>
          </svg>
          <span>Qual é o eixo?</span>
        </button>

        <nav
          aria-label="Etapas da atividade"
          className="hidden lg:flex items-center gap-2.5 text-sm text-zinc-600 dark:text-[#a8a6a6] min-w-0"
        >
          <span className="truncate">
            Aula 1 - Introdução a computação · Ensino Médio
          </span>
          <span aria-hidden="true">/</span>
          <span className="font-display font-semibold text-[#2076aa] dark:text-[#c8ff00] whitespace-nowrap shrink-0">
            {SCREEN_LABELS[currentScreen]}
          </span>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <div ref={settingsContainerRef} className="relative">
            <button
              type="button"
              onClick={() => setSettingsOpen((prev) => !prev)}
              aria-expanded={settingsOpen}
              aria-controls="settings-panel"
              aria-label="Configurações"
              title="Configurações"
              className={`inline-flex items-center justify-center w-11 h-11 rounded-lg border transition-colors shrink-0 ${
                settingsOpen || highContrast
                  ? 'bg-[#2076aa] dark:bg-[#c8ff00] text-white dark:text-[#1e1d1d] border-[#1e1d1d] dark:border-[#c8ff00]'
                  : 'bg-[#f4f4f4] dark:bg-[#262525] text-[#1e1d1d] dark:text-[#f4f4f4] border-zinc-300 dark:border-[#3d3b3b] hover:border-[#2076aa] dark:hover:border-[#c8ff00]'
              }`}
            >
              <Settings className="w-5 h-5 shrink-0" aria-hidden="true" />
            </button>

            {settingsOpen && (
              <div
                id="settings-panel"
                role="dialog"
                aria-label="Configurações"
                className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-[#262525] border-2 border-zinc-300 dark:border-[#3d3b3b] rounded-xl shadow-2xl p-4 space-y-4 z-50"
              >
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-zinc-200 dark:border-[#3d3b3b]">
                  <div className="flex items-center gap-2">
                    <Settings
                      className="w-4 h-4 text-[#2076aa] dark:text-[#c8ff00] shrink-0"
                      aria-hidden="true"
                    />
                    <h2 className="font-display text-sm font-bold text-[#1e1d1d] dark:text-[#f4f4f4]">
                      Configurações
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettingsOpen(false)}
                    aria-label="Fechar configurações"
                    className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg border border-zinc-300 dark:border-[#3d3b3b] text-zinc-700 dark:text-[#c4c2c2] hover:text-[#1e1d1d] dark:hover:text-[#f4f4f4] shrink-0"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-[#f4f4f4] dark:bg-[#1e1d1d] border border-zinc-300 dark:border-[#3d3b3b] space-y-2">
                    <span className="block text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-[#a8a6a6]">
                      Esquema de cores
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => onChangeTheme('light')}
                        aria-pressed={theme === 'light'}
                        className={`inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 py-1.5 rounded-lg border text-sm font-semibold transition-colors ${
                          theme === 'light'
                            ? 'bg-[#1e1d1d] text-[#ffcd40] border-[#1e1d1d]'
                            : 'bg-white dark:bg-[#262525] text-[#1e1d1d] dark:text-[#f4f4f4] border-zinc-300 dark:border-[#3d3b3b]'
                        }`}
                      >
                        <Sun className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span>Claro</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onChangeTheme('dark')}
                        aria-pressed={theme === 'dark'}
                        className={`inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 py-1.5 rounded-lg border text-sm font-semibold transition-colors ${
                          theme === 'dark'
                            ? 'bg-[#c8ff00] text-[#1e1d1d] border-[#1e1d1d]'
                            : 'bg-white dark:bg-[#262525] text-[#1e1d1d] dark:text-[#f4f4f4] border-zinc-300 dark:border-[#3d3b3b]'
                        }`}
                      >
                        <Moon className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span>Escuro</span>
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={soundEnabled}
                    onClick={onToggleSound}
                    className="w-full text-left min-h-[44px] p-3 rounded-lg bg-[#f4f4f4] dark:bg-[#1e1d1d] text-[#1e1d1d] dark:text-[#f4f4f4] border border-zinc-300 dark:border-[#3d3b3b] hover:border-[#2076aa] dark:hover:border-[#c8ff00] transition-colors flex items-center justify-between gap-3"
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      {soundEnabled ? (
                        <Volume2 className="w-4 h-4 shrink-0 text-[#2076aa] dark:text-[#c8ff00]" aria-hidden="true" />
                      ) : (
                        <VolumeX className="w-4 h-4 shrink-0 text-zinc-500 dark:text-[#a8a6a6]" aria-hidden="true" />
                      )}
                      <span className="text-sm font-semibold">Efeitos sonoros</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-mono-tabular font-bold bg-zinc-200 dark:bg-[#262525] text-[#1e1d1d] dark:text-[#f4f4f4] shrink-0">
                      {soundEnabled ? 'ON' : 'OFF'}
                    </span>
                  </button>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={highContrast}
                    onClick={onToggleHighContrast}
                    className={`w-full text-left p-3 rounded-lg border transition-colors flex items-start justify-between gap-3 ${
                      highContrast
                        ? 'bg-[#c8ff00] text-[#1e1d1d] border-[#1e1d1d]'
                        : 'bg-[#f4f4f4] dark:bg-[#1e1d1d] text-[#1e1d1d] dark:text-[#f4f4f4] border-zinc-300 dark:border-[#3d3b3b] hover:border-[#2076aa] dark:hover:border-[#c8ff00]'
                    }`}
                  >
                    <span className="flex items-start gap-2.5 min-w-0">
                      <Contrast
                        className="w-4 h-4 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span className="space-y-0.5">
                        <span className="block text-sm font-bold">
                          Modo Alto Contraste
                        </span>
                        <span
                          className={`block text-xs leading-snug ${
                            highContrast
                              ? 'text-[#1e1d1d]'
                              : 'text-zinc-600 dark:text-[#a8a6a6]'
                          }`}
                        >
                          Cores mais fortes e bordas espessas para auxiliar na leitura.
                        </span>
                      </span>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-mono-tabular font-bold shrink-0 ${
                        highContrast
                          ? 'bg-[#1e1d1d] text-[#c8ff00]'
                          : 'bg-zinc-300 dark:bg-[#3d3b3b] text-[#1e1d1d] dark:text-[#f4f4f4]'
                      }`}
                    >
                      {highContrast ? 'ON' : 'OFF'}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {hasSavedProgress && (
            <button
              type="button"
              onClick={onRequestClear}
              className="inline-flex items-center gap-2 min-h-[44px] px-3 sm:px-3.5 py-2 text-sm font-medium text-[#1e1d1d] dark:text-[#f4f4f4] bg-[#f4f4f4] dark:bg-[#262525] border border-zinc-300 dark:border-[#3d3b3b] rounded-lg hover:border-[#e20000] dark:hover:border-[#f80000] transition-colors whitespace-nowrap shrink-0"
              aria-label="Apagar progresso neste dispositivo"
            >
              <Trash2
                className="w-4 h-4 text-[#e20000] dark:text-[#f80000] shrink-0"
                aria-hidden="true"
              />
              <span className="hidden xl:inline">Apagar progresso neste dispositivo</span>
              <span className="xl:hidden hidden sm:inline">Apagar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
