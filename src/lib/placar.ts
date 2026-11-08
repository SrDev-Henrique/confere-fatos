import { DEFINICOES_VEREDITO, type Veredito } from "./vereditos";

/** Ordem dos segmentos na barra de placar: do mais grave ao verdadeiro. */
const ORDEM_PLACAR: Veredito[] = ["falso", "sem-evidencias", "enganoso", "impreciso", "verdadeiro"];

/** Espaço não separável: o número nunca se separa da palavra na quebra de linha. */
const NBSP = " ";

export type SegmentoPlacar = { veredito: Veredito; quantidade: number };

/** Conta as checagens por veredito, só com os vereditos presentes. */
export function contarVereditos(checagens: { veredito: Veredito }[]): SegmentoPlacar[] {
  return ORDEM_PLACAR.map((veredito) => ({
    veredito,
    quantidade: checagens.filter((c) => c.veredito === veredito).length,
  })).filter((s) => s.quantidade > 0);
}

/** Ex.: "1 checagem", "4 checagens". */
export function textoQuantidade(n: number, singular: string, plural: string): string {
  return `${n}${NBSP}${n === 1 ? singular : plural}`;
}

/** Ex.: "4 checagens · 1 falso · 1 sem evidências · 2 enganoso". */
export function textoPlacar(checagens: { veredito: Veredito }[]): string {
  const partes = contarVereditos(checagens).map((s) => {
    const rotulo = DEFINICOES_VEREDITO[s.veredito].rotulo.toLowerCase().replaceAll(" ", NBSP);
    return `${s.quantidade}${NBSP}${rotulo}`;
  });
  return [textoQuantidade(checagens.length, "checagem", "checagens"), ...partes].join(" · ");
}
