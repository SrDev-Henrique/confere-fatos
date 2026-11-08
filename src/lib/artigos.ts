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
import { ancoraChecagem } from "./enderecos";
import type { Artigo, ArtigoCompleto, Checagem } from "./modelo";
import { TIPOS_CONTEUDO } from "./modelo";
import { VEREDITOS } from "./vereditos";

const PASTA_ARTIGOS = path.join(process.cwd(), "content", "artigos");
const PASTA_CHECAGENS = path.join(process.cwd(), "content", "checagens");

/** Data no formato AAAA-MM-DD. Um campo vazio dá erro em vez de virar 1970. */
const dataYaml = z.preprocess(
  (v) => (v === null || v === "" ? undefined : v),
  z.coerce.date({ error: "Use uma data no formato AAAA-MM-DD." }),
);

const esquemaArtigo = z.object({
  titulo: z.string().min(1),
  contexto: z.string().min(1),
  data: dataYaml,
  atualizado: dataYaml.optional(),
  tipo: z.enum(TIPOS_CONTEUDO),
  origem: z.object({
    plataforma: z.string().min(1),
    url: z.url(),
    data: dataYaml.optional(),
  }),
  duracao: z
    .string()
    .regex(/^\d{1,2}(:\d{2}){1,2}$/, "Use o formato 2:43 ou 1:02:43.")
    .optional(),
  imagem: z
    .object({
      src: z.string().startsWith("/", "O caminho começa com / e aponta para public/."),
      alt: z.string().min(1),
    })
    .optional(),
  pessoa: z.string().min(1),
  qualificacao: z.string().min(1),
  destaque: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  rascunho: z.boolean().default(false),
});

const esquemaChecagem = z.object({
  artigo: z.string().min(1),
  ordem: z.number().int().positive(),
  titulo: z.string().min(1),
  resumo: z.string().min(1),
  data: dataYaml,
  atualizado: dataYaml.optional(),
  veredito: z.enum(VEREDITOS),
  alegacao: z.string().min(1),
  tags: z.array(z.string()).default([]),
  fontes: z
    .array(z.object({ titulo: z.string().min(1), url: z.url() }))
    .min(1, "Toda checagem precisa de pelo menos uma fonte."),
});

// Garante, em tempo de compilação, que os esquemas e as interfaces públicas
// (src/lib/modelo.ts) continuam iguais.
type DadosArtigo = z.infer<typeof esquemaArtigo>;
type DadosChecagem = z.infer<typeof esquemaChecagem>;
const _artigoIgualAoModelo: (d: DadosArtigo) => Omit<Artigo, "slug" | "checagens"> = (d) => d;
const _checagemIgualAoModelo: (d: DadosChecagem) => Omit<Checagem, "slug"> = (d) => d;
void _artigoIgualAoModelo;
void _checagemIgualAoModelo;

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

type NoHast = { type: string; tagName?: string; children?: NoHast[] };

/**
 * Rebaixa os títulos do Markdown em "niveis" níveis (## vira <h4> com 2).
 * Na página do artigo, o texto de cada checagem fica abaixo de um <h3>.
 */
function rehypeRebaixarTitulos(niveis: number) {
  const visitar = (no: NoHast) => {
    const m = no.type === "element" ? /^h([1-6])$/.exec(no.tagName ?? "") : null;
    if (m) no.tagName = `h${Math.min(6, Number(m[1]) + niveis)}`;
    no.children?.forEach(visitar);
  };
  return () => (arvore: NoHast) => visitar(arvore);
}

/** prefixo: vai na frente dos ids dos títulos, para não repetir entre checagens. */
function criarProcessador(rebaixar: number, prefixo = "") {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkDestaque)
    .use(remarkRehype)
    .use(rehypeRebaixarTitulos(rebaixar))
    .use(rehypeSlug, { prefix: prefixo })
    .use(rehypeStringify);
}

// Prefixo evita colisão com as âncoras da página (contexto, afirmacao-N).
const processadorArtigo = criarProcessador(0, "texto-");

function listarSlugs(pasta: string): string[] {
  return fs
    .readdirSync(pasta)
    .filter((arquivo) => arquivo.endsWith(".md") && !arquivo.startsWith("_"))
    .map((arquivo) => arquivo.replace(/\.md$/, ""));
}

function lerArquivo<T extends z.ZodType>(pasta: string, slug: string, esquema: T) {
  const relativo = path.relative(process.cwd(), path.join(pasta, `${slug}.md`)).replaceAll("\\", "/");
  const { data, content } = matter(fs.readFileSync(path.join(pasta, `${slug}.md`), "utf-8"));
  const resultado = esquema.safeParse(data);
  if (!resultado.success) {
    throw new Error(`Cabeçalho inválido em ${relativo}:\n${z.prettifyError(resultado.error)}`);
  }
  return { dados: resultado.data as z.infer<T>, conteudo: content };
}

type Lido = {
  artigos: Map<string, { dados: DadosArtigo; conteudo: string }>;
  checagens: Map<string, { slug: string; dados: DadosChecagem; conteudo: string }[]>;
};

/** Lê todo o conteúdo e confere as ligações entre artigos e checagens. */
function lerTudo(): Lido {
  const artigos = new Map(
    listarSlugs(PASTA_ARTIGOS).map((slug) => [slug, lerArquivo(PASTA_ARTIGOS, slug, esquemaArtigo)]),
  );
  const checagens: Lido["checagens"] = new Map();
  for (const slug of listarSlugs(PASTA_CHECAGENS)) {
    const lido = lerArquivo(PASTA_CHECAGENS, slug, esquemaChecagem);
    if (!artigos.has(lido.dados.artigo)) {
      throw new Error(
        `content/checagens/${slug}.md aponta para o artigo "${lido.dados.artigo}", que não existe em content/artigos/.`,
      );
    }
    const lista = checagens.get(lido.dados.artigo) ?? [];
    const repetida = lista.find((c) => c.dados.ordem === lido.dados.ordem);
    if (repetida) {
      throw new Error(
        `As checagens ${repetida.slug} e ${slug} têm a mesma ordem (${lido.dados.ordem}) no artigo ${lido.dados.artigo}.`,
      );
    }
    lista.push({ slug, ...lido });
    checagens.set(lido.dados.artigo, lista);
  }
  for (const [artigo, lista] of checagens) {
    const ordens = lista.map((c) => c.dados.ordem).sort((a, b) => a - b);
    if (!ordens.every((o, i) => o === i + 1)) {
      throw new Error(
        `As checagens do artigo ${artigo} devem ter ordem 1, 2, 3... sem pular números ` +
          `(encontrado: ${ordens.join(", ")}; arquivos: ${lista.map((c) => c.slug).join(", ")}).`,
      );
    }
  }
  for (const [slug, { dados }] of artigos) {
    // Um rascunho pode ficar sem checagens enquanto é escrito; publicado, não.
    if (!checagens.get(slug)?.length && !dados.rascunho) {
      throw new Error(`O artigo content/artigos/${slug}.md não tem nenhuma checagem em content/checagens/.`);
    }
    if (dados.imagem && !fs.existsSync(path.join(process.cwd(), "public", dados.imagem.src))) {
      throw new Error(`Imagem não encontrada: public${dados.imagem.src} (content/artigos/${slug}.md).`);
    }
  }
  return { artigos, checagens };
}

function montar(lido: Lido, slug: string, comHtml: boolean) {
  const artigo = lido.artigos.get(slug)!;
  const checagens = [...(lido.checagens.get(slug) ?? [])]
    .sort((a, b) => a.dados.ordem - b.dados.ordem)
    .map((c) => ({
      slug: c.slug,
      ...c.dados,
      ...(comHtml
        ? { html: String(criarProcessador(2, `${ancoraChecagem(c.dados.ordem)}-`).processSync(c.conteudo)) }
        : {}),
    }));
  return {
    slug,
    ...artigo.dados,
    checagens,
    ...(comHtml ? { html: String(processadorArtigo.processSync(artigo.conteudo)) } : {}),
  };
}

/** Artigos visíveis, do mais recente para o mais antigo. */
export function listarArtigos(): Artigo[] {
  const lido = lerTudo();
  return [...lido.artigos.keys()]
    .map((slug) => montar(lido, slug, false) as Artigo)
    // Artigo sem checagem (só rascunho) não entra na capa.
    .filter((artigo) => artigo.checagens.length > 0 && (!artigo.rascunho || mostrarRascunhos()))
    .sort((a, b) => b.data.getTime() - a.data.getTime());
}

/** Separa o artigo da capa (marcado como destaque, ou o mais recente) dos demais. */
export function separarDestaque(artigos: Artigo[]): { destaque?: Artigo; recentes: Artigo[] } {
  const destaque = artigos.find((a) => a.destaque) ?? artigos[0];
  return { destaque, recentes: artigos.filter((a) => a !== destaque) };
}

export function obterArtigo(slug: string): ArtigoCompleto | null {
  const lido = lerTudo();
  if (!lido.artigos.has(slug)) return null;
  const artigo = montar(lido, slug, true) as ArtigoCompleto;
  if (artigo.rascunho && !mostrarRascunhos()) return null;
  return artigo;
}
