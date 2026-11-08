import type { Metadata } from "next";
import Link from "next/link";
import { Conteiner } from "@/components/Conteiner";

export const metadata: Metadata = { title: "Página não encontrada" };

export default function NaoEncontrado() {
  return (
    <Conteiner className="flex flex-col items-start gap-6 pb-24 pt-16">
      <p className="tipo-rotulo text-ameixa">Erro 404</p>
      <h1 className="tipo-cartaz text-[clamp(3.5rem,12vw,8rem)]">
        Página não encontrada
      </h1>
      <p className="text-xl leading-[1.9] sm:text-2xl">
        <span className="legenda">Este artigo não existe ou ainda não foi publicado.</span>
      </p>
      <Link
        href="/"
        className="font-semibold underline decoration-rosa decoration-2 underline-offset-4 hover:decoration-tinta"
      >
        Ver todos os artigos
      </Link>
    </Conteiner>
  );
}
