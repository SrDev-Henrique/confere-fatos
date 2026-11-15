# Transcrição

Vídeo de 57 s. A transcrição é um índice do áudio, não um substituto. Foram feitas quatro transcrições automáticas com o Whisper local, em português:

| Versão | Áudio | Modelo | Arquivo |
| --- | --- | --- | --- |
| A | republicação (`audio.wav`) | `small` | `midia/audio.srt` |
| B | republicação (`audio.wav`) | `medium` | `midia/medium/audio.srt` |
| C | republicação (`audio.wav`) | `large-v3-turbo` | `midia/turbo/audio.srt` |
| D | original (`audio-original.wav`) | `large-v3-turbo` | `midia/turbo-original/audio-original.srt` |

O texto abaixo segue a versão D (áudio do original, sem recompressão), com a minutagem dela. Onde as versões divergem, a divergência está anotada, e os quatro trechos citados na apuração foram recortados e retranscritos em separado (seção "Conferência dos trechos citados").

Erros evidentes da versão A (`small`), descartados: "pra fecha" [00:33] é "pra festa"; "aí pra fecha" [00:35] é "a ir pra festa"; "Ponto, passe isso" [00:52] é "Ponto, paciência"; "nunca vai te dar em faculdade" [00:54] é "nunca vai estudar em faculdade".

## Fala

Quem fala é uma pessoa só, Zacharias Vieira, do começo ao fim. Não há narração nem fala de Luiz Bacci na republicação.

[00:00] Eu não deixarei minha filha estudar em faculdade pública, em hipótese alguma, e é por isso que eu trabalho tanto.
[00:06] E eu vou te explicar o porquê.
[00:07] A faculdade pública hoje, ela virou um centro de doutrinação. (divergência: ver conferência, trecho 1)
[00:12] Você deve conhecer pessoas que entraram na faculdade pública sem ter nenhum tipo de viés político,
[00:17] viés ideológico, não era nem de direita nem de esquerda.
[00:20] E essa pessoa se transformou e virou um puta esquerdista.
[00:23] E eu não quero isso pra minha filha.
[00:25] Não quero.
[00:26] É muito difícil você ir contra o sistema e contra o ambiente.
[00:28] Você é a média das pessoas com quem você convive. (divergência: ver conferência, trecho 3)
[00:30] Acabou, não tem como você fugir disso.
[00:32] Se você convive com pessoas que vão pra festa todos os dias, você vai ser a próxima a ir pra festa todos os dias.
[00:37] Se você convive com pessoas que gostam de treinar, se alimentar bem, você vai ser a próxima pessoa a se alimentar e treinar.
[00:43] É isso.
[00:43] Agora, se você convive em um ambiente que é cercado por esquerdistas, por pessoas que defendem Che Guevara, que defendem Fidel Castro, que defendem o comunismo, você vai ser a próxima. (divergência de concordância: ver conferência, trecho 4)
[00:52] Ponto, paciência.
[00:53] Então, por esse motivo, minha filha nunca vai estudar em faculdade pública.
[00:55] Se Deus permitir.

## Texto em tela

Lido nos quadros de `midia/quadros/` (republicação, um a cada 2 s) e `midia/quadros-original/` (original, um a cada 4 s). Os textos ficam fixos do primeiro ao último quadro.

No original e na republicação:

- "Minha filha não vai estudar em universidade pública" (legenda sobreposta pelo autor, no alto do quadro).

Só na republicação (moldura do Bacci Notícias):

- Selo "BACCI NOTÍCIAS" no canto superior direito.
- Manchete: "PAI DESCARTA FACULDADE PÚBLICA PARA A FILHA POR RECEIO DOS 'ESQUERDISTAS': 'CENTRO DE DOUTRINAÇÃO'".
- Rodapé: "YOUTUBE.COM/@BNTVBRASIL", "A TV QUE FAZ POR VOCÊ!" e o selo "BN TV", com a foto de Luiz Bacci.

Não há slides, gráficos, números nem citação de fonte em tela.

## Conferência dos trechos citados

Os quatro trechos foram recortados do áudio original (`midia/trechos/*.wav`) e retranscritos com os modelos `medium` e `large-v3-turbo` (`midia/trechos/medium/` e `midia/trechos/large-v3-turbo/`). Com as quatro transcrições integrais, cada trecho tem seis versões.

| Trecho | Minuto | Texto adotado | O que as seis versões mostram | Situação |
| --- | --- | --- | --- | --- |
| 1 | 00:06 a 00:11 | "A faculdade pública hoje virou um centro de doutrinação." | "virou um centro de doutrinação" é igual nas seis. Duas (A e C) trazem "hoje, **ela** virou"; quatro (B, D e os dois recortes) trazem "hoje virou". | Núcleo conferido. **A conferir no áudio** se há o "ela" (não muda o sentido). |
| 2 | 00:12 a 00:23 | "Você deve conhecer pessoas que entraram na faculdade pública sem ter nenhum tipo de viés político, viés ideológico, não era nem de direita nem de esquerda. E essa pessoa se transformou e virou um puta esquerdista." | Igual nas seis, palavra por palavra. | Conferido. |
| 3 | 00:26 a 00:32 | "Você é a média das pessoas com quem você convive. Acabou, não tem como você fugir disso." | "Acabou, não tem como você fugir disso" é igual nas seis. Três (A, B e o recorte `medium`) trazem "das pessoas **que** você convive"; três (C, D e o recorte `large-v3-turbo`) trazem "das pessoas **com quem** você convive". A versão C abre com "Gente,". | Núcleo conferido. **A conferir no áudio** se ele diz "que" ou "com quem" (não muda o sentido). |
| 4 | 00:43 a 00:53 | "se você convive em um ambiente que é cercado por esquerdistas, por pessoas que defendem Che Guevara, que defendem Fidel Castro, que defendem o comunismo, você vai ser a próxima." | "cercado por esquerdistas", "Che Guevara", "Fidel Castro", "o comunismo" e "você vai ser a próxima" são iguais nas seis. Quatro trazem "defendem" nas três ocorrências; a D traz "defendem ... defende ... defende"; a A traz "defende o Che Guevara, que defende o Fidel Castro". | Núcleo conferido. **A conferir no áudio** a concordância ("defendem" ou "defende"), que não muda o sentido. |

Os três pontos marcados são palavras de ligação ou concordância. Nenhuma versão diverge em nome próprio, em número ou no conteúdo das frases. Antes de publicar, uma pessoa precisa ouvir os três pontos (cerca de dez segundos de áudio no total) e ajustar a citação se for o caso.
