import Link from "next/link";
import { dataIso, formatarData } from "@/lib/datas";
import { ancoraChecagem, enderecoArtigo } from "@/lib/enderecos";
import type { Artigo } from "@/lib/modelo";
import { textoQuantidade } from "@/lib/placar";
import { CartaoAfirmacao } from "./CartaoAfirmacao";
import { ImagemConteudo } from "./ImagemConteudo";

/**
 * Faixa de um artigo recente: bloco preto com o contexto e os cartões das afirmações.
 * Sobre o fundo preto, o hover dos links usa rosa-claro em vez de ameixa, por contraste.
 */
export function FaixaArtigo({ artigo }: { artigo: Artigo }) {
  const href = enderecoArtigo(artigo.slug);
  return (
    <article className="grid grid-cols-[minmax(0,1fr)] border-b-[6px] border-tinta min-[900px]:grid-cols-[380px_minmax(0,1fr)]">
      <div className="flex flex-col bg-tinta text-papel sm:max-[899px]:grid sm:max-[899px]:grid-cols-2">
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden={artigo.imagem ? undefined : true}
          className="block"
        >
          <ImagemConteudo
            imagem={artigo.imagem}
            fundo="escuro"
            sizes="(min-width: 900px) 380px, (min-width: 640px) 50vw, 100vw"
            etiqueta={
              <span className="tipo-rotulo bg-papel px-[7px] py-[3px] text-[0.6875rem] text-tinta">
                {artigo.tipo} · {artigo.origem.plataforma}
              </span>
            }
          />
        </Link>
        <div className="flex flex-1 flex-col gap-3 px-7 pb-7 pt-6">
          <p className="tipo-rotulo text-[0.6875rem] text-rosa-claro">
            <time dateTime={dataIso(artigo.data)} className="whitespace-nowrap">
              {formatarData(artigo.data)}
            </time>
            {artigo.rascunho && (
              <span className="ml-2 inline-block border border-dashed border-rosa-claro px-1.5 py-0.5 text-[0.625rem]">
                Rascunho
              </span>
            )}
          </p>
          <p className="tipo-nome text-[clamp(1.625rem,8vw,2.125rem)] leading-[.95] [overflow-wrap:anywhere]">
            {artigo.pessoa}
          </p>
          <p className="tipo-titulo -mt-1.5 text-lg">{artigo.qualificacao}</p>
          <h3 className="tipo-manchete mt-2 text-balance text-2xl leading-[1.1]">
            <Link href={href} className="hover:text-rosa-claro">
              {artigo.titulo}
            </Link>
          </h3>
          <p className="text-sm leading-[1.55] text-papel-apagado">{artigo.contexto}</p>
          <div className="mt-auto flex items-center justify-between gap-4 pt-2">
            <span className="tipo-rotulo text-[0.6875rem] text-rosa-claro">
              {textoQuantidade(artigo.checagens.length, "checagem", "checagens")}
            </span>
            <Link
              href={href}
              className="tipo-rotulo text-xs text-papel underline decoration-rosa decoration-2 underline-offset-4 hover:text-rosa-claro"
            >
              Ler artigo <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      <ul
        role="list"
        aria-label={`Afirmações checadas em: ${artigo.titulo}`}
        className="grid content-start gap-4 bg-areia p-3 sm:p-6 [grid-template-columns:repeat(auto-fill,minmax(min(280px,100%),1fr))]"
      >
        {artigo.checagens.map((checagem) => (
          <li key={checagem.slug} className="flex">
            <CartaoAfirmacao checagem={checagem} href={`${href}#${ancoraChecagem(checagem.ordem)}`} />
          </li>
        ))}
      </ul>
    </article>
  );
}
