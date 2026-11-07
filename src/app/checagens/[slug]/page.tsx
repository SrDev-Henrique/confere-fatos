import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SeloVeredito } from "@/components/SeloVeredito";
import { TextoComDestaques } from "@/components/TextoComDestaques";
import {
  dividirAutor,
  listarArtigos,
  obterArtigo,
  type Artigo,
} from "@/lib/artigos";
import { dataIso, formatarData } from "@/lib/datas";
import { semDestaques } from "@/lib/destaques";
import { openGraphBase, site } from "@/lib/site";
import { DEFINICOES_VEREDITO } from "@/lib/vereditos";

/*
 * A página inteira é estática: tudo vem de arquivos Markdown lidos no build.
 * Com "navigation", um slug fora da lista espera a renderização completa antes
 * de responder, então notFound() roda antes do envio e o status sai 404.
 */
export const ensureStatic = "navigation";

export function generateStaticParams() {
  const slugs = listarArtigos().map((artigo) => ({ slug: artigo.slug }));
  // Com Cache Components a lista não pode ser vazia. Enquanto não houver
  // checagem publicada, um slug provisório gera apenas uma página 404.
  return slugs.length > 0 ? slugs : [{ slug: "__nenhuma-checagem__" }];
}

export async function generateMetadata({
  params,
}: PageProps<"/checagens/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const artigo = obterArtigo(slug);
  if (!artigo) notFound();
  return {
    title: artigo.titulo,
    description: artigo.resumo,
    alternates: { canonical: `/checagens/${artigo.slug}` },
    robots: artigo.rascunho ? { index: false, follow: false } : undefined,
    openGraph: {
      ...openGraphBase,
      type: "article",
      url: `/checagens/${artigo.slug}`,
      title: artigo.titulo,
      description: artigo.resumo,
      publishedTime: artigo.data.toISOString(),
      modifiedTime: (artigo.atualizado ?? artigo.data).toISOString(),
      tags: artigo.tags,
    },
  };
}

/** Marcação schema.org ClaimReview, usada por buscadores para exibir checagens. */
function claimReview(artigo: Artigo) {
  const definicao = DEFINICOES_VEREDITO[artigo.veredito];
  return {
    "@context": "https://schema.org",
    "@type": "ClaimReview",
    url: `${site.url}/checagens/${artigo.slug}`,
    datePublished: dataIso(artigo.data),
    claimReviewed: semDestaques(artigo.alegacao),
    author: { "@type": "Organization", name: site.nome, url: site.url },
    itemReviewed: {
      "@type": "Claim",
      author: { "@type": "Person", name: dividirAutor(artigo.autorDaAlegacao).nome },
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
}

const CLASSE_LINK =
  "underline decoration-rosa decoration-2 underline-offset-4 hover:decoration-tinta";

function AvisoNovaAba() {
  return <span className="sr-only"> (abre em nova aba)</span>;
}

export default async function PaginaChecagem({
  params,
}: PageProps<"/checagens/[slug]">) {
  const { slug } = await params;
  const artigo = obterArtigo(slug);
  if (!artigo) notFound();
  return <ConteudoChecagem artigo={artigo} />;
}

function ConteudoChecagem({ artigo }: { artigo: Artigo }) {
  const definicao = DEFINICOES_VEREDITO[artigo.veredito];
  const autor = dividirAutor(artigo.autorDaAlegacao);

  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-12">
      {!artigo.rascunho && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(claimReview(artigo)).replace(/</g, "\\u003c"),
          }}
        />
      )}

      {artigo.rascunho && (
        <p className="border-2 border-dashed border-ameixa p-3 text-sm text-grafite">
          Rascunho em revisão. Esta checagem não aparece no site publicado até
          que o campo <code>rascunho</code> seja removido.
        </p>
      )}

      <header className="flex flex-col gap-5">
        <Link
          href="/"
          className={`-my-2 mb-1 self-start py-2 text-sm font-semibold ${CLASSE_LINK}`}
        >
          <span aria-hidden="true">← </span>Todas as checagens
        </Link>
        <p className="tipo-rotulo text-ameixa">
          Checagem ·{" "}
          <time dateTime={dataIso(artigo.data)}>{formatarData(artigo.data)}</time>
          {artigo.atualizado && (
            <>
              {" "}· Atualizada em{" "}
              <time dateTime={dataIso(artigo.atualizado)}>
                {formatarData(artigo.atualizado)}
              </time>
            </>
          )}
        </p>
        <h1 className="tipo-manchete text-[2.5rem] sm:text-6xl">{artigo.titulo}</h1>
        <p className="max-w-[60ch] text-xl leading-relaxed text-grafite">
          {artigo.resumo}
        </p>
      </header>

      <section aria-label="O que foi dito">
        <div className="inline-flex max-w-full flex-col gap-1.5 bg-tinta px-5 pb-4 pt-4 text-papel">
          <p className="tipo-rotulo text-[0.8125rem] text-rosa-claro sm:text-base">
            O que foi dito · {artigo.origem.plataforma}
          </p>
          <p className="tipo-nome text-[1.75rem] sm:text-[2.75rem]">{autor.nome}</p>
          {autor.qualificacao && (
            <p className="tipo-titulo text-base sm:text-lg">{autor.qualificacao}</p>
          )}
        </div>
        <figure className="border-b-[6px] border-tinta bg-branco px-5 pb-5 pt-6 sm:px-7">
          <blockquote className="tipo-titulo text-2xl sm:text-[2rem]">
            “<TextoComDestaques texto={artigo.alegacao} />”
          </blockquote>
          <figcaption className="mt-4 text-sm text-grafite">
            Publicação no {artigo.origem.plataforma}
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
          </figcaption>
        </figure>
      </section>

      <section aria-labelledby="titulo-veredito" className="flex flex-col gap-3">
        <h2 id="titulo-veredito" className="tipo-rotulo">
          Veredito
        </h2>
        <SeloVeredito veredito={artigo.veredito} tamanho="cartaz" />
        <p className="text-grafite">{definicao.descricao}</p>
      </section>

      <div
        className="texto-artigo prose prose-lg"
        dangerouslySetInnerHTML={{ __html: artigo.html }}
      />

      <section aria-labelledby="titulo-fontes" className="flex flex-col gap-4">
        <h2
          id="titulo-fontes"
          className="tipo-rotulo border-b-4 border-rosa pb-2 text-sm sm:text-base"
        >
          Fontes
        </h2>
        <ol className="flex flex-col gap-3">
          {artigo.fontes.map((fonte, i) => (
            <li key={fonte.url} className="flex gap-3">
              <span className="tipo-cartaz w-6 shrink-0 text-2xl text-ameixa">
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
      </section>

      {artigo.tags.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Assuntos">
          {artigo.tags.map((tag) => (
            <li key={tag} className="tipo-rotulo bg-nevoa px-2 py-1 text-grafite">
              {tag}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
