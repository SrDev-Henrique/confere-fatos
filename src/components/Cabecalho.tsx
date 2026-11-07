import Link from "next/link";
import { Suspense } from "react";
import { site } from "@/lib/site";
import { MenuEstatico, MenuPrincipal } from "./MenuPrincipal";

export function Cabecalho() {
  return (
    <header className="border-b-[3px] border-tinta">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="tipo-cartaz bg-tinta px-2.5 pb-1 pt-1.5 text-2xl text-papel sm:text-3xl"
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
