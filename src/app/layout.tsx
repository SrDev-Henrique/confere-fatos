import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { Cabecalho } from "@/components/Cabecalho";
import { Rodape } from "@/components/Rodape";
import { openGraphBase, site } from "@/lib/site";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.nome}: ${site.slogan}`,
    template: `%s | ${site.nome}`,
  },
  description: site.descricao,
  openGraph: {
    ...openGraphBase,
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={site.idioma} className={`${archivo.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-tinta focus:px-3 focus:py-2 focus:text-papel"
        >
          Pular para o conteúdo
        </a>
        <Cabecalho />
        <main
          id="conteudo"
          className="mx-auto w-full max-w-6xl flex-1 px-4 pb-20 pt-10 sm:px-6 sm:pt-14"
        >
          {children}
        </main>
        <Rodape />
      </body>
    </html>
  );
}
