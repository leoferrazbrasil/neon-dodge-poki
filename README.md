# Neon Dodge

MVP hipercasual WebGL para navegadores, estruturado para publicação multiplataforma.

## Estado

O repositório contém o MVP implementado, sua especificação, os planos de publicação e os testes. O build runtime mantém o isolamento de rede e um descarregamento inicial de 93.333 bytes nos quatro arquivos principais. O slug atual `neon-dodge-poki` é histórico; o produto se chama **Neon Dodge** e não é exclusivo de uma plataforma.

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
- Adaptador de plataforma isolado, com perfil neutro por padrão e mocks locais apenas para validar contratos de portal.
- Persistência protegida contra falhas de `localStorage`.
- Progressão local com formas, skins, equipamento visual e fases temáticas.

## Perfis de publicação

O jogo é desenvolvido uma vez no `base-offline` e recebe pacotes de publicação separados. O runtime de gameplay não depende de APIs de um portal.

- **Base offline:** build neutro, sem branding, SDK real ou requests externos.
- **CrazyGames Basic:** pacote com metadados, capas e vídeos próprios; SDK opcional e monetização desativada durante o Basic Launch.
- **Poki:** aplicação de desenvolvedor, playtest e SDK real somente após acesso autorizado pelo portal.
- **CrazyGames Full:** etapa posterior, dependente de métricas do Basic Launch, SDK real e nova QA.

Consulte o [plano de avanço por plataforma](docs/platforms/2026-08-15-platform-advancement.md) antes de preparar uma entrega.

## Core loop atual

- Ready comunica `Toque para começar` e `Cada toque alterna a faixa`.
- O primeiro input físico inicia a rodada; os próximos inputs alternam a faixa.
- A dificuldade progride por tempo: 0–15s (0,26→0,30), 15–45s (0,30→0,39), 45–90s (0,39→0,48) e 90s+ em teto de 0,52.
- O intervalo de obstáculos desce de 1,30s para 0,72s, com sequência inicial alternada e sempre uma faixa livre.
- A primeira tentativa esperada fica em aproximadamente 30–60s; jogadores que aprendem o padrão devem alcançar 60–90s.

## Coleção Neon

- Itens agrupados por tipo, com pré-visualização gerada pelas tabelas de arte do jogo.
- O card inteiro é o controle, com altura uniforme e alvo de toque de pelo menos 68 pixels.
- Itens bloqueados aparecem com cadeado e o segundo de sobrevivência que os libera.
- Em portrait e landscape curto o menu ocupa a tela inteira, em vez do frame 16:9.

## Prontidão de submissão

- Sete idiomas completos com as mesmas vinte e oito chaves: en, pt-BR, es, fr, it, de e tr.
- Áudio de recompensa em acorde e aviso sonoro na aproximação do marco.
- Thumbnail quadrada em `store/thumbnail-628.svg` e capas de publicação em `store/covers/`, geradas a partir das tabelas de arte do jogo.
- Metadados-base de submissão em `store/METADADOS.md`; cada plataforma exige revisão própria de idioma, faixa etária, descrição e campos do portal.
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

O repositório deve ser aberto a partir da pasta `neon-dodge-poki`. O cofre Obsidian e as referências externas ficam como diretórios irmãos no workspace e não fazem parte do build ou do histórico do jogo. O nome da pasta/slug não limita os destinos de publicação do Neon Dodge.
