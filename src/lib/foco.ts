/** Seções da página do artigo que recebem foco ao serem abertas por âncora. */
const SECAO_DO_ARTIGO = /^(contexto|afirmacao-\d+)$/;

export function ehSecaoDoArtigo(id: string): boolean {
  return SECAO_DO_ARTIGO.test(id);
}

/** Leva o foco ao título da seção (h1, h2 ou h3) sem rolar a página de novo. */
export function focarSecao(id: string): void {
  const alvo = document.getElementById(id);
  const titulo = alvo?.matches("h1, h2, h3") ? alvo : alvo?.querySelector<HTMLElement>("h1, h2, h3");
  titulo?.focus({ preventScroll: true });
}
