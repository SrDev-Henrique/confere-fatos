export const VEREDITOS = [
  "verdadeiro",
  "impreciso",
  "exagerado",
  "enganoso",
  "sem-evidencias",
  "falso",
] as const;

export type Veredito = (typeof VEREDITOS)[number];

type DefinicaoVeredito = {
  rotulo: string;
  descricao: string;
  /** Versão curta, usada na legenda da capa. */
  descricaoCurta: string;
  /** Nota de 1 (falso) a 5 (verdadeiro), usada no ClaimReview do schema.org. */
  nota: number;
  /**
   * Classes Tailwind do selo. Seguem os blocos das referências:
   * preto como o "NÃO", ameixa como o "APOIO*" e vazado como o "SIM".
   */
  classes: string;
};

export const DEFINICOES_VEREDITO: Record<Veredito, DefinicaoVeredito> = {
  verdadeiro: {
    rotulo: "Verdadeiro",
    descricao: "A informação está correta e é confirmada por fontes confiáveis.",
    descricaoCurta: "A afirmação está correta e é confirmada por fontes.",
    nota: 5,
    classes: "bg-papel text-tinta ring-[3px] ring-inset ring-tinta",
  },
  impreciso: {
    rotulo: "Impreciso",
    descricao:
      "A informação tem base real, mas contém erros de detalhe, números ou datas que mudam o entendimento.",
    descricaoCurta: "Tem base real, mas omite ou erra detalhes.",
    nota: 4,
    classes: "bg-rosa text-tinta",
  },
  exagerado: {
    rotulo: "Exagerado",
    descricao:
      "A informação parte de um fato real e vai na direção certa, mas aumenta o tamanho ou o alcance do que as fontes mostram.",
    descricaoCurta: "Tem base real, mas aumenta o tamanho do fato.",
    nota: 3,
    // Rosa do impreciso com a moldura ameixa do enganoso: fica entre os dois na escala.
    classes: "bg-rosa text-tinta ring-[3px] ring-inset ring-ameixa",
  },
  enganoso: {
    rotulo: "Enganoso",
    descricao:
      "A informação usa dados reais fora de contexto ou omite elementos essenciais, levando a uma conclusão errada.",
    descricaoCurta: "Usa dados reais para levar a uma conclusão errada.",
    nota: 2,
    classes: "bg-ameixa text-papel",
  },
  "sem-evidencias": {
    rotulo: "Sem evidências",
    descricao:
      "Não há dados públicos que sustentem a afirmação, e quem a fez não apresentou provas.",
    descricaoCurta: "Não há dados públicos que sustentem a afirmação.",
    nota: 2,
    classes: "bg-lavanda text-tinta",
  },
  falso: {
    rotulo: "Falso",
    descricao: "A informação é comprovadamente incorreta.",
    descricaoCurta: "A informação é comprovadamente incorreta.",
    nota: 1,
    classes: "bg-tinta text-papel",
  },
};
