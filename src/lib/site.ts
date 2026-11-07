function urlDoSite(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.NODE_ENV === "production") {
    console.warn(
      "[Confere Fatos] NEXT_PUBLIC_SITE_URL não definida. Links canônicos, sitemap e " +
        "marcação ClaimReview vão apontar para http://localhost:3000. " +
        "Defina a variável com o domínio final antes de publicar fora da Vercel.",
    );
  }
  return "http://localhost:3000";
}

export const site = {
  nome: "Confere Fatos",
  slogan: "Checagem de fatos sobre o que circula nas redes",
  descricao:
    "Analisamos vídeos e publicações que viralizam e separamos o que é fato, o que é opinião e o que é falso, sempre com fontes.",
  url: urlDoSite().replace(/\/$/, ""),
  idioma: "pt-BR",
} as const;

/** Campos de Open Graph comuns a todas as páginas. O Next não mescla openGraph entre níveis. */
export const openGraphBase = {
  siteName: site.nome,
  locale: "pt_BR",
} as const;
