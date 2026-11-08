// Gera o pacote de identidade visual do Confere Fatos em dist-ds/, a partir
// dos componentes reais do site. Usado pela sincronização com o Claude Design
// (.design-sync/config.json). Uso: npm run build:design-system
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const saida = join(raiz, "dist-ds");
const tipos = join(saida, "types");
const versao = JSON.parse(readFileSync(join(raiz, "package.json"), "utf8")).version;

rmSync(saida, { recursive: true, force: true });
mkdirSync(saida, { recursive: true });

// 1. JavaScript: um módulo ESM, com React como dependência externa.
await build({
  entryPoints: [join(raiz, "src/design-system/index.ts")],
  outfile: join(saida, "index.js"),
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2020",
  jsx: "automatic",
  tsconfig: join(raiz, "tsconfig.json"),
  external: ["react", "react-dom", "react/jsx-runtime"],
  // Fora do Next não há roteador, e o next/link só renderiza um <a>. O pacote
  // usa um link simples equivalente, sem o código de navegação do Next.
  alias: { "next/link": join(raiz, "src/design-system/link-simples.tsx") },
  logLevel: "warning",
});

// O navegador não tem process.env: qualquer referência que sobrar quebra o pacote.
const restantes = [
  ...new Set(readFileSync(join(saida, "index.js"), "utf8").match(/\bprocess\.env\.[A-Za-z0-9_]+/g) ?? []),
];
if (restantes.length) {
  console.error(`Variáveis de ambiente sem valor no pacote: ${restantes.join(", ")}.`);
  process.exit(1);
}

// 2. Tipos: declarações do TypeScript, com o atalho "@/..." trocado por
// caminhos relativos para que funcionem fora do projeto.
execFileSync(process.execPath, [join(raiz, "node_modules/typescript/bin/tsc"), "-p", "tsconfig.design-system.json"], {
  cwd: raiz,
  stdio: "inherit",
});
function listar(dir) {
  return readdirSync(dir).flatMap((nome) => {
    const p = join(dir, nome);
    return statSync(p).isDirectory() ? listar(p) : [p];
  });
}
for (const arquivo of listar(tipos).filter((p) => p.endsWith(".d.ts"))) {
  const texto = readFileSync(arquivo, "utf8").replace(/(from\s+["'])@\/([^"']+)(["'])/g, (_, a, caminho, b) => {
    let rel = relative(dirname(arquivo), join(tipos, caminho)).replaceAll("\\", "/");
    if (!rel.startsWith(".")) rel = `./${rel}`;
    return `${a}${rel}${b}`;
  });
  writeFileSync(arquivo, texto);
}

// 3. CSS: tokens, utilitários e estilos de texto compilados pelo Tailwind.
execFileSync(
  process.execPath,
  [
    join(raiz, "node_modules/@tailwindcss/cli/dist/index.mjs"),
    "-i", "src/design-system/estilos.css",
    "-o", "dist-ds/estilos.css",
  ],
  { cwd: raiz, stdio: "inherit" },
);

// 4. package.json do pacote gerado.
writeFileSync(
  join(saida, "package.json"),
  JSON.stringify(
    {
      name: "confere-fatos-design-system",
      version: versao,
      private: true,
      type: "module",
      module: "index.js",
      types: "types/design-system/index.d.ts",
      style: "estilos.css",
      peerDependencies: { react: ">=19", "react-dom": ">=19" },
    },
    null,
    2,
  ) + "\n",
);

console.log(`Pacote de identidade visual gerado em ${relative(raiz, saida)}/`);
