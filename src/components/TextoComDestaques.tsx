import { dividirDestaques } from "@/lib/destaques";

/** Renderiza um texto convertendo ==trechos== em marcador rosa. */
export function TextoComDestaques({ texto }: { texto: string }) {
  return (
    <>
      {dividirDestaques(texto).map((trecho, i) =>
        trecho.destacado ? (
          <mark key={i}>{trecho.texto}</mark>
        ) : (
          <span key={i}>{trecho.texto}</span>
        ),
      )}
    </>
  );
}
