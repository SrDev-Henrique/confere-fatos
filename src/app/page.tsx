import { ArtigoDestaque } from "@/components/ArtigoDestaque";
import { Conteiner } from "@/components/Conteiner";
import { FaixaArtigo } from "@/components/FaixaArtigo";
import { LegendaSelos } from "@/components/LegendaSelos";
import { listarArtigos, separarDestaque } from "@/lib/artigos";
import { textoQuantidade } from "@/lib/placar";

export default function Home() {
  const artigos = listarArtigos();
  const { destaque, recentes } = separarDestaque(artigos);
  const totalChecagens = artigos.reduce((soma, a) => soma + a.checagens.length, 0);

  return (
    <Conteiner>
      <section className="grid items-end gap-12 pb-[72px] pt-12 sm:pt-16 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] xl:gap-20">
        <div className="flex flex-col gap-6">
          <h1 className="tipo-cartaz text-[min(4.5rem,21vw)] leading-[.86] sm:text-[clamp(4.5rem,10.4vw,9.375rem)]">
            Isso é{" "}
            <br />
            verdade?
          </h1>
          <p className="text-xl leading-[1.9]">
            <span className="legenda">A gente responde, sempre com fonte.</span>
          </p>
          <p className="max-w-[540px] text-pretty text-lg text-grafite">
            Analisamos vídeos e publicações que viralizam. Cada artigo reúne o contexto do
            conteúdo e a checagem de cada afirmação feita nele.
          </p>
        </div>
        <LegendaSelos />
      </section>

      {destaque ? (
        <section aria-labelledby="titulo-destaque" className="pb-20">
          <h2 id="titulo-destaque" className="tipo-rotulo mb-7 border-b-4 border-rosa pb-2">
            Em destaque
          </h2>
          <ArtigoDestaque artigo={destaque} />
        </section>
      ) : (
        <p className="pb-24 text-lg text-grafite">Os primeiros artigos serão publicados em breve.</p>
      )}

      {recentes.length > 0 && (
        <section aria-labelledby="titulo-recentes" className="flex flex-col gap-10 pb-24">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b-4 border-rosa pb-2">
            <h2 id="titulo-recentes" className="tipo-rotulo">
              Artigos recentes
            </h2>
            <p className="tipo-rotulo text-ameixa">
              {textoQuantidade(artigos.length, "artigo", "artigos")} ·{" "}
              {textoQuantidade(totalChecagens, "checagem", "checagens")}
            </p>
          </div>
          {recentes.map((artigo) => (
            <FaixaArtigo key={artigo.slug} artigo={artigo} />
          ))}
        </section>
      )}
    </Conteiner>
  );
}
