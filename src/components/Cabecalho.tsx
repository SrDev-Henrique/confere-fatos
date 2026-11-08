import Link from "next/link";
import { Suspense } from "react";
import { site } from "@/lib/site";
import { CLASSE_CONTEINER } from "./Conteiner";
import { MenuEstatico, MenuPrincipal } from "./MenuPrincipal";

export function Cabecalho() {
  return (
    <header className="border-b-2 border-tinta">
      <div
        className={`${CLASSE_CONTEINER} flex flex-wrap items-center justify-between gap-x-10 gap-y-3 py-5`}
      >
        <Link
          href="/"
          className="tipo-cartaz bg-tinta px-3 pb-1 pt-1.5 text-[1.625rem] text-papel sm:text-[2.125rem]"
        >
          {site.nome}
        </Link>
        <nav aria-label="Principal">
          <Suspense fallback={<MenuEstatico />}>
            <MenuPrincipal />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}
