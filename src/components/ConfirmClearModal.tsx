import { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmClearModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmClearModal({
  isOpen,
  onCancel,
  onConfirm,
}: ConfirmClearModalProps) {
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    cancelBtnRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e1d1d]/75"
      role="dialog"
      aria-modal="true"
      aria-labelledby="clear-modal-title"
      aria-describedby="clear-modal-desc"
    >
      <div className="bg-white dark:bg-[#262525] border border-zinc-300 dark:border-[#3d3b3b] rounded-xl max-w-md w-full p-6 space-y-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <AlertTriangle
            className="w-6 h-6 text-[#8a5a00] dark:text-[#ffcd40] shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div className="space-y-2">
            <h2
              id="clear-modal-title"
              className="font-display text-lg font-semibold text-[#1e1d1d] dark:text-[#f4f4f4]"
            >
              Apagar progresso neste dispositivo?
            </h2>
            <p
              id="clear-modal-desc"
              className="text-sm text-zinc-700 dark:text-[#c4c2c2] leading-relaxed"
            >
              Isso remove apenas os dados desta atividade salvos neste navegador.
              Suas respostas atuais e pontuação serão apagadas e você voltará para a tela inicial.
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-1">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onCancel}
            className="min-h-[44px] px-4 py-2 text-sm font-medium text-[#1e1d1d] dark:text-[#f4f4f4] bg-[#f4f4f4] dark:bg-[#1e1d1d] border border-zinc-300 dark:border-[#3d3b3b] rounded-lg hover:bg-zinc-200 dark:hover:bg-[#2e2d2d] whitespace-nowrap"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="min-h-[44px] px-4 py-2 text-sm font-semibold text-[#f4f4f4] bg-[#e20000] dark:bg-[#f80000] rounded-lg hover:bg-[#c20000] dark:hover:bg-[#e20000] whitespace-nowrap"
          >
            Sim, apagar progresso
          </button>
        </div>
      </div>
    </div>
  );
}
