import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BarraPlacar } from "@/components/BarraPlacar";
import { Conteiner } from "@/components/Conteiner";
import { FocoNaAncora } from "@/components/FocoNaAncora";
import { ImagemConteudo } from "@/components/ImagemConteudo";
import { ScrollProgress, type ScrollProgressSection } from "@/components/ScrollProgress";
import { SeloVeredito } from "@/components/SeloVeredito";
import { TextoComDestaques } from "@/components/TextoComDestaques";
import { listarArtigos, obterArtigo } from "@/lib/artigos";
import { dataIso, formatarData } from "@/lib/datas";
import { semDestaques } from "@/lib/destaques";
import { ancoraChecagem, enderecoArtigo } from "@/lib/enderecos";
import type { ArtigoCompleto } from "@/lib/modelo";
import { openGraphBase, site } from "@/lib/site";
import { DEFINICOES_VEREDITO } from "@/lib/vereditos";

/*
 * A página inteira é estática: tudo vem de arquivos Markdown lidos no build.
 * Com "navigation", um slug fora da lista espera a renderização completa antes
 * de responder, então notFound() roda antes do envio e o status sai 404.
 */
export const ensureStatic = "navigation";
// O slug é lido fora de <Suspense> de propósito, para o 404 ter status real.
// Isso torna a rota bloqueante, então ela sai da validação de navegação instantânea.
export const instant = false;

export function generateStaticParams() {
  const slugs = listarArtigos().map((artigo) => ({ slug: artigo.slug }));
  // Com Cache Components a lista não pode ser vazia. Enquanto não houver
  // artigo publicado, um slug provisório gera apenas uma página 404.
  return slugs.length > 0 ? slugs : [{ slug: "__nenhum-artigo__" }];
}

export async function generateMetadata({
  params,
}: PageProps<"/artigos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const artigo = obterArtigo(slug);
  if (!artigo) notFound();
  return {
    title: artigo.titulo,
    description: artigo.contexto,
    alternates: { canonical: enderecoArtigo(artigo.slug) },
    robots: artigo.rascunho ? { index: false, follow: false } : undefined,
    openGraph: {
      ...openGraphBase,
      type: "article",
      url: enderecoArtigo(artigo.slug),
      title: artigo.titulo,
      description: artigo.contexto,
      publishedTime: artigo.data.toISOString(),
      modifiedTime: (artigo.atualizado ?? artigo.data).toISOString(),
      tags: artigo.tags,
      ...(artigo.imagem && { images: [{ url: artigo.imagem.src, alt: artigo.imagem.alt }] }),
    },
  };
}

/** Uma marcação schema.org ClaimReview por afirmação checada. */
function claimReviews(artigo: ArtigoCompleto) {
  return artigo.checagens.map((checagem) => {
    const definicao = DEFINICOES_VEREDITO[checagem.veredito];
    return {
      "@context": "https://schema.org",
      "@type": "ClaimReview",
      url: `${site.url}${enderecoArtigo(artigo.slug)}#${ancoraChecagem(checagem.ordem)}`,
      datePublished: dataIso(checagem.data),
      claimReviewed: semDestaques(checagem.alegacao),
      author: { "@type": "Organization", name: site.nome, url: site.url },
      itemReviewed: {
        "@type": "Claim",
        author: { "@type": "Person", name: artigo.pessoa },
        ...(artigo.origem.data && { datePublished: dataIso(artigo.origem.data) }),
        appearance: { "@type": "CreativeWork", url: artigo.origem.url },
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: definicao.nota,
        bestRating: 5,
        worstRating: 1,
        alternateName: definicao.rotulo,
      },
    };
  });
}

const CLASSE_LINK =
  "underline decoration-rosa decoration-2 underline-offset-4 hover:text-ameixa";

function AvisoNovaAba() {
  return <span className="sr-only"> (abre em nova aba)</span>;
}

export default async function PaginaArtigo({ params }: PageProps<"/artigos/[slug]">) {
  const { slug } = await params;
  const artigo = obterArtigo(slug);
  if (!artigo) notFound();

  const secoes: ScrollProgressSection[] = [
    { id: "contexto", label: "Contexto" },
    ...artigo.checagens.map((c) => ({
      id: ancoraChecagem(c.ordem),
      label: `Afirmação ${c.ordem} · ${DEFINICOES_VEREDITO[c.veredito].rotulo}`,
    })),
  ];

  return (
    <Conteiner className="pb-24 pt-10 sm:pt-14">
      <article className="flex flex-col gap-16">
        <FocoNaAncora />
        <ScrollProgress sections={secoes} />
        {!artigo.rascunho && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(claimReviews(artigo)).replace(/</g, "\\u003c"),
            }}
          />
        )}

        {artigo.rascunho && (
          <p className="border-2 border-dashed border-ameixa p-3 text-sm text-grafite">
            Rascunho em revisão. Este artigo não aparece no site publicado até que o campo{" "}
            <code>rascunho</code> seja removido.
          </p>
        )}

        <header id="contexto" className="grid scroll-mt-8 gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="flex flex-col gap-5">
            <Link href="/" className={`-my-2 mb-1 self-start py-2 text-sm font-semibold ${CLASSE_LINK}`}>
              <span aria-hidden="true">← </span>Todos os artigos
            </Link>
            <p className="tipo-rotulo text-ameixa">
              {artigo.tipo} · {artigo.origem.plataforma} ·{" "}
              <time dateTime={dataIso(artigo.data)} className="whitespace-nowrap">
                {formatarData(artigo.data)}
              </time>
              {artigo.atualizado && (
                <>
                  {" "}· Atualizado em{" "}
                  <time dateTime={dataIso(artigo.atualizado)} className="whitespace-nowrap">
                    {formatarData(artigo.atualizado)}
                  </time>
                </>
              )}
            </p>
            <h1
              tabIndex={-1}
              className="tipo-manchete text-balance text-[clamp(2.5rem,5vw,3.5rem)] leading-none focus:outline-none"
            >
              {artigo.titulo}
            </h1>
            <p className="text-pretty text-xl leading-[1.55] text-grafite">{artigo.contexto}</p>
            <div className="flex max-w-full flex-col gap-1 self-start bg-tinta px-4 py-3 text-papel">
              <span className="tipo-rotulo text-[0.6875rem] text-rosa-claro">Quem disse</span>
              <span className="tipo-nome text-[1.75rem] leading-none [overflow-wrap:anywhere]">
                {artigo.pessoa}
              </span>
              <span className="tipo-titulo">{artigo.qualificacao}</span>
            </div>
            <BarraPlacar checagens={artigo.checagens} />
          </div>
          <div className="flex flex-col gap-3">
            <ImagemConteudo
              imagem={artigo.imagem}
              fundo="claro"
              sizes="(min-width: 1024px) 572px, 100vw"
              prioridade
              etiqueta={
                artigo.tipo === "Vídeo" && artigo.duracao ? (
                  <span className="tipo-rotulo bg-tinta px-2 py-1 text-papel">
                    <span className="sr-only">Duração: </span>
                    {artigo.duracao}
                  </span>
                ) : undefined
              }
            />
            <p className="text-sm text-grafite">
              {artigo.tipo} publicado no {artigo.origem.plataforma}
              {artigo.origem.data && <>, em {formatarData(artigo.origem.data)}</>}
              {" · "}
              <a
                href={artigo.origem.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className={`font-semibold text-tinta ${CLASSE_LINK}`}
              >
                Ver original
                <AvisoNovaAba />
              </a>
            </p>
          </div>
        </header>

        {artigo.html.trim() && (
          <div
            className="texto-artigo prose prose-lg"
            dangerouslySetInnerHTML={{ __html: artigo.html }}
          />
        )}

        <section aria-labelledby="titulo-afirmacoes">
          <h2 id="titulo-afirmacoes" className="tipo-rotulo mb-10 border-b-4 border-rosa pb-2">
            As afirmações
          </h2>
          <ol role="list" className="flex flex-col gap-20">
            {artigo.checagens.map((checagem) => {
              const definicao = DEFINICOES_VEREDITO[checagem.veredito];
              return (
                <li
                  key={checagem.slug}
                  id={ancoraChecagem(checagem.ordem)}
                  className="grid scroll-mt-8 gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14"
                >
                  <div className="flex flex-col gap-4 self-start lg:sticky lg:top-8">
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                      <span className="tipo-rotulo text-ameixa">Afirmação {checagem.ordem}</span>
                      <span className="shrink-0">
                        <SeloVeredito veredito={checagem.veredito} tamanho="rotulo" />
                      </span>
                    </div>
                    <h3
                      tabIndex={-1}
                      className="tipo-manchete text-balance text-[1.75rem] leading-[1.05] focus:outline-none"
                    >
                      {checagem.titulo}
                    </h3>
                    <figure className="flex flex-col">
                      <div className="bg-branco px-5 pb-5 pt-6">
                        <p className="tipo-rotulo mb-2 text-[0.6875rem] text-ameixa">O que foi dito</p>
                        <blockquote className="tipo-titulo text-2xl leading-[1.2]">
                          “<TextoComDestaques texto={checagem.alegacao} />”
                        </blockquote>
                        <figcaption className="mt-3 text-sm text-grafite">
                          {artigo.pessoa}, {artigo.qualificacao}
                        </figcaption>
                      </div>
                      <SeloVeredito veredito={checagem.veredito} tamanho="bloco" />
                    </figure>
                    <p className="text-sm text-grafite">
                      <strong className="text-tinta">{definicao.rotulo}:</strong> {definicao.descricao}
                    </p>
                  </div>

                  <div className="flex flex-col gap-8">
                    <p className="text-pretty text-xl leading-[1.5]">{checagem.resumo}</p>
                    <div
                      className="texto-artigo prose prose-lg"
                      dangerouslySetInnerHTML={{ __html: checagem.html }}
                    />
                    <div className="flex flex-col gap-3">
                      <h4 className="tipo-rotulo border-b-4 border-rosa pb-2">Fontes</h4>
                      <ol role="list" className="flex flex-col gap-3">
                        {checagem.fontes.map((fonte, i) => (
                          <li key={fonte.url} className="flex gap-3">
                            <span aria-hidden="true" className="tipo-cartaz w-6 shrink-0 text-2xl text-ameixa">
                              {i + 1}
                            </span>
                            <a
                              href={fonte.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`pt-0.5 ${CLASSE_LINK}`}
                            >
                              {fonte.titulo}
                              <AvisoNovaAba />
                            </a>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {artigo.tags.length > 0 && (
          <ul role="list" className="flex flex-wrap gap-2" aria-label="Assuntos">
            {artigo.tags.map((tag) => (
              <li key={tag} className="tipo-rotulo bg-nevoa px-2 py-1 text-grafite">
                {tag}
              </li>
            ))}
          </ul>
        )}
      </article>
    </Conteiner>
  );
}
