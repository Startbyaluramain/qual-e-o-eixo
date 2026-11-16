import { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  HelpCircle,
  X,
} from 'lucide-react';
import { AXES, AxisId, CARDS, CARD_BY_ID } from '../../data/cards';
import { playNavigateSound } from '../../utils/soundFx';
import { AxisLegend } from '../AxisLegend';
import { AXIS_STYLES, AxisIcon } from '../AxisMeta';

interface ClassifyScreenProps {
  cardOrder: number[];
  currentCardIndex: number;
  currentAnswers: Record<number, AxisId>;
  pendingNotice: string | null;
  returnedFromReview: boolean;
  soundEnabled?: boolean;
  onSelectAxis: (cardId: number, axisId: AxisId) => void;
  onPrev: () => void;
  onNext: () => void;
  onGoToReview: () => void;
}

export function ClassifyScreen({
  cardOrder,
  currentCardIndex,
  currentAnswers,
  pendingNotice,
  returnedFromReview,
  soundEnabled = true,
  onSelectAxis,
  onPrev,
  onNext,
  onGoToReview,
}: ClassifyScreenProps) {
  const [hintOpen, setHintOpen] = useState(false);
  const cardId = cardOrder[currentCardIndex];
  const card = CARD_BY_ID[cardId];
  const selectedAxis = currentAnswers[cardId];
  const totalCards = CARDS.length;
  const answeredCount = Object.keys(currentAnswers).length;
  const answeredPercent = Math.round((answeredCount / totalCards) * 100);
  const isFirst = currentCardIndex === 0;
  const isLast = currentCardIndex === totalCards - 1;

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
    <div className="space-y-6">
      {/* Barra de progresso visual na parte superior indicando quantos dos 12 cartões foram respondidos */}
      <section
        aria-label="Progresso das respostas"
        className="bg-white dark:bg-[#262525] border border-zinc-300 dark:border-[#3d3b3b] rounded-xl p-4 sm:px-6 space-y-2.5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="font-display font-semibold text-[#1e1d1d] dark:text-[#f4f4f4]">
            Progresso da classificação
          </span>
          <span className="font-mono-tabular font-semibold text-[#1e1d1d] dark:text-[#c8ff00]">
            {answeredCount} de {totalCards} respondidos ({answeredPercent}%)
          </span>
        </div>

        <div
          className="w-full h-3.5 bg-[#1e1d1d] border border-[#1e1d1d] dark:border-[#3d3b3b] rounded-full overflow-hidden p-0.5"
          role="progressbar"
          aria-valuenow={answeredCount}
          aria-valuemin={0}
          aria-valuemax={totalCards}
          aria-label={`Progresso: ${answeredCount} de ${totalCards} cartões respondidos`}
        >
          <div
            className="h-full bg-[#c8ff00] rounded-full transition-all duration-200"
            style={{ width: `${answeredPercent}%` }}
          />
        </div>
      </section>

      {pendingNotice && (
        <div
          role="alert"
          className="bg-white dark:bg-[#262525] border border-[#8a5a00] dark:border-[#ffcd40] text-[#1e1d1d] dark:text-[#f4f4f4] rounded-xl px-4 py-3 text-sm flex items-start gap-2.5"
        >
          <AlertCircle
            className="w-5 h-5 text-[#8a5a00] dark:text-[#ffcd40] shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <span>{pendingNotice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section
          aria-labelledby="classify-card-heading"
          className="lg:col-span-7 bg-white dark:bg-[#262525] border border-zinc-300 dark:border-[#3d3b3b] rounded-xl overflow-hidden"
        >
          <div className="h-1 w-full em-brand-gradient-bar" aria-hidden="true" />
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="font-display font-semibold text-[#2076aa] dark:text-[#c8ff00] font-mono-tabular">
                Cartão {currentCardIndex + 1} de {totalCards}
              </span>
              <span className="font-mono-tabular text-zinc-600 dark:text-[#c4c2c2]">
                {selectedAxis ? 'Eixo selecionado' : 'Aguardando escolha'}
              </span>
            </div>

            <div className="py-2">
              <h1
                id="classify-card-heading"
                className="font-display text-xl sm:text-2xl font-semibold text-[#1e1d1d] dark:text-[#f4f4f4] leading-snug"
              >
                {card.text}
              </h1>
            </div>

            <fieldset className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <legend className="text-sm font-medium text-zinc-700 dark:text-[#c4c2c2]">
                  Qual eixo aparece com mais destaque nesta situação?
                </legend>
                <button
                  type="button"
                  onClick={() => {
                    setHintOpen((prev) => !prev);
                    playNavigateSound(soundEnabled);
                  }}
                  aria-expanded={hintOpen}
                  aria-controls="dica-do-eixo-panel"
                  aria-label="Dica do Eixo: exibir definição breve dos três eixos"
                  className={`inline-flex items-center gap-1.5 min-h-[44px] px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                    hintOpen
                      ? 'bg-[#2076aa] dark:bg-[#c8ff00] text-white dark:text-[#1e1d1d] border-[#1e1d1d] dark:border-[#c8ff00]'
                      : 'bg-[#f4f4f4] dark:bg-[#1e1d1d] text-[#2076aa] dark:text-[#c8ff00] border-zinc-300 dark:border-[#3d3b3b] hover:border-[#2076aa] dark:hover:border-[#c8ff00]'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Dica do Eixo</span>
                </button>
              </div>

              {hintOpen && (
                <div
                  id="dica-do-eixo-panel"
                  role="region"
                  aria-label="Dica do Eixo: breve definição dos três eixos"
                  className="bg-[#f4f4f4] dark:bg-[#1e1d1d] border-2 border-[#2076aa] dark:border-[#c8ff00] rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <HelpCircle
                        className="w-4 h-4 text-[#2076aa] dark:text-[#c8ff00] shrink-0"
                        aria-hidden="true"
                      />
                      <h2 className="font-display text-sm font-bold text-[#1e1d1d] dark:text-[#f4f4f4]">
                        Dica do Eixo
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setHintOpen(false);
                        playNavigateSound(soundEnabled);
                      }}
                      aria-label="Fechar Dica do Eixo"
                      className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg border border-zinc-300 dark:border-[#3d3b3b] bg-white dark:bg-[#262525] text-zinc-700 dark:text-[#c4c2c2] hover:text-[#1e1d1d] dark:hover:text-[#f4f4f4] hover:border-[#1e1d1d] dark:hover:border-[#f4f4f4] transition-colors shrink-0"
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>

                  <dl className="space-y-2.5 text-sm">
                    {AXES.map((axis) => {
                      const style = AXIS_STYLES[axis.id];
                      return (
                        <div
                          key={axis.id}
                          className="bg-white dark:bg-[#262525] border border-zinc-300 dark:border-[#3d3b3b] rounded-lg p-3 space-y-1"
                        >
                          <dt className="flex items-center gap-2 font-display font-bold text-[#1e1d1d] dark:text-[#f4f4f4]">
                            <AxisIcon
                              axisId={axis.id}
                              className={`w-4 h-4 shrink-0 ${style.iconColor}`}
                            />
                            <span>{axis.name}</span>
                          </dt>
                          <dd className="text-zinc-700 dark:text-[#d4d2d2] leading-relaxed">
                            {axis.shortDefinition}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                </div>
              )}

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
                      className={`relative w-full text-left min-h-[56px] px-4 py-3.5 rounded-xl border transition-colors flex items-center justify-between gap-3 ${
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

              <div className="flex flex-wrap items-center gap-3">
                {returnedFromReview && !isLast && (
                  <button
                    type="button"
                    onClick={onGoToReview}
                    className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-sm font-medium text-[#1e1d1d] dark:text-[#f4f4f4] bg-[#f4f4f4] dark:bg-[#1e1d1d] border border-zinc-300 dark:border-[#3d3b3b] rounded-lg hover:border-[#1e1d1d] dark:hover:border-[#f4f4f4] whitespace-nowrap"
                  >
                    Ir para revisão
                  </button>
                )}

                {!returnedFromReview && !isLast && (
                  <button
                    type="button"
                    onClick={onGoToReview}
                    className="inline-flex items-center justify-center min-h-[44px] px-3 py-2 text-sm font-medium text-zinc-700 dark:text-[#c4c2c2] hover:text-[#2076aa] dark:hover:text-[#c8ff00] underline underline-offset-4 whitespace-nowrap"
                  >
                    Revisar escolhas
                  </button>
                )}

                {isLast ? (
                  <button
                    type="button"
                    onClick={onGoToReview}
                    className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2 text-sm font-bold text-[#1e1d1d] bg-[#c8ff00] border border-[#1e1d1d] dark:border-transparent rounded-lg hover:brightness-95 transition-all whitespace-nowrap"
                  >
                    <span>Ir para revisão</span>
                    <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onNext}
                    className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2 text-sm font-bold text-[#1e1d1d] bg-[#c8ff00] border border-[#1e1d1d] dark:border-transparent rounded-lg hover:brightness-95 transition-all whitespace-nowrap"
                  >
                    <span>{selectedAxis ? 'Avançar' : 'Avançar sem responder'}</span>
                    <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="lg:col-span-5">
          <AxisLegend variant="sidebar" />
        </div>
      </div>
    </div>
  );
}
