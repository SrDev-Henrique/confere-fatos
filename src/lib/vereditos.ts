export const VEREDITOS = [
  "verdadeiro",
  "impreciso",
  "enganoso",
  "sem-evidencias",
  "falso",
] as const;

export type Veredito = (typeof VEREDITOS)[number];

type DefinicaoVeredito = {
  rotulo: string;
  descricao: string;
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
    nota: 5,
    classes: "bg-papel text-tinta ring-[3px] ring-inset ring-tinta",
  },
  impreciso: {
    rotulo: "Impreciso",
    descricao:
      "A informação tem base real, mas contém erros de detalhe, números ou datas que mudam o entendimento.",
    nota: 4,
    classes: "bg-rosa text-tinta",
  },
  enganoso: {
    rotulo: "Enganoso",
    descricao:
      "A informação usa dados reais fora de contexto ou omite elementos essenciais, levando a uma conclusão errada.",
    nota: 2,
    classes: "bg-ameixa text-papel",
  },
  "sem-evidencias": {
    rotulo: "Sem evidências",
    descricao:
      "Não há dados públicos que sustentem a afirmação, e quem a fez não apresentou provas.",
    nota: 2,
    classes: "bg-lavanda text-tinta",
  },
  falso: {
    rotulo: "Falso",
    descricao: "A informação é comprovadamente incorreta.",
    nota: 1,
    classes: "bg-tinta text-papel",
  },
};
