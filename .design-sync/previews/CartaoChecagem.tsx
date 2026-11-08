import { CartaoChecagem } from "confere-fatos-design-system";

const origem = { plataforma: "Instagram", url: "https://www.instagram.com/p/Defa8HsywBv/" };
const data = new Date("2026-11-07T00:00:00Z");

const base = {
  data,
  origem,
  autorDaAlegacao: "Jeffrey Chiquini, advogado",
  tags: [],
  fontes: [{ titulo: "Supremo Tribunal Federal", url: "https://portal.stf.jus.br" }],
  rascunho: false,
};

/** Afirmação classificada como falsa. */
export const Falso = () => (
  <div className="bg-papel" style={{ width: 340, padding: 16 }}>
    <CartaoChecagem
      artigo={{
        ...base,
        slug: "lula-condenado-tres-processos",
        titulo: "É falso que Lula foi condenado em três processos de corrupção",
        resumo: "Lula foi condenado em dois processos da Lava Jato, e as duas condenações foram anuladas pelo STF em 2021.",
        veredito: "falso",
        alegacao: "O Lula foi condenado em ==três processos== de corrupção.",
      }}
    />
  </div>
);

/** Afirmação sem dados públicos que a sustentem. */
export const SemEvidencias = () => (
  <div className="bg-papel" style={{ width: 340, padding: 16 }}>
    <CartaoChecagem
      artigo={{
        ...base,
        slug: "lula-delatado-181-pessoas",
        titulo: "Não há evidência de que Lula foi delatado por 181 pessoas",
        resumo: "O número não aparece em nenhum registro público.",
        veredito: "sem-evidencias",
        alegacao: "O Lula foi ==delatado por 181 pessoas==, o mais alto escalão das maiores empreiteiras do Brasil.",
      }}
    />
  </div>
);

/** Afirmação enganosa, ainda em revisão (etiqueta "Rascunho"). */
export const EnganosoEmRevisao = () => (
  <div className="bg-papel" style={{ width: 340, padding: 16 }}>
    <CartaoChecagem
      artigo={{
        ...base,
        slug: "julgamento-bolsonaro-turma-stf",
        titulo: "É enganoso dizer que o STF tirou o processo de Bolsonaro do plenário para uma Turma",
        resumo: "A regra que manda ações penais para as Turmas foi aprovada em 2023.",
        veredito: "enganoso",
        alegacao: "Eles ==tiram o processo do plenário== e jogam pra uma turma.",
        rascunho: true,
      }}
    />
  </div>
);
