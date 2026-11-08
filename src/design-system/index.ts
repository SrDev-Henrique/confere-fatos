/**
 * Pacote de identidade visual do Confere Fatos, usado para sincronizar os
 * componentes com o Claude Design. Exporta os componentes reais do site que
 * não dependem do roteador do Next. Build: npm run build:design-system.
 */
export { SeloVeredito } from "../components/SeloVeredito";
export { CartaoChecagem } from "../components/CartaoChecagem";
export { TextoComDestaques } from "../components/TextoComDestaques";

export { VEREDITOS, DEFINICOES_VEREDITO } from "../lib/vereditos";
export type { Veredito } from "../lib/vereditos";
export type { ResumoArtigo, Origem, Fonte } from "../lib/modelo";
