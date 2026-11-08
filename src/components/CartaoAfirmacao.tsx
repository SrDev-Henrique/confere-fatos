import Link from "next/link";
import type { Checagem } from "@/lib/modelo";
import { SeloVeredito } from "./SeloVeredito";
import { TextoComDestaques } from "./TextoComDestaques";

type Props = {
  checagem: Pick<Checagem, "slug" | "ordem" | "alegacao" | "resumo" | "veredito">;
  /** Endereço da checagem dentro do artigo, com a âncora. */
  href: string;
};

/**
 * Cartão branco de uma afirmação, com o bloco do veredito no pé. O link fica
 * na frase e cobre o cartão inteiro; o nome acessível é "Afirmação n,
 * veredito, frase", sem o resumo.
 */
export function CartaoAfirmacao({ checagem, href }: Props) {
  const id = `cartao-${checagem.slug}`;
  return (
    <div className="group relative flex flex-1 flex-col bg-branco has-[a:focus-visible]:outline-3 has-[a:focus-visible]:outline-offset-3 has-[a:focus-visible]:outline-ameixa">
      <div className="flex flex-1 flex-col gap-2.5 px-[1.125rem] pb-4 pt-[1.125rem]">
        <span id={`${id}-rotulo`} className="tipo-rotulo text-[0.625rem] text-ameixa">
          Afirmação {checagem.ordem}
        </span>
        <p className="tipo-titulo text-[1.1875rem] leading-[1.22] group-hover:underline group-hover:decoration-rosa group-hover:decoration-2 group-hover:underline-offset-4">
          <Link
            href={href}
            aria-labelledby={`${id}-rotulo ${id}-selo ${id}-alegacao`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            <span id={`${id}-alegacao`}>
              “<TextoComDestaques texto={checagem.alegacao} />”
            </span>
          </Link>
        </p>
        <p className="text-[0.8125rem] leading-[1.45] text-grafite">{checagem.resumo}</p>
      </div>
      <SeloVeredito id={`${id}-selo`} veredito={checagem.veredito} tamanho="bloco" />
    </div>
  );
}
