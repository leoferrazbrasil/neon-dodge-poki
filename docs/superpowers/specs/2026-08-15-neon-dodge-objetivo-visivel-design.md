# Neon Dodge — Objetivo visível durante a corrida

## Problema

Durante o estado Playing o jogo não comunica objetivo. A interface mostra apenas pontos, recorde e uma dica de controle que permanece na tela a corrida inteira. Os desbloqueios só são resolvidos em `completeRun`, na morte, portanto não existe nenhum momento de recompensa dentro da rodada.

O manual operacional lista `primeira recompensa demorada` e `primeira sessão sem objetivos` entre as causas de reprovação, e a regra final para agentes exige que sempre exista um próximo objetivo. As diretrizes Poki pedem próximo objetivo permanente e ajuste progressivo observável. A ausência atual contraria as três fontes.

## Objetivo

Dar ao jogador percepção contínua do que vem a seguir, sem texto de leitura durante a ação, sem menu adicional e sem alterar o core loop.

## Princípios

- Legível em menos de duzentos milissegundos, por posição e preenchimento, não por leitura.
- Periférico. Nunca sobrepõe as faixas jogáveis nem compete com os Glitches.
- Determinístico. Função pura de tempo decorrido, progressão e recorde.
- Sempre existe um alvo. O medidor nunca fica sem destino.
- Acessível por rótulo textual para leitores de tela, sem exibir esse texto na tela.

## D7 — Medidor de Sinal

Elemento de interface exibido apenas em Playing, composto por um marcador de recompensa e uma trilha de preenchimento.

O preenchimento representa a fração percorrida entre o alvo anterior e o próximo. A cor do marcador identifica o tipo de recompensa, reutilizando o código de cor já usado na coleção: forma em amarelo, skin em rosa, equipamento em ciano e tema em violeta.

Estados do medidor:

- `tracking`: percurso normal até o próximo alvo.
- `imminent`: faltam 2,6 segundos ou menos, coincidindo com a entrada do farol na tela.
- `reward`: alvo cruzado, exibido por 1,6 segundo.
- `record`: o jogador superou o próprio recorde e não há mais alvo acima.

## D8 — Alvo sempre presente

A escolha do alvo é determinada por tempo decorrido, não por estado de desbloqueio, para que jogadores veteranos continuem tendo destino.

1. Se existe um marco de `NEON_MILESTONES` acima do tempo decorrido, ele é o alvo.
2. Caso contrário, se o recorde pessoal está acima do tempo decorrido, o recorde é o alvo.
3. Caso contrário, o estado é `record` e o medidor permanece cheio.

## D9 — Desbloqueio em tempo real

Os marcos passam a ser resolvidos durante a corrida, no instante em que o farol cruza NOVA, e não mais somente na morte. A recompensa é equipada imediatamente, portanto NOVA transforma-se em tela no momento da conquista.

`completeRun` permanece disponível e torna-se idempotente para marcos já aplicados.

## D10 — Aposentadoria da dica de controle

A dica de controle deixa de ser permanente. Ela se retira quando o jogador demonstra domínio, definido como duas trocas de faixa realizadas, ou após seis segundos de corrida, o que ocorrer primeiro. Instrução permanente é ruído para quem já entendeu.

## Fora de escopo

- Texto narrativo, tutorial adicional ou contagem regressiva numérica em tela.
- Alteração de hitbox, curva de dificuldade, máquina de estados ou contrato do SDK.
- Moeda, loja, missões diárias ou placar.
- Fases temáticas automáticas dentro da corrida, que permanecem congeladas.

## Critério de sucesso

Em qualquer instante da corrida o jogador consegue responder, sem ler texto, o quanto falta para a próxima conquista e de que tipo ela é. A primeira recompensa acontece dentro da primeira sessão, aos quinze segundos, e é percebida em tela no instante em que ocorre.

## Evidência exigida

- Pureza e continuidade do objetivo em toda a faixa de tempo, incluindo além do último marco.
- Fração de preenchimento sempre entre zero e um, monotônica dentro de cada trecho.
- Janela `imminent` coincidente com a entrada do farol.
- Desbloqueio aplicado durante a corrida e idempotente na morte.
- Dica de controle retirada por domínio ou por tempo.
- Invariantes de hitbox, dificuldade e SDK preservados.
