import type { AnchorHTMLAttributes } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  prefetch?: boolean | "auto" | null;
  replace?: boolean;
  scroll?: boolean;
};

/**
 * Substitui o next/link no pacote do Claude Design, onde não existe o
 * roteador do Next. Fora do Next, o Link renderiza apenas um <a>; este
 * componente faz o mesmo e ignora as opções de navegação.
 */
export default function Link({ prefetch, replace, scroll, ...props }: Props) {
  void prefetch;
  void replace;
  void scroll;
  return <a {...props} />;
}
