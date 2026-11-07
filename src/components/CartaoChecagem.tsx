import Link from "next/link";
import { dividirAutor, type ResumoArtigo } from "@/lib/artigos";
import { dataIso, formatarData } from "@/lib/datas";
import { SeloVeredito } from "./SeloVeredito";
import { TextoComDestaques } from "./TextoComDestaques";

/**
 * Cartão da listagem, montado como o quadro dos comandantes nas referências:
 * rótulo, a frase checada, quem disse e o bloco do veredito embaixo.
 */
export function CartaoChecagem({ artigo }: { artigo: ResumoArtigo }) {
  const autor = dividirAutor(artigo.autorDaAlegacao);
  return (
    <article className="@container group relative flex flex-col">
      <div className="flex flex-1 flex-col gap-3 bg-branco p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <p className="tipo-rotulo text-ameixa">{artigo.origem.plataforma}</p>
          {artigo.rascunho && (
            <p className="tipo-rotulo border border-dashed border-ameixa px-1.5 py-0.5 text-[0.625rem] text-ameixa">
              Rascunho
            </p>
          )}
        </div>
        <h3 className="tipo-titulo text-2xl @sm:text-[1.75rem]">
          <Link
            href={`/checagens/${artigo.slug}`}
            className="after:absolute after:inset-0 group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4"
          >
            “<TextoComDestaques texto={artigo.alegacao} />”
          </Link>
        </h3>
        <div className="mt-auto pt-2">
          <p className="tipo-titulo text-lg">{autor.nome}</p>
          <p className="text-sm text-grafite">
            {autor.qualificacao && <>{autor.qualificacao} · </>}
            <time dateTime={dataIso(artigo.data)}>{formatarData(artigo.data)}</time>
          </p>
        </div>
      </div>
      <SeloVeredito veredito={artigo.veredito} tamanho="bloco" />
    </article>
  );
}
