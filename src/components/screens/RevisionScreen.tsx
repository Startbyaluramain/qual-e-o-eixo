import { useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2 } from 'lucide-react';
import { AXES, AxisId, CARD_BY_ID } from '../../data/cards';
import { AxisLegend } from '../AxisLegend';
import { AXIS_STYLES, AxisIcon } from '../AxisMeta';

interface RevisionScreenProps {
  revisionCardIds: number[];
  revisionIndex: number;
  currentAnswers: Record<number, AxisId>;
  onSelectAxis: (cardId: number, axisId: AxisId) => void;
  onPrev: () => void;
  onNext: () => void;
  onFinishRevision: () => void;
  onCancelToResult: () => void;
}

export function RevisionScreen({
  revisionCardIds,
  revisionIndex,
  currentAnswers,
  onSelectAxis,
  onPrev,
  onNext,
  onFinishRevision,
  onCancelToResult,
}: RevisionScreenProps) {
  const cardId = revisionCardIds[revisionIndex];
  const card = CARD_BY_ID[cardId];
  const selectedAxis = currentAnswers[cardId];
  const totalToRevise = revisionCardIds.length;
  const isFirst = revisionIndex === 0;
  const isLast = revisionIndex === totalToRevise - 1;
  const progressPercent = Math.round(((revisionIndex + 1) / totalToRevise) * 100);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (event.key === '1') {
        onSelectAxis(cardId, AXES[0].id);
      } else if (event.key === '2') {
        onSelectAxis(cardId, AXES[1].id);
      } else if (event.key === '3') {
        onSelectAxis(cardId, AXES[2].id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cardId, onSelectAxis]);

  if (!card) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <section
        aria-labelledby="revision-card-heading"
        className="lg:col-span-7 bg-white dark:bg-[#262525] border border-zinc-300 dark:border-[#3d3b3b] rounded-xl overflow-hidden"
      >
        <div className="h-1 w-full em-brand-gradient-bar" aria-hidden="true" />
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="font-display font-semibold text-[#2076aa] dark:text-[#c8ff00] font-mono-tabular">
                Revisão · Cartão {revisionIndex + 1} de {totalToRevise}
              </span>
              <button
                type="button"
                onClick={onCancelToResult}
                className="text-sm font-medium text-zinc-700 dark:text-[#c4c2c2] hover:text-[#1e1d1d] dark:hover:text-[#f4f4f4] underline underline-offset-4 whitespace-nowrap"
              >
                Voltar ao resultado
              </button>
            </div>

            <div
              className="w-full h-2.5 bg-[#1e1d1d] border border-[#1e1d1d] dark:border-[#3d3b3b] rounded-full overflow-hidden p-0.5"
              role="progressbar"
              aria-valuenow={revisionIndex + 1}
              aria-valuemin={1}
              aria-valuemax={totalToRevise}
              aria-label={`Progresso da revisão: ${revisionIndex + 1} de ${totalToRevise}`}
            >
              <div
                className="h-full bg-[#c8ff00] rounded-full transition-all duration-150"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="py-2">
            <h1
              id="revision-card-heading"
              className="font-display text-xl sm:text-2xl font-semibold text-[#1e1d1d] dark:text-[#f4f4f4] leading-snug"
            >
              {card.text}
            </h1>
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-zinc-700 dark:text-[#c4c2c2] mb-1">
              Escolha novamente o eixo principal desta situação:
            </legend>

            <div className="space-y-3">
              {AXES.map((axis) => {
                const isSelected = selectedAxis === axis.id;
                const style = AXIS_STYLES[axis.id];

                return (
                  <button
                    key={axis.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => onSelectAxis(card.id, axis.id)}
                    className={`w-full text-left min-h-[56px] px-4 py-3.5 rounded-xl border transition-colors flex items-center justify-between gap-3 ${
                      isSelected
                        ? `${style.selectedBg} ${style.selectedBorder} ${style.selectedText}`
                        : 'bg-[#f4f4f4] dark:bg-[#1e1d1d] border-zinc-300 dark:border-[#3d3b3b] text-[#1e1d1d] dark:text-[#f4f4f4] hover:border-[#1e1d1d] dark:hover:border-[#6e6c6c]'
                    }`}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <AxisIcon
                        axisId={axis.id}
                        className={`w-5 h-5 shrink-0 ${
                          isSelected ? 'text-[#1e1d1d]' : style.iconColor
                        }`}
                      />
                      <span className="font-semibold text-base">
                        {axis.name}
                      </span>
                    </span>

                    <span className="flex items-center gap-2 shrink-0">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 text-sm font-bold text-[#1e1d1d]">
                          <Check className="w-4 h-4" aria-hidden="true" />
                          <span>Selecionado</span>
                        </span>
                      ) : (
                        <span className="hidden sm:inline font-mono-tabular text-xs text-zinc-500 dark:text-[#9c9a9a]">
                          Tecla {axis.shortcut}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="pt-4 border-t border-zinc-200 dark:border-[#3d3b3b] flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={onPrev}
              disabled={isFirst}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 text-sm font-medium text-[#1e1d1d] dark:text-[#f4f4f4] bg-[#f4f4f4] dark:bg-[#1e1d1d] border border-zinc-300 dark:border-[#3d3b3b] rounded-lg hover:border-[#1e1d1d] dark:hover:border-[#f4f4f4] disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Voltar</span>
            </button>

            {isLast ? (
              <button
                type="button"
                onClick={onFinishRevision}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2 text-sm font-bold text-[#1e1d1d] bg-[#c8ff00] border border-[#1e1d1d] dark:border-transparent rounded-lg hover:brightness-95 transition-all whitespace-nowrap"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Conferir revisão</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onNext}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2 text-sm font-bold text-[#1e1d1d] bg-[#c8ff00] border border-[#1e1d1d] dark:border-transparent rounded-lg hover:brightness-95 transition-all whitespace-nowrap"
              >
                <span>Avançar</span>
                <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="lg:col-span-5">
        <AxisLegend variant="sidebar" />
      </div>
    </div>
  );
}
