import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import { z } from "zod";
import { remarkDestaque } from "./destaques";
import { VEREDITOS } from "./vereditos";

const PASTA_CHECAGENS = path.join(process.cwd(), "content", "checagens");

const esquemaFrontmatter = z.object({
  titulo: z.string().min(1),
  resumo: z.string().min(1),
  data: z.coerce.date(),
  atualizado: z.coerce.date().optional(),
  veredito: z.enum(VEREDITOS),
  alegacao: z.string().min(1),
  autorDaAlegacao: z.string().min(1),
  origem: z.object({
    plataforma: z.string().min(1),
    url: z.url(),
    data: z.coerce.date().optional(),
  }),
  tags: z.array(z.string()).default([]),
  fontes: z
    .array(z.object({ titulo: z.string().min(1), url: z.url() }))
    .min(1, "Toda checagem precisa de pelo menos uma fonte."),
  rascunho: z.boolean().default(false),
});

export type Frontmatter = z.infer<typeof esquemaFrontmatter>;

export type ResumoArtigo = Frontmatter & { slug: string };

export type Artigo = ResumoArtigo & { html: string };

/**
 * Rascunhos aparecem em `next dev` e ficam fora do build de produção,
 * a menos que INCLUIR_RASCUNHOS=true esteja definido.
 */
function mostrarRascunhos(): boolean {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.INCLUIR_RASCUNHOS === "true"
  );
}

const processadorMarkdown = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkDestaque)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeStringify);

function lerArquivo(slug: string) {
  const caminho = path.join(PASTA_CHECAGENS, `${slug}.md`);
  const bruto = fs.readFileSync(caminho, "utf-8");
  const { data, content } = matter(bruto);
  const resultado = esquemaFrontmatter.safeParse(data);
  if (!resultado.success) {
    throw new Error(
      `Frontmatter inválido em content/checagens/${slug}.md:\n${z.prettifyError(resultado.error)}`,
    );
  }
  return { frontmatter: resultado.data, conteudo: content };
}

function listarSlugs(): string[] {
  return fs
    .readdirSync(PASTA_CHECAGENS)
    .filter((arquivo) => arquivo.endsWith(".md") && !arquivo.startsWith("_"))
    .map((arquivo) => arquivo.replace(/\.md$/, ""));
}

export function listarArtigos(): ResumoArtigo[] {
  return listarSlugs()
    .map((slug) => ({ slug, ...lerArquivo(slug).frontmatter }))
    .filter((artigo) => !artigo.rascunho || mostrarRascunhos())
    .sort((a, b) => b.data.getTime() - a.data.getTime());
}

export function obterArtigo(slug: string): Artigo | null {
  if (!listarSlugs().includes(slug)) return null;
  const { frontmatter, conteudo } = lerArquivo(slug);
  if (frontmatter.rascunho && !mostrarRascunhos()) return null;
  const html = String(processadorMarkdown.processSync(conteudo));
  return { slug, ...frontmatter, html };
}

/** Separa "Nome, qualificação" em duas partes para o bloco do autor. */
export function dividirAutor(autor: string): { nome: string; qualificacao?: string } {
  const virgula = autor.indexOf(",");
  if (virgula === -1) return { nome: autor.trim() };
  return {
    nome: autor.slice(0, virgula).trim(),
    qualificacao: autor.slice(virgula + 1).trim() || undefined,
  };
}
