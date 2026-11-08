import Link from "next/link";
import { site } from "@/lib/site";
import { CLASSE_CONTEINER } from "./Conteiner";

export function Rodape() {
  return (
    <footer className="bg-tinta text-papel">
      <div
        className={`${CLASSE_CONTEINER} flex flex-col gap-8 py-14 sm:flex-row sm:items-end sm:justify-between`}
      >
        <div className="flex max-w-[440px] flex-col gap-3">
          <p className="tipo-cartaz text-[2.5rem]">{site.nome}</p>
          <p className="text-[0.9375rem] leading-normal">{site.descricao}</p>
        </div>
        <Link
          href="/metodologia"
          className="tipo-rotulo -my-3 self-start py-3 text-rosa-claro decoration-rosa decoration-2 underline-offset-4 hover:underline sm:self-auto"
        >
          Como checamos
        </Link>
      </div>
    </footer>
  );
}
