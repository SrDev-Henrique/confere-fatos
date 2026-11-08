# Confere Fatos: how to build with this design system

Confere Fatos is a Brazilian fact-checking blog. Every screen is in **Portuguese (pt-BR)**, sentence case, plain and factual. The look comes from video-explainer graphics: cream paper, black blocks, lavender, plum and a pink highlighter marker.

## Setup

No provider or wrapper component is needed. Link `styles.css` once: it loads the Archivo variable font (width 62–125%, weight 100–900), the color tokens and every class below, and gives `body` the cream background and black text. Put your own content on the cream page; white is only for cards.

## Styling idiom: Tailwind classes compiled into `styles.css`

Only classes present in the compiled CSS work. Use classes for **color and type**, and inline `style` for layout glue (widths, flex, gaps, padding) unless a class below covers it.

| Family | Real names |
|---|---|
| Color, any of `bg-` `text-` `border-` `ring-` `decoration-` `outline-` | `papel` (cream #f1ede2), `tinta` (black #111111), `branco`, `nevoa`, `lavanda` (#9d9aad), `ameixa` (plum #67637d), `rosa` (marker #d7a8bb), `rosa-suave`, `rosa-claro`, `grafite` (secondary text) |
| Type styles | `tipo-cartaz` (ultra-condensed black caps, posters), `tipo-manchete` (condensed bold headlines), `tipo-nome` (condensed caps, person names), `tipo-titulo` (semi-condensed, quotes), `tipo-rotulo` (bold tracked caps labels) |
| Sizes | `text-sm` `text-lg` `text-xl` `text-2xl` `text-4xl` `text-[1.75rem]` |
| Special | `legenda` (black video-caption box; give its `<p>` the class `leading-[1.9]`), `texto-artigo prose prose-lg` (long article text) |

CSS variables also exist: `var(--color-papel)`, `var(--color-tinta)`, `var(--color-ameixa)`, `var(--color-rosa)`, `var(--font-archivo)`.

**Pink marker:** wrap words in `<mark>`, or pass `==trecho==` to `TextoComDestaques`. Use it on the key words of a quote, never on whole paragraphs.

## Components

- `SeloVeredito`: verdict badge. `veredito`: `verdadeiro` | `impreciso` | `enganoso` | `sem-evidencias` | `falso`. `tamanho`: `rotulo` (small label), `medio` (inline box), `bloco` (full-width bar under a card), `cartaz` (big verdict on a check page). Falso is the black block, enganoso plum, sem evidências lavender, impreciso pink, verdadeiro an outlined box. Never recolor verdicts.
- `CartaoChecagem`: listing card for one check. Takes one `artigo` object; `data` fields are `Date` objects; `alegacao` accepts `==trecho==`.
- `TextoComDestaques`: renders text, turning `==trecho==` into the pink marker.

Read `components/<group>/<Name>/<Name>.prompt.md` and `.d.ts` before using a component, and `styles.css` for the full class list.

## Recurring patterns

```jsx
const { SeloVeredito, TextoComDestaques } = window.ConfereFatos;

<section style={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: 24 }}>
  <p className="tipo-rotulo text-ameixa">Checagem · 7 de novembro de 2026</p>
  <h1 className="tipo-manchete" style={{ fontSize: 56 }}>É falso que Lula foi condenado em três processos</h1>

  {/* Person block over a white quote card */}
  <div>
    <div className="bg-tinta text-papel px-5 pt-4 pb-4" style={{ display: "inline-flex", flexDirection: "column", gap: 6 }}>
      <p className="tipo-rotulo text-rosa-claro">O que foi dito · Instagram</p>
      <p className="tipo-nome" style={{ fontSize: 44 }}>Jeffrey Chiquini</p>
      <p className="tipo-titulo text-lg">advogado</p>
    </div>
    <figure className="bg-branco border-b-[6px] border-tinta px-5 pt-6 pb-5" style={{ margin: 0 }}>
      <blockquote className="tipo-titulo text-2xl" style={{ margin: 0 }}>
        “<TextoComDestaques texto="O Lula foi condenado em ==três processos== de corrupção." />”
      </blockquote>
    </figure>
  </div>

  <SeloVeredito veredito="falso" tamanho="cartaz" />
  <p className="leading-[1.9] text-xl"><span className="legenda">A gente responde, sempre com fonte.</span></p>
</section>
```

Section headings are `tipo-rotulo` with a pink rule: `className="tipo-rotulo border-b-4 border-rosa"` plus `style={{ paddingBottom: 8 }}`. Links: `underline decoration-rosa decoration-2 underline-offset-4`.
