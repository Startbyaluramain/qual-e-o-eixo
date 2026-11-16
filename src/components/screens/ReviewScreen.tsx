import { AlertCircle, ArrowLeft, CheckCircle2, Edit3 } from 'lucide-react';
import { AXIS_MAP, AxisId, CARDS, CARD_BY_ID } from '../../data/cards';
import { AXIS_STYLES, AxisIcon } from '../AxisMeta';

interface ReviewScreenProps {
  cardOrder: number[];
  currentAnswers: Record<number, AxisId>;
  onEditCard: (cardIndex: number) => void;
  onBackToCards: () => void;
  onSubmitReview: () => void;
}

export function ReviewScreen({
  cardOrder,
  currentAnswers,
  onEditCard,
  onBackToCards,
  onSubmitReview,
}: ReviewScreenProps) {
  const totalCards = CARDS.length;
  const answeredCount = cardOrder.filter((id) => Boolean(currentAnswers[id])).length;
  const missingCount = totalCards - answeredCount;

  return (
    <div className="space-y-6">
      <section className="bg-white dark:bg-[#262525] border border-zinc-300 dark:border-[#3d3b3b] rounded-xl overflow-hidden">
        <div className="h-1 w-full em-brand-gradient-bar" aria-hidden="true" />
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1e1d1d] dark:text-[#f4f4f4]">
                Revisão das escolhas
              </h1>
              <p className="text-sm sm:text-base text-zinc-700 dark:text-[#c4c2c2]">
                Confira suas classificações antes da correção. Você pode alterar qualquer cartão.
              </p>
            </div>
            <p className="text-sm font-semibold text-[#2076aa] dark:text-[#c8ff00] font-mono-tabular shrink-0">
              {answeredCount} de {totalCards} respondidos
            </p>
          </div>

          {missingCount > 0 && (
            <div
              role="status"
              className="bg-[#f4f4f4] dark:bg-[#1e1d1d] border border-[#8a5a00] dark:border-[#ffcd40] text-[#1e1d1d] dark:text-[#f4f4f4] rounded-lg px-4 py-3 text-sm flex items-start gap-2.5"
            >
              <AlertCircle
                className="w-5 h-5 text-[#8a5a00] dark:text-[#ffcd40] shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <span>
                {missingCount === 1
                  ? 'Falta classificar 1 cartão. Clique em "Conferir respostas" para ir direto a ele ou escolha "Alterar".'
                  : `Faltam classificar ${missingCount} cartões. Clique em "Conferir respostas" para ir ao primeiro pendente ou escolha "Alterar".`}
              </span>
            </div>
          )}
        </div>
      </section>

      <section
        aria-label="Lista de cartões para revisão"
        className="bg-white dark:bg-[#262525] border border-zinc-300 dark:border-[#3d3b3b] rounded-xl divide-y divide-zinc-200 dark:divide-[#3d3b3b]"
      >
        {cardOrder.map((cardId, index) => {
          const card = CARD_BY_ID[cardId];
          const chosenAxisId = currentAnswers[cardId];
          const chosenAxis = chosenAxisId ? AXIS_MAP[chosenAxisId] : null;
          const style = chosenAxisId ? AXIS_STYLES[chosenAxisId] : null;

          if (!card) return null;

          return (
            <div
              key={card.id}
              className="p-5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2 min-w-0">
                <p className="text-xs font-medium text-zinc-500 dark:text-[#a8a6a6] font-mono-tabular">
                  {index + 1} de {totalCards}
                </p>
                <p className="text-base font-medium text-[#1e1d1d] dark:text-[#f4f4f4] leading-snug">
                  {card.text}
                </p>
                <div className="pt-0.5">
                  {chosenAxis && style ? (
                    <span
                      className={`inline-flex items-center gap-2 text-sm font-semibold ${style.subtleText}`}
                    >
                      <AxisIcon axisId={chosenAxis.id} className={`w-4 h-4 ${style.iconColor}`} />
                      <span>{chosenAxis.name}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8a5a00] dark:text-[#ffcd40]">
                      <AlertCircle
                        className="w-4 h-4 text-[#8a5a00] dark:text-[#ffcd40] shrink-0"
                        aria-hidden="true"
                      />
                      <span>Sem resposta</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="shrink-0">
                <button
                  type="button"
                  onClick={() => onEditCard(index)}
                  className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2 text-sm font-medium text-[#1e1d1d] dark:text-[#f4f4f4] bg-[#f4f4f4] dark:bg-[#1e1d1d] border border-zinc-300 dark:border-[#3d3b3b] rounded-lg hover:border-[#1e1d1d] dark:hover:border-[#c8ff00] whitespace-nowrap"
                >
                  <Edit3 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Alterar</span>
                </button>
              </div>
            </div>
          );
        })}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBackToCards}
          className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 text-sm font-medium text-[#1e1d1d] dark:text-[#f4f4f4] bg-white dark:bg-[#262525] border border-zinc-300 dark:border-[#3d3b3b] rounded-lg hover:border-[#1e1d1d] dark:hover:border-[#f4f4f4] whitespace-nowrap"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Voltar aos cartões</span>
        </button>

        <button
          type="button"
          onClick={onSubmitReview}
          className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 text-base font-bold text-[#1e1d1d] bg-[#c8ff00] border border-[#1e1d1d] dark:border-transparent rounded-lg hover:brightness-95 transition-all whitespace-nowrap"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Conferir respostas</span>
        </button>
      </div>
    </div>
  );
}
