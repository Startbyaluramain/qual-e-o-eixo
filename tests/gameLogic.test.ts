import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AXES,
  CARDS,
  CONTENT_VERSION,
  URL_ABRIR_DOCS,
  getValidatedDocsUrl,
} from '../src/data/cards';
import {
  STORAGE_KEY,
  buildExportHtml,
  buildExportText,
  calculateScore,
  clearPersistedState,
  createFreshGameState,
  getIncorrectCardIds,
  getUnansweredIndices,
  loadPersistedState,
  savePersistedState,
  shuffleCardIds,
  validatePersistedState,
} from '../src/utils/gameLogic';

test('Conteúdo pedagógico: exatamente 12 cartões (IDs 1..12) e 3 eixos', () => {
  assert.equal(AXES.length, 3);
  assert.equal(CARDS.length, 12);
  for (const axis of AXES) {
    assert.ok(axis.guidingQuestion.length > 0);
    assert.ok(axis.shortDefinition.length > 0);
  }
  const ids = CARDS.map((c) => c.id);
  assert.deepEqual(ids, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  for (const card of CARDS) {
    assert.ok(card.text.length > 0);
    assert.ok(card.feedback.length > 0);
  }
});

test('Embaralhamento preserva todos os 12 IDs sem duplicatas', () => {
  const shuffled = shuffleCardIds();
  assert.equal(shuffled.length, 12);
  assert.deepEqual([...shuffled].sort((a, b) => a - b), [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  ]);
});

test('Pontuação: todas corretas (12/12), todas incorretas (0/12) e parcial', () => {
  const allCorrect: Record<number, (typeof CARDS)[number]['correctAxis']> = {};
  const allWrong: Record<number, (typeof CARDS)[number]['correctAxis']> = {};
  const partial: Record<number, (typeof CARDS)[number]['correctAxis']> = {};

  for (const card of CARDS) {
    allCorrect[card.id] = card.correctAxis;
    allWrong[card.id] =
      card.correctAxis === 'pensamento_computacional'
        ? 'mundo_digital'
        : 'pensamento_computacional';
    partial[card.id] =
      card.id <= 7 ? card.correctAxis : allWrong[card.id];
  }

  assert.equal(calculateScore(allCorrect), 12);
  assert.equal(calculateScore(allWrong), 0);
  assert.equal(calculateScore(partial), 7);
  assert.deepEqual(
    getIncorrectCardIds([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], partial),
    [8, 9, 10, 11, 12]
  );
});

test('Detecção de cartões pendentes na revisão', () => {
  const order = [3, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const answers = {
    3: 'pensamento_computacional' as const,
    1: 'pensamento_computacional' as const,
    // 2 e 4 faltando
    5: 'mundo_digital' as const,
  };
  const missing = getUnansweredIndices(order, answers);
  assert.equal(missing[0], 2); // índice do cartão ID 2
  assert.equal(missing.length, 9);
});

test('Exportação textual: formato exato sem revisão, com trim e sem seção proibida', () => {
  const answers: Record<number, (typeof CARDS)[number]['correctAxis']> = {};
  for (const card of CARDS) {
    answers[card.id] = card.correctAxis;
  }

  const text = buildExportText({
    studentName: '  Ana Clara & João <script>  ',
    studentClass: '  1ª A  ',
    studentSchool: '  E.E. Modelo Central  ',
    firstAttemptScore: 10,
    revisionCompleted: false,
    revisionScore: null,
    currentAnswers: answers,
  });

  assert.ok(text.includes('ATIVIDADE AULA 1: QUAL É O EIXO?'));
  assert.ok(text.includes('Nome: Ana Clara & João <script>.'));
  assert.ok(text.includes('Turma: 1ª A.'));
  assert.ok(text.includes('Escola: E.E. Modelo Central.'));
  assert.ok(text.includes('Resultado da primeira tentativa: 10 de 12.'));
  assert.ok(text.includes('Revisão: não realizada'));
  assert.ok(text.includes('Pensamento Computacional: cartões 1, 2, 3, 4.'));
  assert.ok(text.includes('Mundo Digital: cartões 5, 6, 7, 8.'));
  assert.ok(text.includes('Cultura Digital: cartões 9, 10, 11, 12.'));
  assert.equal(text.includes('Situações classificadas'), false);
});

test('Exportação textual: formato após revisão', () => {
  const answers: Record<number, (typeof CARDS)[number]['correctAxis']> = {};
  for (const card of CARDS) {
    answers[card.id] = card.correctAxis;
  }

  const text = buildExportText({
    studentName: 'Mariana',
    studentClass: '1ª B',
    studentSchool: 'Escola Estadual',
    firstAttemptScore: 8,
    revisionCompleted: true,
    revisionScore: 12,
    currentAnswers: answers,
  });

  assert.ok(text.includes('Resultado da primeira tentativa: 8 de 12.'));
  assert.ok(text.includes('Resultado após revisão: 12 de 12.'));
  assert.equal(text.includes('Revisão: não realizada'), false);
});

test('Validação de estado salvo: aceita válido e rejeita corrompido ou versão incompatível', () => {
  const fresh = createFreshGameState('classify');
  fresh.currentAnswers[1] = 'pensamento_computacional';
  assert.deepEqual(validatePersistedState(fresh), fresh);

  assert.equal(validatePersistedState(null), null);
  assert.equal(
    validatePersistedState({ ...fresh, contentVersion: CONTENT_VERSION + 1 }),
    null
  );
  assert.equal(
    validatePersistedState({ ...fresh, cardOrder: [1, 2, 3] }),
    null
  );
  assert.equal(
    validatePersistedState({ ...fresh, screen: 'result', firstAttemptScore: null }),
    null
  );
});

test('Persistência: grava/recupera estado, preserva outras chaves no localStorage e trata storage bloqueado', () => {
  const mockStore = new Map<string, string>();
  mockStore.set('outro_app_chave', 'nao_apagar');

  const fakeWindow = {
    localStorage: {
      getItem: (k: string) => mockStore.get(k) ?? null,
      setItem: (k: string, v: string) => mockStore.set(k, v),
      removeItem: (k: string) => mockStore.delete(k),
      clear: () => {
        throw new Error('clear() não deve ser chamado');
      },
    },
  };

  (globalThis as unknown as { window: unknown }).window = fakeWindow;

  const state = createFreshGameState('classify');
  state.currentAnswers[1] = 'pensamento_computacional';
  assert.equal(savePersistedState(state), true);

  const loaded = loadPersistedState();
  assert.equal(loaded.storageAvailable, true);
  assert.deepEqual(loaded.state, state);

  // Limpar deve remover apenas STORAGE_KEY
  assert.equal(clearPersistedState(), true);
  assert.equal(mockStore.has(STORAGE_KEY), false);
  assert.equal(mockStore.get('outro_app_chave'), 'nao_apagar');

  // Simular armazenamento bloqueado
  (globalThis as unknown as { window: unknown }).window = {
    localStorage: {
      getItem: () => {
        throw new Error('SecurityError');
      },
      setItem: () => {
        throw new Error('SecurityError');
      },
      removeItem: () => {
        throw new Error('SecurityError');
      },
    },
  };

  const blocked = loadPersistedState();
  assert.equal(blocked.storageAvailable, false);
  assert.equal(blocked.state, null);
  assert.equal(savePersistedState(state), false);
});

test('Exportação HTML: escapa marcação HTML e diagrama eixos sem seção proibida', () => {
  const answers: Record<number, (typeof CARDS)[number]['correctAxis']> = {};
  for (const card of CARDS) {
    answers[card.id] = card.correctAxis;
  }

  const html = buildExportHtml({
    studentName: 'Ana <script>alert(1)</script>',
    studentClass: '1ª A',
    studentSchool: 'Escola & Saberes',
    firstAttemptScore: 11,
    revisionCompleted: true,
    revisionScore: 12,
    currentAnswers: answers,
  });

  assert.ok(html.includes('Ana &lt;script&gt;alert(1)&lt;/script&gt;'));
  assert.ok(html.includes('Escola &amp; Saberes'));
  assert.equal(html.includes('<script>'), false);
  assert.ok(html.includes('11 de 12'));
  assert.ok(html.includes('12 de 12'));
  assert.equal(html.includes('Situações classificadas'), false);
});

test('Validação de URL_ABRIR_DOCS', () => {
  assert.equal(URL_ABRIR_DOCS, 'https://docs.google.com/document/create');
  assert.ok(getValidatedDocsUrl(URL_ABRIR_DOCS)?.startsWith('https://'));
  assert.equal(getValidatedDocsUrl(''), null);
  assert.equal(getValidatedDocsUrl('   '), null);
  assert.equal(getValidatedDocsUrl('http://insecure.example.com'), null);
  assert.equal(getValidatedDocsUrl('javascript:alert(1)'), null);
});
