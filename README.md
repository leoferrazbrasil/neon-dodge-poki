# Neon Dodge

MVP hipercasual WebGL para prova de conceito técnica na Poki.

## Estado

O repositório contém o MVP implementado, sua especificação, o plano e os testes. O build runtime mantém o isolamento de rede e um descarregamento inicial de 86.143 bytes nos quatro arquivos principais.

## Documentação

- [Especificação](docs/superpowers/specs/2026-08-15-neon-dodge-design.md)
- [Especificação de core loop e retenção](docs/superpowers/specs/2026-08-15-neon-dodge-core-loop-polish-design.md)
- [Especificação de Evolução Neon](docs/superpowers/specs/2026-08-15-neon-dodge-evolucao-neon-design.md)
- [Especificação de Mundo e Elenco](docs/superpowers/specs/2026-08-15-neon-dodge-mundo-e-elenco-design.md)
- [Especificação de Objetivo visível](docs/superpowers/specs/2026-08-15-neon-dodge-objetivo-visivel-design.md)
- [Plano de implementação](docs/superpowers/plans/2026-08-15-neon-dodge.md)
- [Plano de core loop e onboarding](docs/superpowers/plans/2026-08-15-neon-dodge-core-loop-polish.md)
- [Plano de Evolução Neon](docs/superpowers/plans/2026-08-15-neon-dodge-evolucao-neon.md)
- [Plano de Mundo e Elenco](docs/superpowers/plans/2026-08-15-neon-dodge-mundo-e-elenco.md)
- [Plano de Objetivo visível](docs/superpowers/plans/2026-08-15-neon-dodge-objetivo-visivel.md)
- [Plano de avanço por plataforma](docs/platforms/2026-08-15-platform-advancement.md)
- Cofre Obsidian local: `D:\LEONARDO\Games\cofre-games`

## Restrições principais

- WebGL2 puro com fallback local.
- Sem CDN, fontes externas, analytics, backend ou requests de rede no runtime.
- Canvas lógico 16:9 com suporte desktop, portrait e landscape.
- Mock local do PokiSDK com `gameLoadingFinished`, `gameplayStart`, `gameplayStop` e `commercialBreak`.
- Persistência protegida contra falhas de `localStorage`.
- Progressão local com formas, skins, equipamento visual e fases temáticas.

## Core loop atual

- Ready comunica `Toque para começar` e `Cada toque alterna a faixa`.
- O primeiro input físico inicia a rodada; os próximos inputs alternam a faixa.
- A dificuldade progride por tempo: 0–15s (0,26→0,30), 15–45s (0,30→0,39), 45–90s (0,39→0,48) e 90s+ em teto de 0,52.
- O intervalo de obstáculos desce de 1,30s para 0,72s, com sequência inicial alternada e sempre uma faixa livre.
- A primeira tentativa esperada fica em aproximadamente 30–60s; jogadores que aprendem o padrão devem alcançar 60–90s.

## Prontidão de submissão

- Sete idiomas completos com as mesmas vinte e oito chaves: en, pt-BR, es, fr, it, de e tr.
- Áudio de recompensa em acorde e aviso sonoro na aproximação do marco.
- Thumbnail 628x628 em `store/thumbnail-628.svg`, gerada por `node tools/build-thumbnail.mjs` a partir das tabelas de arte do jogo.
- Metadados de submissão em `store/METADADOS.md`.
- Carga medida: DOM interativo em 57 ms, carga completa em 406 ms, primeira ação até gameplay em 84 ms.

## Objetivo visível durante a corrida

- O Medidor de Sinal mostra, sem texto, o quanto falta para a próxima conquista e de que tipo ela é.
- O alvo nunca falta: marco, depois recorde pessoal, depois estado de recorde.
- Os marcos são desbloqueados durante a corrida, no cruzamento do farol, e não apenas na morte.
- A celebração dura 1,6 segundo e exibe a recompensa conquistada.
- A dica de controle se retira após duas trocas de faixa ou seis segundos.

## Mundo e elenco

- A estrada tem leito, bordas de contenção, guias de faixa e marcação tracejada em movimento.
- O cenário rola em três camadas de paralaxe com profundidade 0,12, 0,38 e 1,0.
- Cada marco de progressão atravessa a pista como um farol e cruza NOVA no instante exato do marco.
- NOVA é composta por partes convexas: propulsor, aletas, casco, visor, lente, anel e Núcleo Neon.
- O núcleo pulsa por tempo decorrido e o propulsor alonga na troca de faixa.
- As três variantes de Glitch (Drone, Estilhaço e Portal) têm silhueta e cor próprias.
- Toda a arte é função pura de estado, sem aleatoriedade no caminho de render.

## Evolução Neon

- Marcos de sobrevivência em 15, 30, 45, 60, 90, 120 e 150 segundos.
- Recompensas cosméticas persistidas em `neon-dodge-progression-v1`.
- Game Over apresenta desbloqueios e o próximo objetivo; Ready apresenta o próximo marco.
- Menu de personalização permite equipar somente conteúdos desbloqueados.
- Falha de storage mantém o progresso em memória e não interrompe o jogo.

## Organização local

O repositório deve ser aberto a partir da pasta `neon-dodge-poki`. O cofre Obsidian e as referências externas ficam como diretórios irmãos no workspace e não fazem parte do build ou do histórico do jogo.
