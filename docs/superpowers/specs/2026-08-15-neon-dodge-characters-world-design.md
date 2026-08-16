# Neon Dodge — Personagens e Mundo Visual

## Objetivo

Substituir a leitura de protótipo geométrico por uma identidade narrativa leve, mantendo o core loop de troca de faixa, a curva de dificuldade, as hitboxes e o contrato de lifecycle do SDK.

## Direção canônica

NOVA é uma mensageira de energia que conduz o Núcleo Neon por trilhos instáveis. Os Glitches corromperam a rede; cada rodada representa uma tentativa de alcançar o próximo farol sem deixar o sinal ser interrompido.

O jogo comunica essa história por silhueta, cenário e feedback visual, sem cutscenes, diálogos longos, combate ou telas adicionais antes do gameplay.

## Entidades

- Player: NOVA, criatura/robô flutuante com visor luminoso.
- Formas: forma inicial, Forma Pulse e Forma Plasma; todas preservam a mesma área de colisão.
- Inimigos: Glitches visuais em três variantes — drone, fragmento prismático e portal corrompido.
- Objetos: Núcleo Neon, faróis de sinal, trilhos, placas, prédios, cristais e painéis cósmicos.

As três variantes de Glitch começam com o comportamento atual de obstáculo. A primeira iteração não adiciona velocidade, ataque, perseguição, vida ou regras novas.

## Cenários

- Cidade Neon: trilhos cianos, prédios e faróis urbanos.
- Túnel Cristal: cristais, placas prismáticas e trilhos azulados.
- Laboratório Cósmico: estrelas, painéis orbitais e trilhos violetas.

Os cenários são derivados dos temas já desbloqueáveis (`theme-city`, `theme-crystal`, `theme-cosmic`).

## Regras de UX e performance

- O primeiro frame continua legível sem texto narrativo obrigatório.
- O hint de controle continua sendo a instrução principal.
- Toda arte é procedural em Canvas/WebGL, sem imagens, CDN ou fontes externas.
- O bundle inicial permanece abaixo de 8 MB.
- Contraste, silhueta e hitbox não dependem apenas de cor.
- `prefers-reduced-motion` continua respeitado pela camada de interface.
- `gameplayStart()`, `gameplayStop()` e `commercialBreak()` não mudam.

## Fora de escopo

- Combate, armas, chefes ou violência explícita.
- Inventário, moedas, loja, contas ou leaderboard.
- Cutscenes, diálogos e tutorial adicional.
- Novos comportamentos de obstáculo antes de playtest humano.

## Critério de sucesso

Em menos de cinco segundos, um jogador de 9–12 anos deve conseguir identificar NOVA, perceber que os Glitches são perigosos, reconhecer os trilhos e iniciar a ação sem precisar ler uma história. A apresentação deve parecer própria do Neon Dodge, sem asset flip, e manter a performance do MVP.
