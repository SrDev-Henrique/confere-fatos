import type { Veredito } from "./vereditos";

/** Onde o conteúdo checado foi publicado. */
export interface Origem {
  /** Rede ou veículo, por exemplo "Instagram". */
  plataforma: string;
  /** Link da publicação original. */
  url: string;
  /** Data da publicação original, se conhecida. */
  data?: Date;
}

/** Uma fonte consultada na checagem. */
export interface Fonte {
  titulo: string;
  url: string;
}

/** Imagem de capa de um artigo: a miniatura do vídeo ou da publicação. */
export interface Imagem {
  /** Caminho a partir de public/, por exemplo /imagens/artigos/x.jpg. */
  src: string;
  alt: string;
}

export const TIPOS_CONTEUDO = ["Vídeo", "Post", "Mensagem"] as const;
export type TipoConteudo = (typeof TIPOS_CONTEUDO)[number];

/** Uma afirmação feita no conteúdo, com o seu veredito. */
export interface Checagem {
  /** Nome do arquivo em content/checagens. */
  slug: string;
  /** Slug do artigo a que a checagem pertence. */
  artigo: string;
  /** Posição dentro do artigo: Afirmação 1, 2, 3... */
  ordem: number;
  titulo: string;
  /** Uma frase curta com a conclusão, mostrada nos cartões. */
  resumo: string;
  data: Date;
  atualizado?: Date;
  veredito: Veredito;
  /** A frase checada. Aceita ==trecho== para o marcador rosa. */
  alegacao: string;
  tags: string[];
  fontes: Fonte[];
}

/**
 * Um artigo descreve um conteúdo (vídeo, post, mensagem), traz o contexto e
 * reúne as checagens das afirmações feitas nele.
 */
export interface Artigo {
  slug: string;
  titulo: string;
  /** Uma ou duas frases de contexto, mostradas na capa. */
  contexto: string;
  data: Date;
  atualizado?: Date;
  tipo: TipoConteudo;
  origem: Origem;
  /** Duração do vídeo, por exemplo "2:43". Só para vídeos. */
  duracao?: string;
  imagem?: Imagem;
  /** Quem fez as afirmações. */
  pessoa: string;
  /** Por exemplo "advogado" ou "perfil anônimo". */
  qualificacao: string;
  /** true coloca o artigo no topo da capa, mesmo que não seja o mais recente. */
  destaque: boolean;
  tags: string[];
  rascunho: boolean;
  /** Em ordem de aparição no conteúdo. */
  checagens: Checagem[];
}

/** Artigo com o texto em HTML, dele e de cada checagem. */
export interface ArtigoCompleto extends Artigo {
  html: string;
  checagens: (Checagem & { html: string })[];
}

/**
 * Dados de uma checagem com a origem e o autor da afirmação. É o formato que o
 * componente CartaoChecagem recebe (sincronizado com o Claude Design).
 */
export interface ResumoArtigo {
  /** Endereço da checagem: /checagens/<slug>. */
  slug: string;
  titulo: string;
  resumo: string;
  data: Date;
  atualizado?: Date;
  veredito: Veredito;
  /** A frase checada. Aceita ==trecho== para o marcador rosa. */
  alegacao: string;
  /** "Nome, qualificação", por exemplo "Jeffrey Chiquini, advogado". */
  autorDaAlegacao: string;
  origem: Origem;
  tags: string[];
  fontes: Fonte[];
  rascunho: boolean;
}
