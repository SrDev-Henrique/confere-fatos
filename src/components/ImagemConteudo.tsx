import Image from "next/image";
import type { ReactNode } from "react";
import type { Imagem } from "@/lib/modelo";

type Props = {
  imagem?: Imagem;
  /** Fundo listrado usado quando não há imagem: claro (cartão branco) ou escuro (bloco preto). */
  fundo: "claro" | "escuro";
  /** Largura aproximada em que a imagem aparece, para o carregamento responsivo. */
  sizes: string;
  /** Etiqueta no canto inferior direito, como a duração ou o tipo do conteúdo. */
  etiqueta?: ReactNode;
  /** true para a imagem principal da página: carrega antes das outras. */
  prioridade?: boolean;
  /** Posição da etiqueta. Padrão: 12px do canto. */
  classeEtiqueta?: string;
};

const LISTRAS = {
  claro: "repeating-linear-gradient(135deg, #f4f2f7 0 12px, #ebe7f0 12px 24px)",
  escuro: "repeating-linear-gradient(135deg, #2a2a2a 0 12px, #222222 12px 24px)",
};

/** Miniatura 16:9 do vídeo ou da publicação analisada. */
export function ImagemConteudo({
  imagem,
  fundo,
  sizes,
  etiqueta,
  prioridade,
  classeEtiqueta = "bottom-3 right-3",
}: Props) {
  return (
    <div
      className="relative aspect-video w-full overflow-hidden"
      style={imagem ? undefined : { background: LISTRAS[fundo] }}
    >
      {imagem && (
        <Image
          src={imagem.src}
          alt={imagem.alt}
          fill
          sizes={sizes}
          loading={prioridade ? "eager" : undefined}
          fetchPriority={prioridade ? "high" : undefined}
          className="object-cover"
        />
      )}
      {etiqueta && <div className={`absolute ${classeEtiqueta}`}>{etiqueta}</div>}
    </div>
  );
}
