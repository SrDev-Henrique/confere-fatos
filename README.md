# Confere Fatos

Blog de checagem de fatos sobre vídeos e publicações que circulam nas redes.
Feito com Next.js 16, React 19, TypeScript, Tailwind CSS 4 e artigos em Markdown.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000. No ambiente local, os rascunhos também aparecem, com um selo "Rascunho".

## Publicando uma checagem

1. Copie `content/checagens/_modelo.md` para `content/checagens/nome-da-checagem.md`.
   O nome do arquivo vira o endereço: `/checagens/nome-da-checagem`.
2. Preencha o cabeçalho (frontmatter) e escreva o texto em Markdown.
3. Confira no `npm run dev`.
4. Para publicar, apague a linha `rascunho: true`.

Para destacar um trecho com o marcador rosa, escreva `==trecho==`. Funciona no texto e no campo `alegacao`.
Citações em bloco (linhas que começam com `>`) viram o cartão branco de citação.

Arquivos que começam com `_` são ignorados. Se algum campo obrigatório estiver
faltando ou errado, o build falha com uma mensagem dizendo qual arquivo e qual campo.

### Campos do cabeçalho

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `titulo` | sim | Título da checagem |
| `resumo` | sim | Uma ou duas frases com a conclusão |
| `data` | sim | Data de publicação, no formato `AAAA-MM-DD` |
| `atualizado` | não | Data da última correção |
| `veredito` | sim | `verdadeiro`, `impreciso`, `enganoso`, `sem-evidencias` ou `falso` |
| `alegacao` | sim | A frase checada |
| `autorDaAlegacao` | sim | Quem disse |
| `origem.plataforma` | sim | Instagram, YouTube, TikTok, X etc. |
| `origem.url` | sim | Link da publicação original |
| `origem.data` | não | Data da publicação original |
| `tags` | não | Lista de assuntos |
| `fontes` | sim | Lista com `titulo` e `url`, pelo menos uma |
| `rascunho` | não | `true` esconde a checagem do site publicado |

### Vereditos

Os selos, cores e textos ficam em `src/lib/vereditos.ts`. A página `/metodologia`
e os selos de todo o site são gerados a partir desse arquivo.

## Visual

A identidade segue as referências visuais do projeto: fundo creme, blocos pretos, lavanda, ameixa
e o marcador rosa, com a família Archivo usada em larguras diferentes.

As cores e os estilos de texto (`tipo-rotulo`, `tipo-cartaz`, `tipo-manchete`, `tipo-titulo`, `legenda`) ficam em `src/app/globals.css`.
A fonte é carregada em `src/app/layout.tsx`.

## SEO

- Cada checagem publicada inclui marcação [ClaimReview](https://schema.org/ClaimReview),
  o formato que buscadores usam para reconhecer checagens de fatos.
- `sitemap.xml` e `robots.txt` são gerados automaticamente, sem os rascunhos.

## Deploy na Vercel

1. Suba o repositório para o GitHub.
2. Na Vercel, importe o repositório. As configurações padrão de Next.js funcionam sem mudanças.
3. Opcional: defina `NEXT_PUBLIC_SITE_URL` (veja `.env.example`) com o domínio final (por exemplo `https://conferefatos.com.br`).
   Sem ela, o site usa o domínio de produção que a Vercel fornece.

Para gerar um build de produção que inclua os rascunhos, use `INCLUIR_RASCUNHOS=true npm run build`.
