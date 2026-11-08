import Link from "next/link";
import { dataIso, formatarData } from "@/lib/datas";
import { ancoraChecagem, enderecoArtigo } from "@/lib/enderecos";
import type { Artigo } from "@/lib/modelo";
import { BarraPlacar } from "./BarraPlacar";
import { ImagemConteudo } from "./ImagemConteudo";
import { SeloVeredito } from "./SeloVeredito";
import { TextoComDestaques } from "./TextoComDestaques";

/**
 * Artigo no topo da capa: contexto à esquerda, uma linha por afirmação à direita.
 * O título é h3 porque fica abaixo do h2 "Em destaque" da capa.
 */
export function ArtigoDestaque({ artigo }: { artigo: Artigo }) {
  const href = enderecoArtigo(artigo.slug);
  return (
    <article className="grid grid-cols-[minmax(0,1fr)] border-b-[6px] border-tinta bg-branco lg:grid-cols-2">
      <div className="flex flex-col gap-5 border-b-2 border-papel p-4 sm:p-9 lg:border-b-0 lg:border-r-2">
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden={artigo.imagem ? undefined : true}
          className="block"
        >
          <ImagemConteudo
            imagem={artigo.imagem}
            fundo="claro"
            sizes="(min-width: 1024px) 528px, 100vw"
            prioridade
            classeEtiqueta="bottom-3.5 right-3.5"
            etiqueta={
              artigo.tipo === "Vídeo" && artigo.duracao ? (
                <span className="tipo-rotulo bg-tinta px-2 py-1 text-papel">
                  <span className="sr-only">Duração: </span>
                  {artigo.duracao}
                </span>
              ) : undefined
            }
          />
        </Link>
        <p className="tipo-rotulo text-ameixa">
          {artigo.tipo} · {artigo.origem.plataforma} ·{" "}
          <time dateTime={dataIso(artigo.data)} className="whitespace-nowrap">
            {formatarData(artigo.data)}
          </time>
          {artigo.rascunho && (
            <span className="ml-2 inline-block border border-dashed border-ameixa px-1.5 py-0.5 text-[0.625rem]">
              Rascunho
            </span>
          )}
        </p>
        <h3 className="tipo-manchete text-balance text-[clamp(2rem,4vw,2.875rem)] leading-none">
          <Link href={href} className="hover:text-ameixa">
            {artigo.titulo}
          </Link>
        </h3>
        <p className="max-w-[65ch] text-pretty text-lg leading-[1.55] text-grafite">{artigo.contexto}</p>
        <div className="flex max-w-full flex-col gap-1 self-start bg-tinta px-4 py-3 text-papel">
          <span className="tipo-rotulo text-[0.6875rem] text-rosa-claro">Quem disse</span>
          <span className="tipo-nome text-[1.75rem] leading-none [overflow-wrap:anywhere]">
            {artigo.pessoa}
          </span>
          <span className="tipo-titulo">{artigo.qualificacao}</span>
        </div>
        <BarraPlacar checagens={artigo.checagens} />
      </div>

      <div className="flex flex-col">
        <ol role="list" aria-label="Afirmações checadas">
          {artigo.checagens.map((checagem) => {
            const id = `destaque-${checagem.slug}`;
            return (
              <li
                key={checagem.slug}
                className="group relative flex flex-col gap-3 border-b-2 border-papel px-4 py-7 sm:px-9 has-[a:focus-visible]:outline-3 has-[a:focus-visible]:-outline-offset-3 has-[a:focus-visible]:outline-ameixa"
              >
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                  <span id={`${id}-rotulo`} className="tipo-rotulo text-[0.6875rem] text-ameixa">
                    Afirmação {checagem.ordem}
                  </span>
                  <span className="shrink-0">
                    <SeloVeredito id={`${id}-selo`} veredito={checagem.veredito} tamanho="rotulo" />
                  </span>
                </div>
                <p className="tipo-titulo text-2xl leading-[1.2] group-hover:underline group-hover:decoration-rosa group-hover:decoration-2 group-hover:underline-offset-4">
                  <Link
                    href={`${href}#${ancoraChecagem(checagem.ordem)}`}
                    aria-labelledby={`${id}-rotulo ${id}-selo ${id}-alegacao`}
                    className="after:absolute after:inset-0 focus-visible:outline-none"
                  >
                    <span id={`${id}-alegacao`}>
                      “<TextoComDestaques texto={checagem.alegacao} />”
                    </span>
                  </Link>
                </p>
                <p className="text-[0.9375rem] leading-normal text-grafite">{checagem.resumo}</p>
              </li>
            );
          })}
        </ol>
        <div className="mt-auto px-4 py-[1.375rem] sm:px-9">
          <Link
            href={href}
            className="tipo-rotulo underline decoration-rosa decoration-2 underline-offset-4 hover:text-ameixa"
          >
            Ler o artigo completo <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
