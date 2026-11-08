"use client";

import { useEffect } from "react";
import { ehSecaoDoArtigo, focarSecao } from "@/lib/foco";

/**
 * Quando a página abre com a âncora de uma seção (#contexto, #afirmacao-2),
 * leva o foco ao título dela. Assim teclado e leitores de tela começam ali.
 * Outras âncoras, como o link de pular para o conteúdo, ficam com o comportamento normal.
 */
export function FocoNaAncora() {
  useEffect(() => {
    const focar = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (ehSecaoDoArtigo(id)) focarSecao(id);
    };
    focar();
    window.addEventListener("hashchange", focar);
    return () => window.removeEventListener("hashchange", focar);
  }, []);
  return null;
}
