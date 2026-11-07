import Link from "next/link";
import { site } from "@/lib/site";

export function Rodape() {
  return (
    <footer className="bg-tinta text-papel">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-12 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div className="flex flex-col gap-3">
          <p className="tipo-cartaz text-4xl">{site.nome}</p>
          <p className="max-w-sm text-sm text-papel/80">{site.descricao}</p>
        </div>
        <Link
          href="/metodologia"
          className="tipo-rotulo -my-3 self-start py-3 text-rosa-claro underline-offset-4 hover:underline sm:self-auto"
        >
          Como checamos
        </Link>
      </div>
    </footer>
  );
}
