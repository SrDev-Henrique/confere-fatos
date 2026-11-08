import { SeloVeredito } from "confere-fatos-design-system";

const TODOS = ["verdadeiro", "impreciso", "enganoso", "sem-evidencias", "falso"] as const;

/** Etiquetas pequenas, para listas e legendas. */
export const Etiquetas = () => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
    {TODOS.map((v) => (
      <SeloVeredito key={v} veredito={v} tamanho="rotulo" />
    ))}
  </div>
);

/** Caixas da capa, logo abaixo do título "Isso é verdade?". */
export const CaixasDaCapa = () => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, maxWidth: 560 }}>
    {TODOS.map((v) => (
      <SeloVeredito key={v} veredito={v} tamanho="medio" />
    ))}
  </div>
);

/** Blocos de largura total, como no pé de cada cartão de checagem. */
export const BlocosDoCartao = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 10, width: 320 }}>
    {TODOS.map((v) => (
      <SeloVeredito key={v} veredito={v} tamanho="bloco" />
    ))}
  </div>
);

/** Bloco grande da página de uma checagem, sob o rótulo "Veredito". */
export const CartazDaChecagem = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 560 }}>
    <p className="tipo-rotulo">Veredito</p>
    <SeloVeredito veredito="falso" tamanho="cartaz" />
    <p className="text-grafite">A informação é comprovadamente incorreta.</p>
  </div>
);
