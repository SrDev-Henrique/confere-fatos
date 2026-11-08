import { TextoComDestaques } from "confere-fatos-design-system";

/** A frase checada no cartão branco de citação, com a barra preta embaixo. */
export const CitacaoChecada = () => (
  <div className="bg-papel" style={{ width: 552, padding: 16 }}>
  <figure className="border-b-[6px] border-tinta bg-branco px-5 pb-5 pt-6" style={{ width: 520, margin: 0 }}>
    <blockquote className="tipo-titulo text-2xl" style={{ margin: 0 }}>
      “<TextoComDestaques texto="O Lula foi ==delatado por 181 pessoas==, o mais alto escalão das maiores empreiteiras do Brasil." />”
    </blockquote>
    <figcaption className="mt-4 text-sm text-grafite">Publicação no Instagram</figcaption>
  </figure>
  </div>
);

/** Marcador rosa no meio de um parágrafo, sobre o fundo creme. */
export const ParagrafoComMarcador = () => (
  <p className="bg-papel text-lg" style={{ width: 520, margin: 0, padding: 16 }}>
    <TextoComDestaques texto="Lula foi condenado em ==dois processos== da Operação Lava Jato. ==As duas condenações também deixaram de existir.== Em 2021, o STF anulou as decisões da 13ª Vara Federal de Curitiba." />
  </p>
);

/** Vários trechos destacados numa mesma frase curta. */
export const VariosDestaques = () => (
  <p className="bg-papel tipo-manchete text-3xl" style={{ width: 520, margin: 0, padding: 16 }}>
    <TextoComDestaques texto="O vídeo usa ==dados reais== fora de ==contexto==." />
  </p>
);
