import { DEFINICOES_VEREDITO, type Veredito } from "@/lib/vereditos";

type Tamanho = "rotulo" | "medio" | "bloco" | "cartaz";

const DIMENSOES: Record<Tamanho, string> = {
  // Etiqueta pequena, para legendas e listas.
  rotulo: "inline-block tipo-rotulo px-2 py-1",
  // Caixa média, como o "SIM" e o "NÃO" da capa das referências.
  medio: "inline-flex text-center tipo-cartaz px-3 pb-1.5 pt-2 text-3xl sm:text-4xl",
  // Bloco largo no pé dos cartões, como o "NÃO" sob cada comandante.
  bloco:
    "flex w-full items-center justify-center text-center tipo-cartaz px-4 pb-2.5 pt-3 text-4xl",
  // Bloco grande da página da checagem. O tamanho acompanha a tela para
  // que "SEM EVIDÊNCIAS" e "VERDADEIRO" caibam numa linha no celular.
  cartaz:
    "flex w-full items-center justify-center text-center text-balance tipo-cartaz px-4 pb-5 pt-6 text-[clamp(2.5rem,12vw,6rem)] sm:px-6",
};

type Props = {
  /** Um de: verdadeiro, impreciso, enganoso, sem-evidencias, falso. */
  veredito: Veredito;
  /** Padrão: "rotulo". */
  tamanho?: Tamanho;
  /** Id opcional, para compor nomes acessíveis (aria-labelledby). */
  id?: string;
};

/**
 * Selo de veredito de uma checagem. O nome do veredito sempre aparece escrito.
 * Tamanhos: "rotulo" (etiqueta pequena), "medio" (caixa da capa), "bloco"
 * (largura total, no pé do cartão) e "cartaz" (bloco grande da página).
 */
export function SeloVeredito({ veredito, tamanho = "rotulo", id }: Props) {
  const { rotulo, classes } = DEFINICOES_VEREDITO[veredito];
  return (
    <span id={id} className={`${DIMENSOES[tamanho]} ${classes}`}>
      {rotulo}
    </span>
  );
}
