---
# Modelo de checagem. Arquivos que começam com "_" são ignorados pelo site.
# Cada checagem é uma afirmação feita no conteúdo de um artigo. Copie este
# arquivo para content/checagens/ com um nome curto e sem acentos.

# Nome do arquivo do artigo, sem .md, e a posição da afirmação nele.
artigo: nome-do-artigo
ordem: 1

titulo: "Título da checagem, de preferência com o veredito"
# Uma frase curta com a conclusão. Aparece nos cartões da capa.
resumo: "Uma frase que explica a conclusão."
data: 2026-01-31
# atualizado: 2026-02-15   # Descomente quando corrigir ou atualizar o texto.

# Um destes: verdadeiro | impreciso | enganoso | sem-evidencias | falso
veredito: falso

# Use ==assim== para destacar um trecho com o marcador rosa.
alegacao: "A frase exata, ou bem próxima, do que foi dito, com ==o trecho principal== destacado."

tags: [Tema 1, Tema 2]

# Pelo menos uma fonte é obrigatória.
fontes:
  - titulo: "Nome do veículo ou órgão: título da matéria ou documento"
    url: https://exemplo.com
---

## O que diz a publicação

Contexto de onde e quando a afirmação apareceu.

## O que mostram os fatos

Explicação com dados, decisões e documentos. ==Trechos entre sinais de igual duplos== ganham o marcador rosa.

> Citações em bloco viram o cartão branco de citação.

## Conclusão

Resumo do veredito em poucas frases.
