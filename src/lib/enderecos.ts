/** Endereço da página de um artigo. */
export function enderecoArtigo(slug: string): string {
  return `/artigos/${slug}`;
}

/** Âncora de uma checagem dentro da página do artigo: afirmacao-1, afirmacao-2... */
export function ancoraChecagem(ordem: number): string {
  return `afirmacao-${ordem}`;
}
