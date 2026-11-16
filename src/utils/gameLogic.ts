import {
  AXES,
  AxisId,
  CARDS,
  CARD_BY_ID,
  CONTENT_VERSION,
} from '../data/cards';

export type ScreenId =
  | 'welcome'
  | 'classify'
  | 'review'
  | 'result'
  | 'revision'
  | 'docs';

export interface PersistedGameState {
  contentVersion: number;
  cardOrder: number[];
  currentAnswers: Record<number, AxisId>;
  firstAttemptAnswers: Record<number, AxisId> | null;
  firstAttemptScore: number | null;
  revisionCompleted: boolean;
  revisionScore: number | null;
  revisionCardIds: number[];
  revisionIndex: number;
  screen: ScreenId;
  currentCardIndex: number;
}

export const STORAGE_KEY = 'qual_e_o_eixo_progresso_v1';

const VALID_AXES = new Set<AxisId>(AXES.map((a) => a.id));
const VALID_CARD_IDS = new Set<number>(CARDS.map((c) => c.id));
const VALID_SCREENS = new Set<ScreenId>([
  'welcome',
  'classify',
  'review',
  'result',
  'revision',
  'docs',
]);

export function shuffleCardIds(randomFn: () => number = Math.random): number[] {
  const ids = CARDS.map((card) => card.id);
  for (let i = ids.length - 1; i > 0; i -= 1) {
    const j = Math.floor(randomFn() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return ids;
}

export function createFreshGameState(
  screen: ScreenId = 'classify',
  randomFn: () => number = Math.random
): PersistedGameState {
  return {
    contentVersion: CONTENT_VERSION,
    cardOrder: shuffleCardIds(randomFn),
    currentAnswers: {},
    firstAttemptAnswers: null,
    firstAttemptScore: null,
    revisionCompleted: false,
    revisionScore: null,
    revisionCardIds: [],
    revisionIndex: 0,
    screen,
    currentCardIndex: 0,
  };
}

export function calculateScore(answers: Record<number, AxisId>): number {
  let score = 0;
  for (const card of CARDS) {
    if (answers[card.id] === card.correctAxis) {
      score += 1;
    }
  }
  return score;
}

export function getUnansweredIndices(
  cardOrder: number[],
  answers: Record<number, AxisId>
): number[] {
  const missing: number[] = [];
  cardOrder.forEach((id, idx) => {
    if (!answers[id] || !VALID_AXES.has(answers[id])) {
      missing.push(idx);
    }
  });
  return missing;
}

export function getIncorrectCardIds(
  cardOrder: number[],
  answers: Record<number, AxisId>
): number[] {
  return cardOrder.filter((id) => {
    const card = CARD_BY_ID[id];
    return card && answers[id] !== card.correctAxis;
  });
}

export interface ExportTextParams {
  studentName: string;
  studentClass: string;
  studentSchool: string;
  firstAttemptScore: number;
  revisionCompleted: boolean;
  revisionScore: number | null;
  currentAnswers: Record<number, AxisId>;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function getExportAxisGroups(
  currentAnswers: Record<number, AxisId>
): Record<AxisId, number[]> {
  const idsByAxis: Record<AxisId, number[]> = {
    pensamento_computacional: [],
    mundo_digital: [],
    cultura_digital: [],
  };

  for (const card of CARDS) {
    const chosen = currentAnswers[card.id];
    if (chosen && idsByAxis[chosen]) {
      idsByAxis[chosen].push(card.id);
    }
  }

  return idsByAxis;
}

export function buildExportText({
  studentName,
  studentClass,
  studentSchool,
  firstAttemptScore,
  revisionCompleted,
  revisionScore,
  currentAnswers,
}: ExportTextParams): string {
  const cleanName = studentName.trim();
  const cleanClass = studentClass.trim();
  const cleanSchool = studentSchool.trim();
  const idsByAxis = getExportAxisGroups(currentAnswers);

  const formatIds = (ids: number[]) =>
    ids.length > 0 ? ids.join(', ') : 'nenhum';

  const revisionLine =
    revisionCompleted && revisionScore !== null
      ? `Resultado após revisão: ${revisionScore} de ${CARDS.length}.`
      : 'Revisão: não realizada';

  return [
    'ATIVIDADE AULA 1: QUAL É O EIXO?',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    'IDENTIFICAÇÃO',
    `Nome: ${cleanName || '[não informado]'}.`,
    `Turma: ${cleanClass || '[não informada]'}.`,
    `Escola: ${cleanSchool || '[não informada]'}.`,
    '',
    'DESEMPENHO',
    `Resultado da primeira tentativa: ${firstAttemptScore} de ${CARDS.length}.`,
    revisionLine,
    '',
    'MINHAS CLASSIFICAÇÕES ATUAIS',
    `• Pensamento Computacional: cartões ${formatIds(idsByAxis.pensamento_computacional)}.`,
    `• Mundo Digital: cartões ${formatIds(idsByAxis.mundo_digital)}.`,
    `• Cultura Digital: cartões ${formatIds(idsByAxis.cultura_digital)}.`,
    '',
    '────────────────────────────────────────',
    'Os três eixos se conectam. A classificação considera',
    'o foco principal de cada situação.',
  ].join('\n');
}

export function buildExportHtml({
  studentName,
  studentClass,
  studentSchool,
  firstAttemptScore,
  revisionCompleted,
  revisionScore,
  currentAnswers,
}: ExportTextParams): string {
  const cleanName = escapeHtml(studentName.trim() || '[não informado]');
  const cleanClass = escapeHtml(studentClass.trim() || '[não informada]');
  const cleanSchool = escapeHtml(studentSchool.trim() || '[não informada]');
  const idsByAxis = getExportAxisGroups(currentAnswers);

  const formatIds = (ids: number[]) =>
    ids.length > 0 ? ids.join(', ') : 'nenhum';

  const revisionValue =
    revisionCompleted && revisionScore !== null
      ? `${revisionScore} de ${CARDS.length}`
      : 'Não realizada';

  return [
    '<div style="font-family: Arial, Helvetica, sans-serif; color: #1e1d1d; max-width: 680px; line-height: 1.5;">',
    '  <div style="background-color: #1e1d1d; color: #f4f4f4; padding: 18px 22px; border-bottom: 4px solid #c8ff00;">',
    '    <p style="margin: 0 0 4px 0; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #c8ff00; font-weight: bold;">Computação · 1ª Série do Ensino Médio</p>',
    '    <h1 style="margin: 0; font-size: 20px; font-weight: bold; color: #f4f4f4;">ATIVIDADE AULA 1: QUAL É O EIXO?</h1>',
    '  </div>',
    '  <table style="width: 100%; border-collapse: collapse; margin-top: 14px; background-color: #f4f4f4; border: 1px solid #d4d4d8;">',
    '    <tr>',
    `      <td style="padding: 10px 14px; border-bottom: 1px solid #e4e4e7; font-size: 13px;"><strong style="color: #1e1d1d;">Nome:</strong> ${cleanName}</td>`,
    `      <td style="padding: 10px 14px; border-bottom: 1px solid #e4e4e7; font-size: 13px; width: 150px;"><strong style="color: #1e1d1d;">Turma:</strong> ${cleanClass}</td>`,
    '    </tr>',
    '    <tr>',
    `      <td colspan="2" style="padding: 10px 14px; font-size: 13px;"><strong style="color: #1e1d1d;">Escola:</strong> ${cleanSchool}</td>`,
    '    </tr>',
    '  </table>',
    '  <table style="width: 100%; border-collapse: collapse; margin-top: 14px; border: 1px solid #d4d4d8;">',
    '    <tr>',
    '      <td style="width: 50%; padding: 12px 14px; background-color: #ffffff; border-right: 1px solid #d4d4d8;">',
    '        <div style="font-size: 11px; text-transform: uppercase; color: #52525b; font-weight: bold;">Primeira tentativa</div>',
    `        <div style="font-size: 18px; font-weight: bold; color: #2076aa; margin-top: 2px;">${firstAttemptScore} de ${CARDS.length}</div>`,
    '      </td>',
    '      <td style="width: 50%; padding: 12px 14px; background-color: #ffffff;">',
    '        <div style="font-size: 11px; text-transform: uppercase; color: #52525b; font-weight: bold;">Resultado após revisão</div>',
    `        <div style="font-size: 18px; font-weight: bold; color: #9a4cbf; margin-top: 2px;">${revisionValue}</div>`,
    '      </td>',
    '    </tr>',
    '  </table>',
    '  <h2 style="margin: 18px 0 8px 0; font-size: 13px; letter-spacing: 0.05em; text-transform: uppercase; color: #1e1d1d;">Minhas classificações atuais</h2>',
    '  <table style="width: 100%; border-collapse: collapse; border: 1px solid #d4d4d8; background-color: #ffffff;">',
    '    <tr>',
    '      <td style="padding: 10px 14px; border-bottom: 1px solid #e4e4e7; font-weight: bold; color: #2076aa; width: 220px; font-size: 13px;">Pensamento Computacional</td>',
    `      <td style="padding: 10px 14px; border-bottom: 1px solid #e4e4e7; font-size: 13px; color: #1e1d1d;">Cartões: ${formatIds(idsByAxis.pensamento_computacional)}</td>`,
    '    </tr>',
    '    <tr>',
    '      <td style="padding: 10px 14px; border-bottom: 1px solid #e4e4e7; font-weight: bold; color: #9a4cbf; font-size: 13px;">Mundo Digital</td>',
    `      <td style="padding: 10px 14px; border-bottom: 1px solid #e4e4e7; font-size: 13px; color: #1e1d1d;">Cartões: ${formatIds(idsByAxis.mundo_digital)}</td>`,
    '    </tr>',
    '    <tr>',
    '      <td style="padding: 10px 14px; font-weight: bold; color: #bc26a0; font-size: 13px;">Cultura Digital</td>',
    `      <td style="padding: 10px 14px; font-size: 13px; color: #1e1d1d;">Cartões: ${formatIds(idsByAxis.cultura_digital)}</td>`,
    '    </tr>',
    '  </table>',
    '  <p style="margin: 14px 0 0 0; padding: 10px 14px; background-color: #f4f4f4; font-size: 12px; color: #3f3f46;">Os três eixos se conectam. A classificação considera o foco principal de cada situação.</p>',
    '</div>',
  ].join('\n');
}

function isValidAnswersMap(value: unknown): value is Record<number, AxisId> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  for (const [key, axis] of Object.entries(value)) {
    const numericId = Number(key);
    if (!Number.isInteger(numericId) || !VALID_CARD_IDS.has(numericId)) {
      return false;
    }
    if (typeof axis !== 'string' || !VALID_AXES.has(axis as AxisId)) {
      return false;
    }
  }
  return true;
}

export function validatePersistedState(raw: unknown): PersistedGameState | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return null;
  }

  const candidate = raw as Record<string, unknown>;

  if (candidate.contentVersion !== CONTENT_VERSION) {
    return null;
  }

  if (
    !Array.isArray(candidate.cardOrder) ||
    candidate.cardOrder.length !== CARDS.length
  ) {
    return null;
  }

  const seenIds = new Set<number>();
  for (const id of candidate.cardOrder) {
    if (
      typeof id !== 'number' ||
      !Number.isInteger(id) ||
      !VALID_CARD_IDS.has(id) ||
      seenIds.has(id)
    ) {
      return null;
    }
    seenIds.add(id);
  }

  if (!isValidAnswersMap(candidate.currentAnswers)) {
    return null;
  }

  if (
    candidate.firstAttemptAnswers !== null &&
    !isValidAnswersMap(candidate.firstAttemptAnswers)
  ) {
    return null;
  }

  if (
    candidate.firstAttemptScore !== null &&
    (typeof candidate.firstAttemptScore !== 'number' ||
      !Number.isInteger(candidate.firstAttemptScore) ||
      candidate.firstAttemptScore < 0 ||
      candidate.firstAttemptScore > CARDS.length)
  ) {
    return null;
  }

  if (typeof candidate.revisionCompleted !== 'boolean') {
    return null;
  }

  if (
    candidate.revisionScore !== null &&
    (typeof candidate.revisionScore !== 'number' ||
      !Number.isInteger(candidate.revisionScore) ||
      candidate.revisionScore < 0 ||
      candidate.revisionScore > CARDS.length)
  ) {
    return null;
  }

  if (!Array.isArray(candidate.revisionCardIds)) {
    return null;
  }
  for (const id of candidate.revisionCardIds) {
    if (typeof id !== 'number' || !VALID_CARD_IDS.has(id)) {
      return null;
    }
  }

  if (
    typeof candidate.revisionIndex !== 'number' ||
    !Number.isInteger(candidate.revisionIndex) ||
    candidate.revisionIndex < 0 ||
    candidate.revisionIndex >= Math.max(1, candidate.revisionCardIds.length)
  ) {
    return null;
  }

  if (
    typeof candidate.screen !== 'string' ||
    !VALID_SCREENS.has(candidate.screen as ScreenId)
  ) {
    return null;
  }

  if (
    typeof candidate.currentCardIndex !== 'number' ||
    !Number.isInteger(candidate.currentCardIndex) ||
    candidate.currentCardIndex < 0 ||
    candidate.currentCardIndex >= CARDS.length
  ) {
    return null;
  }

  // Consistency check: result/revision/docs require firstAttemptScore & firstAttemptAnswers
  if (
    (candidate.screen === 'result' ||
      candidate.screen === 'revision' ||
      candidate.screen === 'docs') &&
    (candidate.firstAttemptAnswers === null ||
      candidate.firstAttemptScore === null)
  ) {
    return null;
  }

  return {
    contentVersion: CONTENT_VERSION,
    cardOrder: candidate.cardOrder as number[],
    currentAnswers: candidate.currentAnswers,
    firstAttemptAnswers: candidate.firstAttemptAnswers,
    firstAttemptScore: candidate.firstAttemptScore,
    revisionCompleted: candidate.revisionCompleted,
    revisionScore: candidate.revisionScore,
    revisionCardIds: candidate.revisionCardIds as number[],
    revisionIndex: candidate.revisionIndex,
    screen: candidate.screen as ScreenId,
    currentCardIndex: candidate.currentCardIndex,
  };
}

function checkStorageAvailability(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const probeKey = `${STORAGE_KEY}__probe`;
    window.localStorage.setItem(probeKey, '1');
    window.localStorage.removeItem(probeKey);
    return true;
  } catch {
    return false;
  }
}

export function loadPersistedState(): {
  state: PersistedGameState | null;
  storageAvailable: boolean;
} {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { state: null, storageAvailable: false };
    }
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { state: null, storageAvailable: checkStorageAvailability() };
    }
    const parsed: unknown = JSON.parse(raw);
    const validated = validatePersistedState(parsed);
    if (!validated) {
      // Invalid or outdated state: remove only our key so user can start fresh
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore removal error
      }
      return { state: null, storageAvailable: checkStorageAvailability() };
    }
    return { state: validated, storageAvailable: true };
  } catch {
    return { state: null, storageAvailable: false };
  }
}

export function savePersistedState(state: PersistedGameState): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clearPersistedState(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    window.localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
