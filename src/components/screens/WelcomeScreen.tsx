import { ArrowRight, Play, ShieldAlert } from 'lucide-react';
import { AxisLegend } from '../AxisLegend';

interface WelcomeScreenProps {
  hasSavedProgress: boolean;
  savedAnsweredCount: number;
  onStartNew: () => void;
  onContinue: () => void;
}

export function WelcomeScreen({
  hasSavedProgress,
  savedAnsweredCount,
  onStartNew,
  onContinue,
}: WelcomeScreenProps) {
  return (
    <div className="space-y-10">
      <section className="relative bg-white dark:bg-[#262525] border border-zinc-300 dark:border-[#3d3b3b] rounded-xl overflow-hidden">
        <div className="h-1.5 w-full em-brand-gradient-bar" aria-hidden="true" />
        <div className="p-6 sm:p-8 lg:p-10 space-y-6">
          <div className="space-y-4 max-w-3xl">
            <p className="font-display text-xs sm:text-sm font-semibold text-[#2076aa] dark:text-[#c8ff00]">
              12 situações · Individual ou em duplas
            </p>

            <div className="inline-block relative border border-[#2076aa] dark:border-[#31b1ff] px-4 py-2.5">
              <span
                className="absolute -top-1 -left-1 w-2 h-2 bg-[#2076aa] dark:bg-[#31b1ff]"
                aria-hidden="true"
              />
              <span
                className="absolute -top-1 -right-1 w-2 h-2 bg-[#2076aa] dark:bg-[#31b1ff]"
                aria-hidden="true"
              />
              <span
                className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#2076aa] dark:bg-[#31b1ff]"
                aria-hidden="true"
              />
              <span
                className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#2076aa] dark:bg-[#31b1ff]"
                aria-hidden="true"
              />
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#1e1d1d] dark:text-[#f4f4f4]">
                Qual é o eixo?
              </h1>
            </div>

            <p className="text-base sm:text-lg text-zinc-800 dark:text-[#e4e4e4] leading-relaxed">
              Computação não é só programar! Classifique 12 situações entre os
              três eixos e descubra como eles aparecem no dia a dia.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            {hasSavedProgress && (
              <button
                type="button"
                onClick={onContinue}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 text-base font-bold text-[#1e1d1d] bg-[#c8ff00] border border-[#1e1d1d] dark:border-transparent rounded-lg hover:brightness-95 transition-all whitespace-nowrap"
              >
                <Play className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Continuar atividade</span>
                {savedAnsweredCount > 0 && (
                  <span className="font-mono-tabular text-sm font-semibold text-[#1e1d1d]">
                    ({savedAnsweredCount}/12)
                  </span>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={onStartNew}
              className={`inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 text-base font-bold rounded-lg transition-all whitespace-nowrap ${
                hasSavedProgress
                  ? 'text-[#1e1d1d] dark:text-[#f4f4f4] bg-[#f4f4f4] dark:bg-[#1e1d1d] border border-zinc-300 dark:border-[#3d3b3b] hover:border-[#1e1d1d] dark:hover:border-[#c8ff00]'
                  : 'text-[#1e1d1d] bg-[#c8ff00] border border-[#1e1d1d] dark:border-transparent hover:brightness-95'
              }`}
            >
              <span>Começar</span>
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </button>
          </div>

          <p className="text-sm text-zinc-600 dark:text-[#c4c2c2] flex items-start gap-2 pt-3 border-t border-zinc-200 dark:border-[#3d3b3b]">
            <ShieldAlert
              className="w-4 h-4 text-[#8a5a00] dark:text-[#ffcd40] shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <span>
              O progresso fica salvo apenas neste navegador. Em um computador
              compartilhado, apague-o ao terminar.
            </span>
          </p>
        </div>
      </section>

      <AxisLegend variant="full" />
    </div>
  );
}
