import { contarVereditos, textoPlacar } from "@/lib/placar";
import type { Veredito } from "@/lib/vereditos";

/** Cor de cada segmento: as mesmas dos selos de veredito. */
const CORES: Record<Veredito, string> = {
  falso: "bg-tinta",
  "sem-evidencias": "bg-lavanda",
  enganoso: "bg-ameixa",
  impreciso: "bg-rosa",
  verdadeiro: "bg-branco border-2 border-tinta",
};

/** Barra com a proporção de vereditos de um artigo e a contagem por extenso. */
export function BarraPlacar({ checagens }: { checagens: { veredito: Veredito }[] }) {
  const segmentos = contarVereditos(checagens);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-3.5 gap-[3px]" aria-hidden="true">
        {segmentos.map((s) => (
          <span key={s.veredito} className={CORES[s.veredito]} style={{ flexGrow: s.quantidade }} />
        ))}
      </div>
      <p className="tipo-rotulo text-[0.6875rem] text-grafite">{textoPlacar(checagens)}</p>
    </div>
  );
}
