import {
  ArrowRight,
  CheckCircle2,
  FileText,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import {
  AXIS_MAP,
  AxisId,
  CARDS,
  CARD_BY_ID,
  MANDATORY_GUIDANCE,
} from '../../data/cards';
import { AXIS_STYLES, AxisIcon } from '../AxisMeta';
import { ConfettiBurst } from '../ConfettiBurst';

interface ResultScreenProps {
  cardOrder: number[];
  firstAttemptScore: number;
  firstAttemptAnswers: Record<number, AxisId>;
  currentAnswers: Record<number, AxisId>;
  revisionCompleted: boolean;
  revisionScore: number | null;
  incorrectCount: number;
  onStartRevision: () => void;
  onGoToDocs: () => void;
}

export function ResultScreen({
  cardOrder,
  firstAttemptScore,
  firstAttemptAnswers,
  currentAnswers,
  revisionCompleted,
  revisionScore,
  incorrectCount,
  onStartRevision,
  onGoToDocs,
}: ResultScreenProps) {
  const totalCards = CARDS.length;

  return (
    <div className="space-y-6">
      <ConfettiBurst />
      <section className="bg-white dark:bg-[#262525] border border-zinc-300 dark:border-[#3d3b3b] rounded-xl overflow-hidden">
        <div className="h-1.5 w-full em-brand-gradient-bar" aria-hidden="true" />
        <div className="p-6 sm:p-8 space-y-5">
          <div className="space-y-2 max-w-3xl">
            <p className="font-display text-xs sm:text-sm font-semibold text-[#2076aa] dark:text-[#c8ff00]">
              Correção e aprendizagem
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1e1d1d] dark:text-[#f4f4f4]">
              Você identificou o eixo principal em{' '}
              <span className="font-mono-tabular text-[#2076aa] dark:text-[#31b1ff]">
                {firstAttemptScore} de {totalCards}
              </span>{' '}
              situações na primeira tentativa
            </h1>

            {revisionCompleted && revisionScore !== null && (
              <p className="text-base sm:text-lg font-semibold text-[#1e1d1d] dark:text-[#f4f4f4] pt-1">
                Resultado após revisão:{' '}
                <span className="font-mono-tabular text-[#9a4cbf] dark:text-[#c8ff00]">
                  {revisionScore} de {totalCards}
                </span>
                .
              </p>
            )}

            <p className="text-sm sm:text-base text-zinc-700 dark:text-[#c4c2c2] leading-relaxed pt-1">
              {MANDATORY_GUIDANCE} O gabarito indica o foco principal de cada situação,
              sem excluir conexões com os outros eixos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            {incorrectCount > 0 && (
              <button
                type="button"
                onClick={onStartRevision}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 text-sm sm:text-base font-semibold text-[#1e1d1d] dark:text-[#f4f4f4] bg-[#f4f4f4] dark:bg-[#1e1d1d] border border-zinc-300 dark:border-[#3d3b3b] rounded-lg hover:border-[#1e1d1d] dark:hover:border-[#ffcd40] transition-colors whitespace-nowrap"
              >
                <RotateCcw
                  className="w-4 h-4 text-[#8a5a00] dark:text-[#ffcd40] shrink-0"
                  aria-hidden="true"
                />
                <span>Rever cartões ({incorrectCount})</span>
              </button>
            )}

            <button
              type="button"
              onClick={onGoToDocs}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 text-sm sm:text-base font-bold text-[#1e1d1d] bg-[#c8ff00] border border-[#1e1d1d] dark:border-transparent rounded-lg hover:brightness-95 transition-all whitespace-nowrap"
            >
              <FileText className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Levar resultado ao Docs</span>
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <section
        aria-label="Detalhamento por situação"
        className="bg-white dark:bg-[#262525] border border-zinc-300 dark:border-[#3d3b3b] rounded-xl divide-y divide-zinc-200 dark:divide-[#3d3b3b]"
      >
        {cardOrder.map((cardId, index) => {
          const card = CARD_BY_ID[cardId];
          if (!card) return null;

          const firstChoiceId = firstAttemptAnswers[card.id];
          const currentChoiceId = currentAnswers[card.id];
          const isCurrentlyCorrect = currentChoiceId === card.correctAxis;
          const wasChangedInRevision =
            revisionCompleted && firstChoiceId !== currentChoiceId;

          const firstChoice = firstChoiceId ? AXIS_MAP[firstChoiceId] : null;
          const currentChoice = currentChoiceId ? AXIS_MAP[currentChoiceId] : null;
          const correctAxis = AXIS_MAP[card.correctAxis];
          const correctStyle = AXIS_STYLES[card.correctAxis];

          return (
            <article key={card.id} className="p-5 sm:p-6 space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-medium text-zinc-500 dark:text-[#a8a6a6] font-mono-tabular">
                  {index + 1} de {totalCards} · Cartão #{card.id}
                </span>

                {isCurrentlyCorrect ? (
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1e1d1d] dark:text-[#c8ff00]">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#1e1d1d] dark:bg-transparent">
                      <CheckCircle2
                        className="w-4 h-4 text-[#c8ff00] shrink-0"
                        aria-hidden="true"
                      />
                    </span>
                    <span>Eixo principal identificado</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8a5a00] dark:text-[#ffcd40]">
                    <HelpCircle
                      className="w-4 h-4 text-[#8a5a00] dark:text-[#ffcd40] shrink-0"
                      aria-hidden="true"
                    />
                    <span>Vamos rever esta situação?</span>
                  </span>
                )}
              </div>

              <h2 className="font-display text-base sm:text-lg font-semibold text-[#1e1d1d] dark:text-[#f4f4f4] leading-snug">
                {card.text}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm pt-1">
                <div className="bg-[#f4f4f4] dark:bg-[#1e1d1d] border border-zinc-300 dark:border-[#3d3b3b] rounded-lg p-3 space-y-1">
                  <p className="text-xs font-medium text-zinc-600 dark:text-[#a8a6a6]">
                    {wasChangedInRevision ? 'Sua escolha após revisão' : 'Sua escolha'}
                  </p>
                  <p className="font-semibold text-[#1e1d1d] dark:text-[#f4f4f4]">
                    {currentChoice ? currentChoice.name : 'Sem resposta'}
                  </p>
                  {wasChangedInRevision && firstChoice && (
                    <p className="text-xs text-zinc-600 dark:text-[#a8a6a6]">
                      Primeira tentativa: {firstChoice.name}
                    </p>
                  )}
                </div>

                <div className="bg-[#f4f4f4] dark:bg-[#1e1d1d] border border-zinc-300 dark:border-[#3d3b3b] rounded-lg p-3 space-y-1">
                  <p className="text-xs font-medium text-zinc-600 dark:text-[#a8a6a6]">
                    Eixo principal
                  </p>
                  <p className="font-semibold text-[#1e1d1d] dark:text-[#f4f4f4] inline-flex items-center gap-1.5">
                    <AxisIcon
                      axisId={correctAxis.id}
                      className={`w-4 h-4 ${correctStyle.iconColor}`}
                    />
                    <span>{correctAxis.name}</span>
                  </p>
                </div>
              </div>

              <p className="text-sm text-zinc-800 dark:text-[#d4d2d2] leading-relaxed">
                {card.feedback}
              </p>
            </article>
          );
        })}
      </section>

      <div className="flex flex-wrap items-center justify-end gap-3">
        {incorrectCount > 0 && (
          <button
            type="button"
            onClick={onStartRevision}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 text-sm sm:text-base font-semibold text-[#1e1d1d] dark:text-[#f4f4f4] bg-white dark:bg-[#262525] border border-zinc-300 dark:border-[#3d3b3b] rounded-lg hover:border-[#1e1d1d] dark:hover:border-[#ffcd40] whitespace-nowrap"
          >
            <RotateCcw
              className="w-4 h-4 text-[#8a5a00] dark:text-[#ffcd40] shrink-0"
              aria-hidden="true"
            />
            <span>Rever cartões ({incorrectCount})</span>
          </button>
        )}

        <button
          type="button"
          onClick={onGoToDocs}
          className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 text-sm sm:text-base font-bold text-[#1e1d1d] bg-[#c8ff00] border border-[#1e1d1d] dark:border-transparent rounded-lg hover:brightness-95 whitespace-nowrap"
        >
          <FileText className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Levar resultado ao Docs</span>
          <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
