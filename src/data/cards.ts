export type AxisId =
  | 'pensamento_computacional'
  | 'mundo_digital'
  | 'cultura_digital';

export interface AxisInfo {
  id: AxisId;
  name: string;
  guidingQuestion: string;
  shortDefinition: string;
  shortcut: string;
}

export interface CardItem {
  id: number;
  text: string;
  correctAxis: AxisId;
  feedback: string;
}

export const CONTENT_VERSION = 1;

/**
 * Endereço HTTPS configurado pelo responsável para abrir um novo documento em branco no Google Docs.
 * Deixe vazio ('') caso queira testar ou operar sem link configurado.
 */
export const URL_ABRIR_DOCS = 'https://docs.google.com/document/create';

export function getValidatedDocsUrl(rawUrl: string = URL_ABRIR_DOCS): string | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:') {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

export const MANDATORY_GUIDANCE =
  'Os três eixos se conectam. Neste jogo, escolha o eixo que aparece com mais destaque em cada situação.';

export const AXES: readonly AxisInfo[] = [
  {
    id: 'pensamento_computacional',
    name: 'Pensamento Computacional',
    guidingQuestion: 'Como eu resolvo um problema de forma organizada?',
    shortDefinition:
      'Envolve organizar ideias para resolver problemas: dividir em partes menores, identificar padrões, focar no essencial (abstração) e criar um passo a passo lógico (algoritmo).',
    shortcut: '1',
  },
  {
    id: 'mundo_digital',
    name: 'Mundo Digital',
    guidingQuestion: 'Como os computadores, a internet e os dados funcionam por dentro?',
    shortDefinition:
      'Trata da parte física e técnica da computação: como hardware (processador, memória), redes, Wi-Fi, servidores na nuvem e transmissão de dados funcionam.',
    shortcut: '2',
  },
  {
    id: 'cultura_digital',
    name: 'Cultura Digital',
    guidingQuestion: 'Como a tecnologia muda a vida, o trabalho e a sociedade?',
    shortDefinition:
      'Analisa os impactos da tecnologia na sociedade: convivência online, ética, privacidade, checagem crítica de informações e novas profissões.',
    shortcut: '3',
  },
] as const;

export const AXIS_MAP: Record<AxisId, AxisInfo> = {
  pensamento_computacional: AXES[0],
  mundo_digital: AXES[1],
  cultura_digital: AXES[2],
};

export const CARDS: readonly CardItem[] = [
  {
    id: 1,
    text: 'Dividir o trabalho da feira de ciências em pequenas tarefas e distribuir entre o grupo',
    correctAxis: 'pensamento_computacional',
    feedback: 'O destaque é a decomposição: dividir um problema em partes menores.',
  },
  {
    id: 2,
    text: 'Escrever o passo a passo de uma receita para alguém que nunca cozinhou',
    correctAxis: 'pensamento_computacional',
    feedback: 'O destaque é o algoritmo: organizar uma sequência de passos.',
  },
  {
    id: 3,
    text: 'Notar que todo jogo de plataforma tem pontos, vidas e fases',
    correctAxis: 'pensamento_computacional',
    feedback:
      'O foco da situação é reconhecer padrões entre jogos. A frase é uma simplificação do cartão: nem todo jogo de plataforma precisa ter esses elementos.',
  },
  {
    id: 4,
    text: 'Desenhar o mapa do metrô só com linhas e estações, sem as ruas',
    correctAxis: 'pensamento_computacional',
    feedback:
      'O destaque é a abstração: selecionar as informações necessárias para um objetivo.',
  },
  {
    id: 5,
    text: 'Entender como o Wi-Fi leva a foto do celular até o computador',
    correctAxis: 'mundo_digital',
    feedback: 'O destaque é o funcionamento das redes e da transmissão de dados.',
  },
  {
    id: 6,
    text: 'Descobrir que os arquivos da nuvem ficam guardados em servidores espalhados pelo mundo',
    correctAxis: 'mundo_digital',
    feedback: 'O destaque é a infraestrutura que permite armazenar arquivos na nuvem.',
  },
  {
    id: 7,
    text: 'Saber o que o processador e a memória fazem quando você abre um app',
    correctAxis: 'mundo_digital',
    feedback: 'O destaque é o funcionamento dos componentes do computador.',
  },
  {
    id: 8,
    text: 'Acompanhar o caminho de um e-mail até chegar a quem o recebe',
    correctAxis: 'mundo_digital',
    feedback: 'O destaque é o caminho percorrido pela informação nas redes.',
  },
  {
    id: 9,
    text: 'Checar a fonte de uma notícia antes de compartilhar no grupo',
    correctAxis: 'cultura_digital',
    feedback:
      'O destaque é a análise crítica das informações e o compartilhamento responsável.',
  },
  {
    id: 10,
    text: 'Refletir sobre o impacto do cyberbullying nos grupos de WhatsApp',
    correctAxis: 'cultura_digital',
    feedback: 'O destaque é a convivência e a ética nos ambientes digitais.',
  },
  {
    id: 11,
    text: 'Conhecer profissões que surgiram por causa da tecnologia, como UX designer e cientista de dados',
    correctAxis: 'cultura_digital',
    feedback: 'O destaque é a relação entre tecnologia e mundo do trabalho.',
  },
  {
    id: 12,
    text: 'Decidir se pode postar a foto de um colega sem perguntar',
    correctAxis: 'cultura_digital',
    feedback: 'O destaque é a privacidade e o respeito à imagem de outras pessoas.',
  },
] as const;

export const CARD_BY_ID: Record<number, CardItem> = Object.fromEntries(
  CARDS.map((card) => [card.id, card])
);
