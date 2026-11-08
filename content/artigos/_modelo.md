---
# Modelo de artigo. Arquivos que começam com "_" são ignorados pelo site.
# Um artigo descreve um conteúdo (vídeo, post, mensagem) e reúne as checagens
# das afirmações feitas nele. Copie este arquivo para content/artigos/ com um
# nome curto e sem acentos. O nome vira o endereço: /artigos/nome-do-artigo
# Depois crie uma checagem por afirmação em content/checagens/ (veja o modelo lá).

titulo: "O que é verdade no vídeo de Fulano sobre tal assunto"
contexto: "Uma ou duas frases: quem publicou, onde, sobre o quê, e quantas afirmações foram checadas."
data: 2026-01-31
# atualizado: 2026-02-15   # Descomente quando corrigir ou atualizar o texto.

# Um destes: Vídeo | Post | Mensagem
tipo: Vídeo
origem:
  plataforma: Instagram
  url: https://www.instagram.com/p/EXEMPLO/
  # data: 2026-01-30       # Data da publicação original, se souber.
duracao: "2:43"            # Só para vídeos. Apague para posts e mensagens.

# Miniatura 16:9 em public/imagens/artigos/. Sem imagem, a capa mostra um fundo listrado.
imagem:
  src: /imagens/artigos/nome-do-artigo.jpg
  alt: "Descrição do que aparece na imagem"

pessoa: Nome de quem fez as afirmações
qualificacao: advogado     # Ou "perfil anônimo", "página de notícias"...

# destaque: true           # Põe o artigo no topo da capa mesmo que não seja o mais recente.
tags: [Tema 1, Tema 2]

# Rascunhos aparecem só no ambiente local (npm run dev).
# Apague esta linha ou troque para false para publicar.
rascunho: true
---

Texto opcional com mais contexto sobre o conteúdo. Aparece na página do artigo,
antes das afirmações.
