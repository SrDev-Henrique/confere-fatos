---
# Modelo de checagem. Arquivos que começam com "_" são ignorados pelo site.
# Para criar uma checagem nova, copie este arquivo para content/checagens/
# com um nome curto e sem acentos, como "nome-da-checagem.md".
# O nome do arquivo vira o endereço: /checagens/nome-da-checagem

titulo: "Título da checagem, de preferência com o veredito"
resumo: "Uma ou duas frases que explicam a conclusão."
data: 2026-01-31
# atualizado: 2026-02-15   # Descomente quando corrigir ou atualizar o texto.

# Um destes: verdadeiro | impreciso | enganoso | sem-evidencias | falso
veredito: falso

# Use ==assim== para destacar um trecho com o marcador rosa.
alegacao: "A frase exata, ou bem próxima, do que foi dito, com ==o trecho principal== destacado."
autorDaAlegacao: "Nome e qualificação de quem disse"
origem:
  plataforma: Instagram
  url: https://www.instagram.com/p/EXEMPLO/
  # data: 2026-01-30       # Data da publicação original, se souber.

tags: [Tema 1, Tema 2]

# Pelo menos uma fonte é obrigatória.
fontes:
  - titulo: "Nome do veículo ou órgão: título da matéria ou documento"
    url: https://exemplo.com

# Rascunhos aparecem só no ambiente local (npm run dev).
# Apague esta linha ou troque para false para publicar.
rascunho: true
---

## O que diz a publicação

Contexto de onde e quando a afirmação apareceu.

## O que mostram os fatos

Explicação com dados, decisões e documentos. ==Trechos entre sinais de igual duplos== ganham o marcador rosa.

> Citações em bloco viram o cartão branco de citação.

## Conclusão

Resumo do veredito em poucas frases.
