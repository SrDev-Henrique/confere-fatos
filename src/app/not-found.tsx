import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Página não encontrada" };

export default function NaoEncontrado() {
  return (
    <div className="flex max-w-3xl flex-col items-start gap-6 py-10">
      <p className="tipo-rotulo text-ameixa">Erro 404</p>
      <h1 className="tipo-cartaz text-[clamp(3.5rem,12vw,8rem)]">
        Página não encontrada
      </h1>
      <p className="text-xl leading-[1.9] sm:text-2xl">
        <span className="legenda">Esta checagem não existe ou ainda não foi publicada.</span>
      </p>
      <Link
        href="/"
        className="font-semibold underline decoration-rosa decoration-2 underline-offset-4 hover:decoration-tinta"
      >
        Ver todas as checagens
      </Link>
    </div>
  );
}
