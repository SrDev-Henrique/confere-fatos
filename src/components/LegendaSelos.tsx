import { DEFINICOES_VEREDITO, VEREDITOS } from "@/lib/vereditos";
import { SeloVeredito } from "./SeloVeredito";

/**
 * "O que cada selo significa": os cinco selos com a descrição curta. A coluna de
 * 290px garante que "Sem evidências" caiba numa linha; não reduza.
 */
export function LegendaSelos() {
  return (
    <section aria-labelledby="titulo-legenda" className="flex flex-col gap-2.5">
      <h2 id="titulo-legenda" className="tipo-rotulo mb-1.5 border-b-4 border-rosa pb-2">
        O que cada selo significa
      </h2>
      <dl className="flex flex-col gap-4 sm:gap-2.5">
        {VEREDITOS.map((veredito) => (
          <div
            key={veredito}
            className="grid items-center gap-x-4 gap-y-1 sm:grid-cols-[290px_minmax(0,1fr)] sm:gap-y-1.5"
          >
            <dt className="grid">
              <SeloVeredito veredito={veredito} tamanho="medio" />
            </dt>
            <dd className="text-[0.9375rem] leading-[1.4] text-grafite">
              {DEFINICOES_VEREDITO[veredito].descricaoCurta}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
