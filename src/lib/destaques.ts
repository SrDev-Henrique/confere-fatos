import type { Parent, PhrasingContent, Root, RootContent, Text } from "mdast";

/**
 * Sintaxe do marcador rosa: ==texto destacado==.
 * Funciona no corpo dos artigos (Markdown) e no campo "alegacao".
 * Os sinais precisam estar colados ao texto: ==assim==, não == assim ==.
 */
const PADRAO_DESTAQUE = /(?<!=)==(?=[^\s=])([^=\n]*?[^\s=])==(?!=)/g;

/** Abertura sem par dentro de um nó de texto (o fechamento está num irmão). */
const ABERTURA = /(?<!=)==(?=[^\s=]|$)/;

/** Fechamento num nó de texto que vem depois de negrito, link etc. */
const FECHAMENTO = /(?:^|(?<=[^\s=]))==(?!=)/;

export type TrechoDestaque = { texto: string; destacado: boolean };

/** Divide um texto em trechos normais e destacados. */
export function dividirDestaques(texto: string): TrechoDestaque[] {
  const trechos: TrechoDestaque[] = [];
  let posicao = 0;
  for (const encontro of texto.matchAll(PADRAO_DESTAQUE)) {
    const inicio = encontro.index ?? 0;
    if (inicio > posicao) {
      trechos.push({ texto: texto.slice(posicao, inicio), destacado: false });
    }
    trechos.push({ texto: encontro[1], destacado: true });
    posicao = inicio + encontro[0].length;
  }
  if (posicao < texto.length) {
    trechos.push({ texto: texto.slice(posicao), destacado: false });
  }
  return trechos;
}

/** Remove as marcações ==...==, para usos em texto puro (metadados, SEO). */
export function semDestaques(texto: string): string {
  return texto.replace(PADRAO_DESTAQUE, "$1");
}

/** Nó que o remark-rehype converte em <mark> por causa de data.hName. */
function criarDestaque(filhos: RootContent[]): RootContent {
  return {
    type: "emphasis",
    data: { hName: "mark" },
    children: filhos as PhrasingContent[],
  };
}

function texto(valor: string): Text {
  return { type: "text", value: valor };
}

function temFilhos(no: RootContent): no is RootContent & Parent {
  return "children" in no && Array.isArray(no.children);
}

/** Passo 1: pares completos dentro de um mesmo nó de texto. */
function dividirPares(filhos: RootContent[]): RootContent[] {
  const saida: RootContent[] = [];
  for (const filho of filhos) {
    if (filho.type !== "text" || !filho.value.includes("==")) {
      saida.push(filho);
      continue;
    }
    for (const trecho of dividirDestaques(filho.value)) {
      saida.push(
        trecho.destacado ? criarDestaque([texto(trecho.texto)]) : texto(trecho.texto),
      );
    }
  }
  return saida;
}

/**
 * Passo 2: pares que atravessam negrito, itálico, links ou código, como em
 * "==O STF **anulou** as condenações==". A abertura e o fechamento ficam em
 * nós de texto irmãos, e tudo o que está entre eles entra no destaque.
 */
function unirEntreIrmaos(filhos: RootContent[]): RootContent[] {
  const fila = [...filhos];
  const saida: RootContent[] = [];
  let i = 0;
  while (i < fila.length) {
    const atual = fila[i];
    const abertura = atual.type === "text" ? ABERTURA.exec(atual.value) : null;
    if (atual.type !== "text" || !abertura) {
      saida.push(atual);
      i++;
      continue;
    }

    let j = -1;
    let fechamento: RegExpExecArray | null = null;
    for (let k = i + 1; k < fila.length; k++) {
      const candidato = fila[k];
      if (candidato.type !== "text") continue;
      fechamento = FECHAMENTO.exec(candidato.value);
      if (fechamento) {
        j = k;
        break;
      }
    }
    if (j === -1 || !fechamento) {
      saida.push(atual);
      i++;
      continue;
    }

    const noFechamento = fila[j] as Text;
    const antes = atual.value.slice(0, abertura.index);
    const depois = atual.value.slice(abertura.index + 2);
    const antesDoFechamento = noFechamento.value.slice(0, fechamento.index);
    const resto = noFechamento.value.slice(fechamento.index + 2);

    if (antes) saida.push(texto(antes));
    const conteudo: RootContent[] = [];
    if (depois) conteudo.push(texto(depois));
    conteudo.push(...fila.slice(i + 1, j));
    if (antesDoFechamento) conteudo.push(texto(antesDoFechamento));
    saida.push(criarDestaque(conteudo));

    // O que sobra depois do fechamento volta para a fila: pode abrir outro destaque.
    if (resto) {
      fila[j] = texto(resto);
      i = j;
    } else {
      i = j + 1;
    }
  }
  return saida;
}

function transformar(no: Root | (RootContent & Parent)) {
  for (const filho of no.children) {
    if (temFilhos(filho)) transformar(filho);
  }
  no.children = unirEntreIrmaos(dividirPares(no.children)) as typeof no.children;
}

/** Plugin remark que transforma ==texto== em <mark>texto</mark>. */
export function remarkDestaque() {
  return (arvore: Root) => {
    transformar(arvore);
  };
}
