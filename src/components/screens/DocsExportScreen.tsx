import { useCallback, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { AxisId, CARDS, URL_ABRIR_DOCS, getValidatedDocsUrl } from '../../data/cards';
import {
  buildExportHtml,
  buildExportText,
  getExportAxisGroups,
} from '../../utils/gameLogic';
import { playCopySound } from '../../utils/soundFx';

interface DocsExportScreenProps {
  studentName: string;
  studentClass: string;
  studentSchool: string;
  firstAttemptScore: number;
  revisionCompleted: boolean;
  revisionScore: number | null;
  currentAnswers: Record<number, AxisId>;
  soundEnabled: boolean;
  onChangeName: (value: string) => void;
  onChangeClass: (value: string) => void;
  onChangeSchool: (value: string) => void;
  onBackToResult: () => void;
}

export function DocsExportScreen({
  studentName,
  studentClass,
  studentSchool,
  firstAttemptScore,
  revisionCompleted,
  revisionScore,
  currentAnswers,
  soundEnabled,
  onChangeName,
  onChangeClass,
  onChangeSchool,
  onBackToResult,
}: DocsExportScreenProps) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'manual'>('idle');
  const [selectionNotice, setSelectionNotice] = useState(false);
  const manualTextareaRef = useRef<HTMLTextAreaElement>(null);

  const missingFields = useMemo(() => {
    const missing: string[] = [];
    if (!studentName.trim()) missing.push('Nome');
    if (!studentClass.trim()) missing.push('Turma');
    if (!studentSchool.trim()) missing.push('Escola');
    return missing;
  }, [studentName, studentClass, studentSchool]);

  const allFieldsFilled = missingFields.length === 0;

  const missingMessage = useMemo(() => {
    if (missingFields.length === 0) return '';
    if (missingFields.length === 1) {
      return `Preencha o campo ${missingFields[0]} para habilitar a cópia.`;
    }
    const last = missingFields[missingFields.length - 1];
    const head = missingFields.slice(0, -1).join(', ');
    return `Preencha os campos ${head} e ${last} para habilitar a cópia.`;
  }, [missingFields]);

  const exportParams = useMemo(
    () => ({
      studentName,
      studentClass,
      studentSchool,
      firstAttemptScore,
      revisionCompleted,
      revisionScore,
      currentAnswers,
    }),
    [
      studentName,
      studentClass,
      studentSchool,
      firstAttemptScore,
      revisionCompleted,
      revisionScore,
      currentAnswers,
    ]
  );

  const exportText = useMemo(() => buildExportText(exportParams), [exportParams]);
  const exportHtml = useMemo(() => buildExportHtml(exportParams), [exportParams]);
  const axisGroups = useMemo(
    () => getExportAxisGroups(currentAnswers),
    [currentAnswers]
  );

  const validDocsUrl = getValidatedDocsUrl(URL_ABRIR_DOCS);

  const copyFormattedResult = useCallback(async (): Promise<boolean> => {
    if (!allFieldsFilled) return false;
    setSelectionNotice(false);

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      if (
        typeof navigator.clipboard.write === 'function' &&
        typeof ClipboardItem !== 'undefined'
      ) {
        try {
          const item = new ClipboardItem({
            'text/html': new Blob([exportHtml], { type: 'text/html' }),
            'text/plain': new Blob([exportText], { type: 'text/plain' }),
          });
          await navigator.clipboard.write([item]);
          setCopyStatus('copied');
          playCopySound(soundEnabled);
          return true;
        } catch {
          // Fall through to writeText
        }
      }

      if (typeof navigator.clipboard.writeText === 'function') {
        try {
          await navigator.clipboard.writeText(exportText);
          setCopyStatus('copied');
          playCopySound(soundEnabled);
          return true;
        } catch {
          // Fall through to manual fallback
        }
      }
    }

    setCopyStatus('manual');
    requestAnimationFrame(() => {
      manualTextareaRef.current?.focus();
      manualTextareaRef.current?.select();
    });
    return false;
  }, [allFieldsFilled, exportHtml, exportText, soundEnabled]);

  const handleSelectManual = () => {
    if (manualTextareaRef.current) {
      manualTextareaRef.current.focus();
      manualTextareaRef.current.select();
      setSelectionNotice(true);
    }
  };

  const handleOpenDocsClick = () => {
    if (allFieldsFilled && copyStatus !== 'copied') {
      void copyFormattedResult();
    }
  };

  const formatIds = (ids: number[]) =>
    ids.length > 0 ? ids.join(', ') : 'nenhum';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1e1d1d] dark:text-[#f4f4f4]">
            Levar resultado ao Docs
          </h1>
          <p className="text-sm sm:text-base text-zinc-700 dark:text-[#c4c2c2] mt-1">
            Preencha seus dados, copie o registro diagramado e cole no documento em branco do Google Docs.
          </p>
        </div>
      </div>

      {/* 1. Campos de identificação: Nome, Turma e Escola */}
      <section
        aria-labelledby="id-fields-heading"
        className="bg-white dark:bg-[#262525] border border-zinc-300 dark:border-[#3d3b3b] rounded-xl p-6 sm:p-8 space-y-5"
      >
        <div className="space-y-1">
          <h2
            id="id-fields-heading"
            className="font-display text-lg font-semibold text-[#1e1d1d] dark:text-[#f4f4f4]"
          >
            1. Identificação do estudante
          </h2>
          <p className="text-sm text-zinc-700 dark:text-[#c4c2c2]">
            Estes dados ficam apenas na tela e no texto copiado. Eles não são salvos neste navegador.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2 space-y-1.5">
            <label
              htmlFor="student-name"
              className="block text-sm font-semibold text-[#1e1d1d] dark:text-[#f4f4f4]"
            >
              Nome{' '}
              <span className="text-[#8a5a00] dark:text-[#ffcd40] font-normal">
                (obrigatório)
              </span>
            </label>
            <input
              id="student-name"
              name="student-name"
              type="text"
              maxLength={100}
              autoComplete="off"
              value={studentName}
              onChange={(e) => {
                onChangeName(e.target.value);
                if (copyStatus !== 'idle') setCopyStatus('idle');
              }}
              aria-describedby="student-name-hint"
              className="w-full min-h-[44px] px-3.5 py-2.5 text-base text-[#1e1d1d] dark:text-[#f4f4f4] bg-[#f4f4f4] dark:bg-[#1e1d1d] border border-zinc-300 dark:border-[#3d3b3b] rounded-lg focus:border-[#2076aa] dark:focus:border-[#c8ff00]"
            />
            <p id="student-name-hint" className="text-xs text-zinc-600 dark:text-[#a8a6a6]">
              Em dupla, informe os dois nomes (até 100 caracteres).
            </p>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="student-class"
              className="block text-sm font-semibold text-[#1e1d1d] dark:text-[#f4f4f4]"
            >
              Turma{' '}
              <span className="text-[#8a5a00] dark:text-[#ffcd40] font-normal">
                (obrigatório)
              </span>
            </label>
            <input
              id="student-class"
              name="student-class"
              type="text"
              maxLength={20}
              autoComplete="off"
              value={studentClass}
              onChange={(e) => {
                onChangeClass(e.target.value);
                if (copyStatus !== 'idle') setCopyStatus('idle');
              }}
              aria-describedby="student-class-hint"
              className="w-full min-h-[44px] px-3.5 py-2.5 text-base text-[#1e1d1d] dark:text-[#f4f4f4] bg-[#f4f4f4] dark:bg-[#1e1d1d] border border-zinc-300 dark:border-[#3d3b3b] rounded-lg focus:border-[#2076aa] dark:focus:border-[#c8ff00]"
            />
            <p id="student-class-hint" className="text-xs text-zinc-600 dark:text-[#a8a6a6]">
              Exemplo: 1ª A (até 20 caracteres).
            </p>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="student-school"
              className="block text-sm font-semibold text-[#1e1d1d] dark:text-[#f4f4f4]"
            >
              Escola{' '}
              <span className="text-[#8a5a00] dark:text-[#ffcd40] font-normal">
                (obrigatório)
              </span>
            </label>
            <input
              id="student-school"
              name="student-school"
              type="text"
              maxLength={100}
              autoComplete="off"
              value={studentSchool}
              onChange={(e) => {
                onChangeSchool(e.target.value);
                if (copyStatus !== 'idle') setCopyStatus('idle');
              }}
              aria-describedby="student-school-hint"
              className="w-full min-h-[44px] px-3.5 py-2.5 text-base text-[#1e1d1d] dark:text-[#f4f4f4] bg-[#f4f4f4] dark:bg-[#1e1d1d] border border-zinc-300 dark:border-[#3d3b3b] rounded-lg focus:border-[#2076aa] dark:focus:border-[#c8ff00]"
            />
            <p id="student-school-hint" className="text-xs text-zinc-600 dark:text-[#a8a6a6]">
              Nome da escola (até 100 caracteres).
            </p>
          </div>
        </div>

        <div aria-live="polite" className="text-sm">
          {!allFieldsFilled && (
            <p className="text-[#1e1d1d] dark:text-[#f4f4f4] bg-[#f4f4f4] dark:bg-[#1e1d1d] border border-[#8a5a00] dark:border-[#ffcd40] rounded-lg px-3.5 py-2.5 flex items-center gap-2">
              <AlertCircle
                className="w-4 h-4 text-[#8a5a00] dark:text-[#ffcd40] shrink-0"
                aria-hidden="true"
              />
              <span>{missingMessage}</span>
            </p>
          )}
        </div>
      </section>

      {/* 2. Prévia do texto que será copiado */}
      <section
        aria-labelledby="preview-heading"
        className="bg-white dark:bg-[#262525] border border-zinc-300 dark:border-[#3d3b3b] rounded-xl p-6 sm:p-8 space-y-5"
      >
        <h2
          id="preview-heading"
          className="font-display text-lg font-semibold text-[#1e1d1d] dark:text-[#f4f4f4]"
        >
          2. Prévia do documento que será copiado
        </h2>

        <div className="bg-[#f4f4f4] text-[#1e1d1d] rounded-lg border border-zinc-300 dark:border-[#3d3b3b] overflow-hidden">
            <div className="bg-[#1e1d1d] text-[#f4f4f4] px-5 py-4 border-b-4 border-[#c8ff00]">
              <p className="font-display text-xs font-semibold text-[#c8ff00] uppercase tracking-wider">
                Computação · 1ª Série do Ensino Médio
              </p>
              <p className="font-display text-lg sm:text-xl font-bold text-[#f4f4f4] mt-0.5">
                ATIVIDADE AULA 1: QUAL É O EIXO?
              </p>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white border border-zinc-300 rounded-md p-3.5 text-sm">
                <div className="sm:col-span-2">
                  <span className="font-semibold text-[#1e1d1d]">Nome: </span>
                  <span className="text-zinc-800 break-words">
                    {studentName.trim() || '[não informado]'}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-[#1e1d1d]">Turma: </span>
                  <span className="text-zinc-800 break-words">
                    {studentClass.trim() || '[não informada]'}
                  </span>
                </div>
                <div className="sm:col-span-3 pt-2 border-t border-zinc-200">
                  <span className="font-semibold text-[#1e1d1d]">Escola: </span>
                  <span className="text-zinc-800 break-words">
                    {studentSchool.trim() || '[não informada]'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white border border-zinc-300 rounded-md p-3.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
                    Primeira tentativa
                  </p>
                  <p className="font-display text-lg font-bold text-[#2076aa] mt-0.5 font-mono-tabular">
                    {firstAttemptScore} de {CARDS.length}
                  </p>
                </div>
                <div className="bg-white border border-zinc-300 rounded-md p-3.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
                    Resultado após revisão
                  </p>
                  <p className="font-display text-lg font-bold text-[#9a4cbf] mt-0.5 font-mono-tabular">
                    {revisionCompleted && revisionScore !== null
                      ? `${revisionScore} de ${CARDS.length}`
                      : 'Não realizada'}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-xs font-bold uppercase tracking-wider text-[#1e1d1d]">
                  Minhas classificações atuais
                </h3>
                <div className="bg-white border border-zinc-300 rounded-md divide-y divide-zinc-200 text-sm">
                  <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-bold text-[#2076aa]">
                      Pensamento Computacional
                    </span>
                    <span className="font-mono-tabular text-[#1e1d1d]">
                      Cartões: {formatIds(axisGroups.pensamento_computacional)}
                    </span>
                  </div>
                  <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-bold text-[#9a4cbf]">
                      Mundo Digital
                    </span>
                    <span className="font-mono-tabular text-[#1e1d1d]">
                      Cartões: {formatIds(axisGroups.mundo_digital)}
                    </span>
                  </div>
                  <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-bold text-[#bc26a0]">
                      Cultura Digital
                    </span>
                    <span className="font-mono-tabular text-[#1e1d1d]">
                      Cartões: {formatIds(axisGroups.cultura_digital)}
                    </span>
                  </div>
                </div>
              </div>

            <p className="text-xs text-zinc-700 bg-white border border-zinc-200 rounded-md px-3.5 py-2.5">
              Os três eixos se conectam. A classificação considera o foco principal de cada situação.
            </p>
          </div>
        </div>

        {/* 3. Botão Copiar resultado */}
        <div className="pt-1 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void copyFormattedResult()}
              disabled={!allFieldsFilled}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 text-base font-bold text-[#1e1d1d] bg-[#c8ff00] border border-[#1e1d1d] dark:border-transparent rounded-lg hover:brightness-95 disabled:bg-zinc-200 dark:disabled:bg-[#3d3b3b] disabled:text-zinc-500 dark:disabled:text-[#a8a6a6] disabled:border-zinc-300 dark:disabled:border-transparent disabled:cursor-not-allowed transition-all whitespace-nowrap"
            >
              <Copy className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Copiar resultado</span>
            </button>
          </div>

          {/* 4. Confirmação ou alternativa manual */}
          <div aria-live="polite">
            {copyStatus === 'copied' && (
              <p className="text-sm font-semibold text-[#1e1d1d] bg-[#c8ff00] border border-[#1e1d1d] dark:border-transparent rounded-lg px-4 py-3 flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#1e1d1d] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Resultado copiado. Agora abra o Docs e cole no documento.</span>
              </p>
            )}

            {copyStatus === 'manual' && (
              <div className="bg-[#f4f4f4] dark:bg-[#1e1d1d] border border-[#8a5a00] dark:border-[#ffcd40] rounded-lg p-4 space-y-3">
                <p className="text-sm font-semibold text-[#1e1d1d] dark:text-[#f4f4f4] flex items-start gap-2">
                  <AlertCircle
                    className="w-5 h-5 text-[#8a5a00] dark:text-[#ffcd40] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>
                    Não foi possível copiar automaticamente neste navegador. Selecione o texto abaixo e copie manualmente (Ctrl + C no computador ou tocar e segurar → Copiar no celular).
                  </span>
                </p>
                <label htmlFor="manual-copy-box" className="sr-only">
                  Texto do resultado para cópia manual
                </label>
                <textarea
                  id="manual-copy-box"
                  ref={manualTextareaRef}
                  readOnly
                  rows={10}
                  value={exportText}
                  className="w-full p-3 text-sm font-mono-tabular text-[#1e1d1d] dark:text-[#f4f4f4] bg-white dark:bg-[#262525] border border-[#8a5a00] dark:border-[#ffcd40] rounded-lg"
                />
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSelectManual}
                    className="min-h-[44px] px-4 py-2 text-sm font-bold text-[#1e1d1d] bg-[#ffcd40] border border-[#1e1d1d] dark:border-transparent rounded-lg hover:brightness-95 whitespace-nowrap"
                  >
                    Selecionar todo o texto
                  </button>
                  {selectionNotice && (
                    <span className="text-xs font-medium text-[#8a5a00] dark:text-[#ffcd40]">
                      Texto selecionado. Use Ctrl + C (ou Copiar).
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. Botão Abrir no Docs + 6. Orientação */}
      <section
        aria-labelledby="open-docs-heading"
        className="bg-white dark:bg-[#262525] border border-zinc-300 dark:border-[#3d3b3b] rounded-xl p-6 sm:p-8 space-y-4"
      >
        <h2
          id="open-docs-heading"
          className="font-display text-lg font-semibold text-[#1e1d1d] dark:text-[#f4f4f4]"
        >
          3. Colar no Google Docs
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          {validDocsUrl ? (
            <a
              href={validDocsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleOpenDocsClick}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 text-base font-bold text-[#1e1d1d] bg-[#31b1ff] border border-[#1e1d1d] dark:border-transparent rounded-lg hover:brightness-95 transition-all whitespace-nowrap"
            >
              <span>Abrir no Docs</span>
              <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 text-base font-semibold text-zinc-500 dark:text-[#a8a6a6] bg-zinc-200 dark:bg-[#3d3b3b] rounded-lg cursor-not-allowed whitespace-nowrap"
            >
              <span>Abrir no Docs</span>
            </button>
          )}
        </div>

        {!validDocsUrl && (
          <p className="text-sm text-[#1e1d1d] dark:text-[#f4f4f4] bg-[#f4f4f4] dark:bg-[#1e1d1d] border border-[#8a5a00] dark:border-[#ffcd40] rounded-lg px-4 py-3">
            O link do Google Docs não está configurado nesta página. Abra o Google Docs manualmente no navegador (docs.google.com) ou pelo aplicativo do seu celular e crie um novo documento em branco.
          </p>
        )}

        <p className="text-sm sm:text-base text-zinc-700 dark:text-[#d4d2d2] leading-relaxed">
          No documento em branco, use Ctrl + V no computador ou a opção Colar clicando com o botão direito em um espaço em branco. Depois, dê um título ao arquivo.
        </p>
      </section>

      <div className="flex items-center justify-start">
        <button
          type="button"
          onClick={onBackToResult}
          className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 text-sm font-medium text-[#1e1d1d] dark:text-[#f4f4f4] bg-white dark:bg-[#262525] border border-zinc-300 dark:border-[#3d3b3b] rounded-lg hover:border-[#1e1d1d] dark:hover:border-[#f4f4f4] whitespace-nowrap"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Voltar ao resultado</span>
        </button>
      </div>
    </div>
  );
}
