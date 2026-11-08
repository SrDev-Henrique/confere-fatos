import type { ReactNode } from "react";

/** Área útil de 1200px, centralizada, com margem lateral de 16px no celular e 24px acima. */
export const CLASSE_CONTEINER = "mx-auto w-full max-w-[1248px] px-4 sm:px-6";

export function Conteiner({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`${CLASSE_CONTEINER} ${className}`}>{children}</div>;
}
