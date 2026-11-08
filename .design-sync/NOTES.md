# Notas da sincronização com o Claude Design

## Como este repositório é sincronizado

- Projeto no Claude Design: "Confere Fatos", https://claude.ai/design/p/5dd49dd8-90bc-45f8-a24b-7c8bb52063c6 (projectId fixado em config.json). Primeira sincronização em 7 de novembro de 2026.
- Re-sincronização: copie de novo os scripts para .ds-sync/, rode npm run build:design-system, baixe _ds_sync.json do projeto para .design-sync/.cache/remote-sync.json e rode node .ds-sync/resync.mjs --config .design-sync/config.json --node-modules ./node_modules --out ./ds-bundle --remote .design-sync/.cache/remote-sync.json.

- O repositório é o site (Next.js 16), não uma biblioteca publicada. O pacote sincronizado é gerado por `npm run build:design-system` (`scripts/build-design-system.mjs`) em `dist-ds/`, que é ignorado pelo git. Rode esse comando antes do conversor.
- Ponto de entrada do pacote: `src/design-system/index.ts`. Escopo combinado com o dono do repositório: só a identidade visual. Entram `SeloVeredito`, `CartaoChecagem` e `TextoComDestaques`. Ficam de fora `Cabecalho`, `MenuPrincipal` e `Rodape`, que dependem do roteador do Next.
- Comandos do conversor (a partir da raiz do repositório):
  - `node .ds-sync/package-build.mjs --config .design-sync/config.json --node-modules ./node_modules --out ./ds-bundle`
  - `node .ds-sync/package-validate.mjs ./ds-bundle`
- Não há Storybook. As pré-visualizações são escritas à mão em `.design-sync/previews/`.

## Correções feitas durante a primeira sincronização

- `next/link` foi trocado no pacote por `src/design-system/link-simples.tsx` (alias do esbuild). O link do Next é CommonJS: empacotado, ele lia `process.env.__NEXT_*` e pedia o React com `require` dinâmico, e as pré-visualizações ficavam vazias. Fora do Next ele só renderiza um `<a>`, que é o que o substituto faz. O site continua usando o `next/link`.
- O script de build falha se sobrar qualquer `process.env.*` no JavaScript gerado.
- `dividirAutor` saiu de `src/lib/artigos.ts` para `src/lib/autor.ts`, porque `artigos.ts` lê arquivos do disco e não pode ir para o navegador. O tipo público do artigo está em `src/lib/modelo.ts`, com uma checagem em tempo de compilação que garante que ele bate com o esquema zod.
- Os tipos do TypeScript são gerados com `tsconfig.design-system.json`, e o build troca os atalhos `@/...` por caminhos relativos.
- A fonte Archivo (OFL) foi baixada do Google Fonts para `src/design-system/fontes/` e entra pelo `extraFonts`. No site ela continua vindo do `next/font`.
- O CSS do pacote (`src/design-system/estilos.css`) importa `src/app/globals.css` e garante, com `@source inline`, todas as cores da paleta e os estilos `tipo-*` e `legenda`.
- Os três componentes usam `cardMode: column`, porque as pré-visualizações são mais largas que a grade padrão.
- As pré-visualizações de cartões brancos ficam dentro de um fundo `bg-papel`; sobre o fundo branco da grade, o cartão perdia o contorno.
- Playwright: o Chromium em cache na máquina é o 1223, que corresponde ao `playwright@1.60.0`. Instale com `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm i playwright@1.60.0` dentro de `.ds-sync/`.

## Limitações conhecidas

- O conversor tira acentos dos resumos na lista de componentes do README gerado ("Carto da listagem"). O filtro está em `lib/dts.mjs` (`jsdocFor`). Não foi feita cópia modificada do conversor; o cabeçalho de convenções lista os componentes com acentos corretos.

## Known render warns

- Nenhum.

## Re-sync risks

- `dtsPropsFor.CartaoChecagem` em `.design-sync/config.json` é uma cópia escrita à mão de `ResumoArtigo` (`src/lib/modelo.ts`). Se o modelo do artigo mudar, atualize os dois.
- Os valores de cores citados em `.design-sync/conventions.md` copiam `src/app/globals.css`. Mudou a paleta, revise o cabeçalho.
- As pré-visualizações usam dados das checagens iniciais (rascunhos). Se esses textos mudarem ou forem apagados, os exemplos continuam válidos, mas podem ficar desatualizados em relação ao site.
- O substituto do `next/link` assume que o cartão só precisa de um `<a>`. Se o cartão passar a usar recursos do `Link` (prefetch, eventos de navegação), revise o substituto.
- A fonte baixada é a versão v25 da Archivo no Google Fonts. Uma nova versão não chega sozinha.
