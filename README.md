# Confere Fatos

Blog de checagem de fatos sobre vídeos e publicações que circulam nas redes.
Feito com Next.js 16, React 19, TypeScript, Tailwind CSS 4 e conteúdo em Markdown.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000. No ambiente local, os rascunhos também aparecem, com um selo "Rascunho".

## Publicando um artigo

O conteúdo é organizado em **artigos**. Um artigo descreve um conteúdo (vídeo, post, mensagem),
traz o contexto e reúne várias **checagens**, uma por afirmação feita no conteúdo.

1. Copie `content/artigos/_modelo.md` para `content/artigos/nome-do-artigo.md`.
   O nome do arquivo vira o endereço: `/artigos/nome-do-artigo`.
2. Para cada afirmação, copie `content/checagens/_modelo.md` para `content/checagens/nome-da-checagem.md`,
   com `artigo: nome-do-artigo` e `ordem: 1`, `2`, `3`... na ordem em que aparecem no conteúdo.
3. Ponha a miniatura 16:9 em `public/imagens/artigos/` e aponte o campo `imagem` para ela.
4. Confira no `npm run dev`.
5. Para publicar, apague a linha `rascunho: true` do artigo.

A capa mostra o artigo mais recente (ou o marcado com `destaque: true`) em destaque e os demais em
"Artigos recentes". Na página do artigo, cada afirmação tem a âncora `#afirmacao-1`, `#afirmacao-2`...

Para destacar um trecho com o marcador rosa, escreva `==trecho==`. Funciona no texto e no campo `alegacao`.
Citações em bloco (linhas que começam com `>`) viram o cartão branco de citação.

Arquivos que começam com `_` são ignorados. O build falha, com uma mensagem dizendo o arquivo e o campo, quando:

- algum campo obrigatório falta ou está errado;
- uma checagem aponta para um artigo que não existe;
- a ordem das checagens de um artigo pula números ou se repete;
- um artigo publicado não tem nenhuma checagem;
- a imagem indicada não existe em `public/`.

### Campos do artigo

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `titulo` | sim | Título do artigo |
| `contexto` | sim | Uma ou duas frases de contexto, mostradas na capa |
| `data` | sim | Data de publicação, no formato `AAAA-MM-DD` |
| `atualizado` | não | Data da última correção |
| `tipo` | sim | `Vídeo`, `Post` ou `Mensagem` |
| `origem.plataforma` | sim | Instagram, TikTok, WhatsApp, X etc. |
| `origem.url` | sim | Link da publicação original |
| `origem.data` | não | Data da publicação original |
| `duracao` | não | Duração do vídeo, como `2:43` |
| `imagem.src` e `imagem.alt` | não | Miniatura 16:9 em `public/` e a descrição dela |
| `pessoa` | sim | Quem fez as afirmações |
| `qualificacao` | sim | Por exemplo `advogado` ou `perfil anônimo` |
| `destaque` | não | `true` põe o artigo no topo da capa |
| `tags` | não | Lista de assuntos |
| `rascunho` | não | `true` esconde o artigo do site publicado |

O texto em Markdown abaixo do cabeçalho é opcional e aparece antes das afirmações.

### Campos da checagem

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `artigo` | sim | Nome do arquivo do artigo, sem `.md` |
| `ordem` | sim | Posição da afirmação no artigo: 1, 2, 3... |
| `titulo` | sim | Título da checagem |
| `resumo` | sim | Uma frase curta com a conclusão, mostrada nos cartões |
| `data` | sim | Data da checagem, no formato `AAAA-MM-DD` |
| `atualizado` | não | Data da última correção |
| `veredito` | sim | `verdadeiro`, `impreciso`, `enganoso`, `sem-evidencias` ou `falso` |
| `alegacao` | sim | A frase checada |
| `tags` | não | Lista de assuntos |
| `fontes` | sim | Lista com `titulo` e `url`, pelo menos uma |

### Vereditos

Os selos, cores e textos ficam em `src/lib/vereditos.ts`. A página `/metodologia`, a legenda da capa
e os selos de todo o site são gerados a partir desse arquivo.

## Visual

A identidade segue as referências visuais do projeto: fundo creme, blocos pretos, lavanda, ameixa
e o marcador rosa, com a família Archivo usada em larguras diferentes. A capa segue o handoff do
Claude Design (opção 2a).

As cores e os estilos de texto (`tipo-rotulo`, `tipo-cartaz`, `tipo-nome`, `tipo-manchete`, `tipo-titulo`, `legenda`)
ficam em `src/app/globals.css`. A fonte é carregada em `src/app/layout.tsx`.

## SEO

- Cada afirmação checada inclui uma marcação [ClaimReview](https://schema.org/ClaimReview),
  o formato que buscadores usam para reconhecer checagens de fatos.
- `sitemap.xml` e `robots.txt` são gerados automaticamente, sem os rascunhos.

## Deploy na Vercel

1. Suba o repositório para o GitHub.
2. Na Vercel, importe o repositório. As configurações padrão de Next.js funcionam sem mudanças.
3. Opcional: defina `NEXT_PUBLIC_SITE_URL` (veja `.env.example`) com o domínio final (por exemplo `https://conferefatos.com.br`).
   Sem ela, o site usa o domínio de produção que a Vercel fornece.

Para gerar um build de produção que inclua os rascunhos, use `INCLUIR_RASCUNHOS=true npm run build`.
