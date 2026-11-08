/** Separa "Nome, qualificação" em duas partes para o bloco do autor. */
export function dividirAutor(autor: string): { nome: string; qualificacao?: string } {
  const virgula = autor.indexOf(",");
  if (virgula === -1) return { nome: autor.trim() };
  return {
    nome: autor.slice(0, virgula).trim(),
    qualificacao: autor.slice(virgula + 1).trim() || undefined,
  };
}
