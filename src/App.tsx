import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { AxisId, CARDS } from './data/cards';
import {
  PersistedGameState,
  ScreenId,
  calculateScore,
  clearPersistedState,
  createFreshGameState,
  getIncorrectCardIds,
  getUnansweredIndices,
  loadPersistedState,
  savePersistedState,
} from './utils/gameLogic';
import { HeaderBar, ThemeMode } from './components/HeaderBar';
import { ConfirmClearModal } from './components/ConfirmClearModal';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { ClassifyScreen } from './components/screens/ClassifyScreen';
import { ReviewScreen } from './components/screens/ReviewScreen';
import { ResultScreen } from './components/screens/ResultScreen';
import { RevisionScreen } from './components/screens/RevisionScreen';
import { DocsExportScreen } from './components/screens/DocsExportScreen';
import {
  playCompleteSound,
  playNavigateSound,
  playSelectAxisSound,
} from './utils/soundFx';

export default function App() {
  const initialLoad = useMemo(() => loadPersistedState(), []);

  const [gameState, setGameState] = useState<PersistedGameState | null>(
    initialLoad.state
  );
  const [viewingWelcome, setViewingWelcome] = useState<boolean>(
    initialLoad.state === null
  );
  const [storageAvailable, setStorageAvailable] = useState<boolean>(
    initialLoad.storageAvailable
  );

  // Identification fields strictly in memory (never persisted in localStorage or cookies)
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [studentSchool, setStudentSchool] = useState('');

  const [pendingNotice, setPendingNotice] = useState<string | null>(null);
  const [returnedFromReview, setReturnedFromReview] = useState(false);
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }
    return window.matchMedia('(prefers-contrast: more)').matches;
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', highContrast);
  }, [highContrast]);

  useEffect(() => {
    if (!gameState) return;
    const ok = savePersistedState(gameState);
    if (!ok) {
      setStorageAvailable(false);
    }
  }, [gameState]);

  const activeScreen: ScreenId =
    viewingWelcome || !gameState ? 'welcome' : gameState.screen;

  const hasSavedProgress = gameState !== null;
  const savedAnsweredCount = gameState
    ? Object.keys(gameState.currentAnswers).length
    : 0;

  const handleToggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      if (next) {
        playNavigateSound(true);
      }
      return next;
    });
  }, []);

  const handleToggleHighContrast = useCallback(() => {
    setHighContrast((prev) => {
      const next = !prev;
      setLiveAnnouncement(
        next
          ? 'Modo Alto Contraste ativado.'
          : 'Modo Alto Contraste desativado.'
      );
      return next;
    });
    playNavigateSound(soundEnabled);
  }, [soundEnabled]);

  const handleStartNew = useCallback(() => {
    const fresh = createFreshGameState('classify');
    setGameState(fresh);
    setViewingWelcome(false);
    setPendingNotice(null);
    setReturnedFromReview(false);
    setStudentName('');
    setStudentClass('');
    setStudentSchool('');
    setLiveAnnouncement('Nova partida iniciada. Cartão 1 de 12.');
    playNavigateSound(soundEnabled);
    window.scrollTo({ top: 0 });
  }, [soundEnabled]);

  const handleContinue = useCallback(() => {
    if (!gameState) return;
    setViewingWelcome(false);
    setPendingNotice(null);
    setLiveAnnouncement('Atividade retomada.');
    playNavigateSound(soundEnabled);
    window.scrollTo({ top: 0 });
  }, [gameState, soundEnabled]);

  const handleGoHome = useCallback(() => {
    setViewingWelcome(true);
    setPendingNotice(null);
    window.scrollTo({ top: 0 });
  }, []);

  const handleSelectAxis = useCallback(
    (cardId: number, axisId: AxisId) => {
      setGameState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          currentAnswers: {
            ...prev.currentAnswers,
            [cardId]: axisId,
          },
        };
      });
      setPendingNotice(null);
      playSelectAxisSound(soundEnabled);
    },
    [soundEnabled]
  );

  const handlePrevCard = useCallback(() => {
    setGameState((prev) => {
      if (!prev || prev.currentCardIndex <= 0) return prev;
      const nextIdx = prev.currentCardIndex - 1;
      setLiveAnnouncement(`Cartão ${nextIdx + 1} de ${CARDS.length}.`);
      return {
        ...prev,
        currentCardIndex: nextIdx,
      };
    });
    setPendingNotice(null);
    playNavigateSound(soundEnabled);
  }, [soundEnabled]);

  const handleNextCard = useCallback(() => {
    setGameState((prev) => {
      if (!prev || prev.currentCardIndex >= CARDS.length - 1) return prev;
      const nextIdx = prev.currentCardIndex + 1;
      setLiveAnnouncement(`Cartão ${nextIdx + 1} de ${CARDS.length}.`);
      return {
        ...prev,
        currentCardIndex: nextIdx,
      };
    });
    setPendingNotice(null);
    playNavigateSound(soundEnabled);
  }, [soundEnabled]);

  const handleGoToReview = useCallback(() => {
    setGameState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        screen: 'review',
      };
    });
    setPendingNotice(null);
    setReturnedFromReview(false);
    setLiveAnnouncement('Tela de revisão das escolhas.');
    playNavigateSound(soundEnabled);
    window.scrollTo({ top: 0 });
  }, [soundEnabled]);

  const handleEditCardFromReview = useCallback(
    (cardIndex: number) => {
      setGameState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          screen: 'classify',
          currentCardIndex: cardIndex,
        };
      });
      setPendingNotice(null);
      setReturnedFromReview(true);
      setLiveAnnouncement(`Alterando cartão ${cardIndex + 1} de ${CARDS.length}.`);
      playNavigateSound(soundEnabled);
      window.scrollTo({ top: 0 });
    },
    [soundEnabled]
  );

  const handleBackToCardsFromReview = useCallback(() => {
    setGameState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        screen: 'classify',
      };
    });
    setPendingNotice(null);
    setReturnedFromReview(false);
    playNavigateSound(soundEnabled);
    window.scrollTo({ top: 0 });
  }, [soundEnabled]);

  const handleSubmitReview = useCallback(() => {
    if (!gameState) return;
    const missingIndices = getUnansweredIndices(
      gameState.cardOrder,
      gameState.currentAnswers
    );

    if (missingIndices.length > 0) {
      const firstMissingIndex = missingIndices[0];
      const msg =
        missingIndices.length === 1
          ? `Falta responder 1 cartão (posição ${firstMissingIndex + 1} de ${CARDS.length}). Escolha o eixo para esta situação.`
          : `Faltam responder ${missingIndices.length} cartões. Levando você ao primeiro pendente (posição ${firstMissingIndex + 1} de ${CARDS.length}).`;

      setGameState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          screen: 'classify',
          currentCardIndex: firstMissingIndex,
        };
      });
      setPendingNotice(msg);
      setReturnedFromReview(true);
      setLiveAnnouncement(msg);
      playNavigateSound(soundEnabled);
      window.scrollTo({ top: 0 });
      return;
    }

    const score = calculateScore(gameState.currentAnswers);
    const snapshotAnswers = { ...gameState.currentAnswers };

    setGameState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        firstAttemptAnswers: snapshotAnswers,
        firstAttemptScore: score,
        revisionCompleted: false,
        revisionScore: null,
        revisionCardIds: [],
        revisionIndex: 0,
        screen: 'result',
      };
    });
    setPendingNotice(null);
    setReturnedFromReview(false);
    setLiveAnnouncement(
      `Correção concluída. Você identificou o eixo principal em ${score} de ${CARDS.length} situações na primeira tentativa.`
    );
    playCompleteSound(soundEnabled);
    window.scrollTo({ top: 0 });
  }, [gameState, soundEnabled]);

  const handleStartRevision = useCallback(() => {
    if (!gameState) return;
    const incorrectIds = getIncorrectCardIds(
      gameState.cardOrder,
      gameState.currentAnswers
    );
    if (incorrectIds.length === 0) return;

    setGameState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        revisionCardIds: incorrectIds,
        revisionIndex: 0,
        screen: 'revision',
      };
    });
    setLiveAnnouncement(
      `Iniciando revisão de ${incorrectIds.length} situações.`
    );
    playNavigateSound(soundEnabled);
    window.scrollTo({ top: 0 });
  }, [gameState, soundEnabled]);

  const handlePrevRevision = useCallback(() => {
    setGameState((prev) => {
      if (!prev || prev.revisionIndex <= 0) return prev;
      return {
        ...prev,
        revisionIndex: prev.revisionIndex - 1,
      };
    });
    playNavigateSound(soundEnabled);
  }, [soundEnabled]);

  const handleNextRevision = useCallback(() => {
    setGameState((prev) => {
      if (!prev || prev.revisionIndex >= prev.revisionCardIds.length - 1) {
        return prev;
      }
      return {
        ...prev,
        revisionIndex: prev.revisionIndex + 1,
      };
    });
    playNavigateSound(soundEnabled);
  }, [soundEnabled]);

  const handleFinishRevision = useCallback(() => {
    setGameState((prev) => {
      if (!prev) return prev;
      const newScore = calculateScore(prev.currentAnswers);
      setLiveAnnouncement(
        `Revisão concluída. Resultado após revisão: ${newScore} de ${CARDS.length}.`
      );
      return {
        ...prev,
        revisionCompleted: true,
        revisionScore: newScore,
        screen: 'result',
      };
    });
    playCompleteSound(soundEnabled);
    window.scrollTo({ top: 0 });
  }, [soundEnabled]);

  const handleCancelRevisionToResult = useCallback(() => {
    setGameState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        screen: 'result',
      };
    });
    playNavigateSound(soundEnabled);
    window.scrollTo({ top: 0 });
  }, [soundEnabled]);

  const handleGoToDocs = useCallback(() => {
    setGameState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        screen: 'docs',
      };
    });
    setLiveAnnouncement('Tela para levar o resultado ao Google Docs.');
    playNavigateSound(soundEnabled);
    window.scrollTo({ top: 0 });
  }, [soundEnabled]);

  const handleBackToResultFromDocs = useCallback(() => {
    setGameState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        screen: 'result',
      };
    });
    playNavigateSound(soundEnabled);
    window.scrollTo({ top: 0 });
  }, [soundEnabled]);

  const handleConfirmClearProgress = useCallback(() => {
    clearPersistedState();
    setGameState(null);
    setViewingWelcome(true);
    setPendingNotice(null);
    setReturnedFromReview(false);
    setStudentName('');
    setStudentClass('');
    setStudentSchool('');
    setClearModalOpen(false);
    setLiveAnnouncement('Progresso apagado deste dispositivo.');
    window.scrollTo({ top: 0 });
  }, []);

  const currentIncorrectCount = useMemo(() => {
    if (!gameState) return 0;
    return getIncorrectCardIds(gameState.cardOrder, gameState.currentAnswers)
      .length;
  }, [gameState]);

  return (
    <div className="min-h-screen flex flex-col em-hud-grid text-[#1e1d1d] dark:text-[#f4f4f4] transition-colors">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#c8ff00] focus:text-[#1e1d1d] focus:font-bold focus:rounded-lg"
        >
          Ir para o conteúdo principal
        </a>

        <HeaderBar
          currentScreen={activeScreen}
          hasSavedProgress={hasSavedProgress}
          theme={theme}
          highContrast={highContrast}
          soundEnabled={soundEnabled}
          onChangeTheme={setTheme}
          onToggleHighContrast={handleToggleHighContrast}
          onToggleSound={handleToggleSound}
          onGoHome={handleGoHome}
          onRequestClear={() => setClearModalOpen(true)}
        />

        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {liveAnnouncement}
        </div>

        <main
          id="main-content"
          className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6"
        >
          {!storageAvailable && (
            <div
              role="status"
              className="bg-white dark:bg-[#262525] border border-[#8a5a00] dark:border-[#ffcd40] text-[#1e1d1d] dark:text-[#f4f4f4] rounded-xl px-4 py-3 text-sm flex items-start gap-2.5"
            >
              <AlertTriangle
                className="w-5 h-5 text-[#8a5a00] dark:text-[#ffcd40] shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <span>
                O armazenamento local deste navegador está indisponível. O jogo
                funciona normalmente nesta sessão, mas o progresso pode ser
                perdido ao fechar ou recarregar a página.
              </span>
            </div>
          )}

          {activeScreen === 'welcome' && (
            <WelcomeScreen
              hasSavedProgress={hasSavedProgress}
              savedAnsweredCount={savedAnsweredCount}
              onStartNew={handleStartNew}
              onContinue={handleContinue}
            />
          )}

          {activeScreen === 'classify' && gameState && (
            <ClassifyScreen
              cardOrder={gameState.cardOrder}
              currentCardIndex={gameState.currentCardIndex}
              currentAnswers={gameState.currentAnswers}
              pendingNotice={pendingNotice}
              returnedFromReview={returnedFromReview}
              soundEnabled={soundEnabled}
              onSelectAxis={handleSelectAxis}
              onPrev={handlePrevCard}
              onNext={handleNextCard}
              onGoToReview={handleGoToReview}
            />
          )}

          {activeScreen === 'review' && gameState && (
            <ReviewScreen
              cardOrder={gameState.cardOrder}
              currentAnswers={gameState.currentAnswers}
              onEditCard={handleEditCardFromReview}
              onBackToCards={handleBackToCardsFromReview}
              onSubmitReview={handleSubmitReview}
            />
          )}

          {activeScreen === 'result' &&
            gameState &&
            gameState.firstAttemptAnswers !== null &&
            gameState.firstAttemptScore !== null && (
              <ResultScreen
                cardOrder={gameState.cardOrder}
                firstAttemptScore={gameState.firstAttemptScore}
                firstAttemptAnswers={gameState.firstAttemptAnswers}
                currentAnswers={gameState.currentAnswers}
                revisionCompleted={gameState.revisionCompleted}
                revisionScore={gameState.revisionScore}
                incorrectCount={currentIncorrectCount}
                onStartRevision={handleStartRevision}
                onGoToDocs={handleGoToDocs}
              />
            )}

          {activeScreen === 'revision' &&
            gameState &&
            gameState.revisionCardIds.length > 0 && (
              <RevisionScreen
                revisionCardIds={gameState.revisionCardIds}
                revisionIndex={gameState.revisionIndex}
                currentAnswers={gameState.currentAnswers}
                onSelectAxis={handleSelectAxis}
                onPrev={handlePrevRevision}
                onNext={handleNextRevision}
                onFinishRevision={handleFinishRevision}
                onCancelToResult={handleCancelRevisionToResult}
              />
            )}

          {activeScreen === 'docs' &&
            gameState &&
            gameState.firstAttemptScore !== null && (
              <DocsExportScreen
                studentName={studentName}
                studentClass={studentClass}
                studentSchool={studentSchool}
                firstAttemptScore={gameState.firstAttemptScore}
                revisionCompleted={gameState.revisionCompleted}
                revisionScore={gameState.revisionScore}
                currentAnswers={gameState.currentAnswers}
                soundEnabled={soundEnabled}
                onChangeName={setStudentName}
                onChangeClass={setStudentClass}
                onChangeSchool={setStudentSchool}
                onBackToResult={handleBackToResultFromDocs}
              />
            )}
        </main>

        <footer className="border-t border-zinc-300 dark:border-[#3d3b3b] bg-white dark:bg-[#1e1d1d] transition-colors">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm text-zinc-600 dark:text-[#a8a6a6]">
            <p>
              O progresso fica salvo apenas neste navegador. Em um computador
              compartilhado, apague-o ao terminar.
            </p>
            {hasSavedProgress && (
              <button
                type="button"
                onClick={() => setClearModalOpen(true)}
                className="font-medium text-[#1e1d1d] dark:text-[#f4f4f4] hover:text-[#2076aa] dark:hover:text-[#c8ff00] underline underline-offset-4 whitespace-nowrap shrink-0 min-h-[44px] inline-flex items-center"
              >
                Apagar progresso neste dispositivo
              </button>
            )}
          </div>
        </footer>

        <ConfirmClearModal
          isOpen={clearModalOpen}
          onCancel={() => setClearModalOpen(false)}
          onConfirm={handleConfirmClearProgress}
        />
    </div>
  );
}
