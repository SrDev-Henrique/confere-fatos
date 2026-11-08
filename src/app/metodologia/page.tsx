import type { Metadata } from "next";
import { Conteiner } from "@/components/Conteiner";
import { SeloVeredito } from "@/components/SeloVeredito";
import { DEFINICOES_VEREDITO, VEREDITOS } from "@/lib/vereditos";

export const metadata: Metadata = {
  title: "Como checamos",
  description: "Como escolhemos, checamos e classificamos as informações.",
};

const etapas = [
  {
    titulo: "Seleção",
    texto:
      "Escolhemos vídeos e publicações com grande alcance ou potencial de causar dano, sem distinção de lado político.",
  },
  {
    titulo: "Separação",
    texto:
      "Transcrevemos o conteúdo e separamos cada afirmação. Opiniões e juízos de valor são identificados, mas não recebem selo, porque não podem ser verdadeiros ou falsos.",
  },
  {
    titulo: "Apuração",
    texto:
      "Cada afirmação factual é comparada com fontes primárias, como decisões judiciais, dados oficiais e documentos, e com veículos de imprensa reconhecidos.",
  },
  {
    titulo: "Classificação",
    texto:
      "A afirmação recebe um dos selos abaixo. As fontes usadas ficam listadas junto de cada afirmação, para que qualquer pessoa possa conferir.",
  },
  {
    titulo: "Correção",
    texto:
      "Se surgirem informações novas ou se cometermos um erro, o artigo é atualizado e a data de atualização aparece no topo.",
  },
];

export default function Metodologia() {
  return (
    <Conteiner className="flex flex-col gap-20 pb-24 pt-12 sm:pt-16">
      <header className="flex max-w-3xl flex-col gap-5">
        <h1 className="tipo-cartaz text-[clamp(3.5rem,12vw,8rem)]">Como checamos</h1>
        <p className="text-xl leading-relaxed text-grafite">
          Cada afirmação passa pelas mesmas cinco etapas e termina com um selo.
          As fontes ficam sempre visíveis para quem quiser conferir.
        </p>
      </header>

      <section aria-labelledby="titulo-etapas">
        <h2 id="titulo-etapas" className="tipo-rotulo border-b-4 border-rosa pb-2 text-sm sm:text-base">
          As etapas
        </h2>
        <ol role="list" className="mt-8 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {etapas.map((etapa, i) => (
            <li key={etapa.titulo} className="flex gap-4">
              <span aria-hidden="true" className="tipo-cartaz w-12 shrink-0 text-8xl leading-[0.8]">
                {i + 1}
              </span>
              <div className="flex flex-col gap-1.5 pt-1">
                <h3 className="tipo-manchete text-2xl">{etapa.titulo}</h3>
                <p className="text-grafite">{etapa.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="titulo-selos">
        <h2 id="titulo-selos" className="tipo-rotulo border-b-4 border-rosa pb-2 text-sm sm:text-base">
          Os selos
        </h2>
        <dl className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {VEREDITOS.map((veredito) => (
            <div key={veredito} className="flex flex-col gap-3">
              <dt>
                <SeloVeredito veredito={veredito} tamanho="bloco" />
              </dt>
              <dd className="text-grafite">{DEFINICOES_VEREDITO[veredito].descricao}</dd>
            </div>
          ))}
        </dl>
      </section>
    </Conteiner>
  );
}
