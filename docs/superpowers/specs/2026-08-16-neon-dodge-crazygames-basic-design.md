# Neon Dodge — Pacote CrazyGames Basic Launch

## Decisão que enquadra esta etapa

Nenhuma mecânica nova antes de submeter. O core loop atual vai para validação externa; o que se
completa aqui é apenas o pacote mínimo de publicação, para que a submissão não seja reprovada por
entrega incompleta em vez de por mérito do jogo.

O Basic Launch permite submeter sem SDK real e com anúncios desativados, passando por um QA inicial
antes de exposição a audiência limitada.

## Riscos de reprovação atacados

| Risco | Origem | Tratamento |
| --- | --- | --- |
| Capas ausentes | Game Covers exige landscape 1920x1080, portrait 800x1200 e square 800x800 | Geradas pelas tabelas de arte do jogo e rasterizadas em PNG |
| Vídeos preview ausentes | Game Covers exige landscape e portrait em 1080p, 15 a 20 segundos, até 50 MB, sem som | Ferramenta de captura que grava o jogo real abrindo na capa estática |
| Descrição e instruções | Localização em inglês obrigatória | Descrição curta, longa e tabela de controles finalizadas em inglês |
| Posicionamento etário | Audiência de 13 anos ou mais e conformidade PEGI 12; conteúdo dirigido a crianças pode ser rejeitado no QA | O perfil CrazyGames deixa de citar 9 a 12 anos e passa a declarar audiência geral 13+ |
| Branding de outro portal | Gameplay Requirements proíbe branding de outros portais no jogo | Perfil de plataforma neutro por padrão; global da Poki só sob perfil declarado |
| Legibilidade | Avaliada em `devicePixelRatio: 1` entre 907x510 e 1920x1080 | Piso tipográfico de 12 pixels em toda a interface |
| Entrada em gameplay | Máximo de um clique antes do gameplay | Já atendido: o primeiro toque inicia a rodada |

## Perfil de plataforma

O runtime passa a ler `data-platform` do elemento raiz. Valores aceitos: `neutral`, padrão, e `poki`.
Qualquer outro valor recai para `neutral`. Somente o perfil `poki` expõe o global correspondente.
O pacote publicado não declara plataforma alguma.

Isso resolve o conflito entre dois destinos com um único build, sem duplicar código e sem levar o
nome de um portal para dentro do outro.

## Posicionamento etário

O conteúdo já era compatível: não há violência, sangue, combate, armas, morte representada, horror,
jogos de azar, drogas, linguagem ofensiva, conteúdo sexual, conteúdo gerado por usuário nem chat.
O estado de falha é interrupção de sinal, não dano.

A mudança é de comunicação, não de conteúdo. O material voltado ao CrazyGames declara audiência
geral de 13 anos ou mais e conformidade PEGI 12, e não apresenta o jogo como produto para 9 a 12
anos. A estética amigável permanece.

## Fora de escopo

- Mecânicas novas, inimigos novos, modos novos ou economia.
- SDK real, anúncios, eventos de monetização e Full Launch.
- Alteração de core loop, hitbox, curva de dificuldade ou máquina de estados.

## Evidência exigida

- Os três formatos de capa existentes, full bleed, sem borda, sem ícone e sem texto além do título.
- PNG com as dimensões declaradas verificadas no cabeçalho do arquivo.
- Capas reproduzíveis a partir do gerador, sem descolamento do arquivo em disco.
- Nenhum tamanho de fonte abaixo de 12 pixels.
- Nenhuma atribuição incondicional de global de portal e nenhuma menção a portal na interface.
- Pacote de submissão em inglês, declarando 13+, PEGI 12 e os controles por dispositivo.
