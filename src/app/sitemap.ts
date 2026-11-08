import type { MetadataRoute } from "next";
import { listarArtigos } from "@/lib/artigos";
import { enderecoArtigo } from "@/lib/enderecos";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const artigos = listarArtigos().filter((artigo) => !artigo.rascunho);
  return [
    { url: site.url, lastModified: artigos[0]?.data },
    { url: `${site.url}/metodologia` },
    ...artigos.map((artigo) => ({
      url: `${site.url}${enderecoArtigo(artigo.slug)}`,
      lastModified: artigo.atualizado ?? artigo.data,
    })),
  ];
}
