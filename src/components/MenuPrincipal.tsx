"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const LINKS_MENU = [
  { href: "/", rotulo: "Checagens" },
  { href: "/metodologia", rotulo: "Como checamos" },
] as const;

const CLASSE_LINK =
  "tipo-rotulo inline-block -my-3 py-3 underline-offset-4 hover:underline aria-[current=page]:underline aria-[current=page]:decoration-2";

function estaAtivo(href: string, caminho: string | null): boolean {
  if (!caminho) return false;
  if (href === "/") return caminho === "/" || caminho.startsWith("/checagens");
  return caminho.startsWith(href);
}

/** Menu com a página atual marcada. Precisa ficar dentro de <Suspense>. */
export function MenuPrincipal() {
  const caminho = usePathname();
  return (
    <ul className="flex gap-6 sm:gap-8">
      {LINKS_MENU.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            aria-current={estaAtivo(link.href, caminho) ? "page" : undefined}
            className={CLASSE_LINK}
          >
            {link.rotulo}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Versão sem marcação de página atual, usada enquanto o menu carrega. */
export function MenuEstatico() {
  return (
    <ul className="flex gap-6 sm:gap-8">
      {LINKS_MENU.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className={CLASSE_LINK}>
            {link.rotulo}
          </Link>
        </li>
      ))}
    </ul>
  );
}
