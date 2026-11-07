import Link from "next/link";
import { CartaoChecagem } from "@/components/CartaoChecagem";
import { SeloVeredito } from "@/components/SeloVeredito";
import { listarArtigos } from "@/lib/artigos";
import { site } from "@/lib/site";
import { VEREDITOS } from "@/lib/vereditos";

export default function Home() {
  const artigos = listarArtigos();

  return (
    <div className="flex flex-col gap-20">
      <section className="flex flex-col gap-7">
        <h1 className="tipo-cartaz text-[clamp(4.5rem,17vw,11rem)]">
          Isso é
          <br />
          verdade?
        </h1>
        <ul className="flex flex-wrap gap-2.5" aria-label="Selos usados nas checagens">
          {VEREDITOS.map((veredito) => (
            <li key={veredito}>
              <SeloVeredito veredito={veredito} tamanho="medio" />
            </li>
          ))}
        </ul>
        <p className="text-xl leading-[1.9] sm:text-2xl">
          <span className="legenda">A gente responde, sempre com fonte.</span>
        </p>
        <p className="max-w-2xl text-lg text-grafite">
          {site.descricao}{" "}
          <Link
            href="/metodologia"
            className="font-semibold text-tinta underline decoration-rosa decoration-2 underline-offset-4 hover:decoration-tinta"
          >
            Veja como checamos e o que cada selo significa.
          </Link>
        </p>
      </section>

      <section aria-labelledby="titulo-checagens">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b-4 border-rosa pb-2">
          <h2 id="titulo-checagens" className="tipo-rotulo whitespace-nowrap text-sm sm:text-base">
            Checagens recentes
          </h2>
          <p className="tipo-rotulo whitespace-nowrap text-ameixa">
            {artigos.length} {artigos.length === 1 ? "checagem" : "checagens"}
          </p>
        </div>
        {artigos.length === 0 ? (
          <p className="mt-8 text-lg text-grafite">
            As primeiras checagens serão publicadas em breve.
          </p>
        ) : (
          <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {artigos.map((artigo) => (
              <CartaoChecagem key={artigo.slug} artigo={artigo} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
