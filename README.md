# Neon Dodge

MVP hipercasual WebGL para prova de conceito técnica na Poki.

## Estado

O repositório contém o MVP implementado, sua especificação, o plano e os testes. O build runtime mantém o isolamento de rede e um descarregamento inicial de 35.803 bytes nos quatro arquivos principais.

## Documentação

- [Especificação](docs/superpowers/specs/2026-08-15-neon-dodge-design.md)
- [Especificação de core loop e retenção](docs/superpowers/specs/2026-08-15-neon-dodge-core-loop-polish-design.md)
- [Plano de implementação](docs/superpowers/plans/2026-08-15-neon-dodge.md)
- [Plano de core loop e onboarding](docs/superpowers/plans/2026-08-15-neon-dodge-core-loop-polish.md)
- Cofre Obsidian local: `D:\LEONARDO\Games\cofre-games`

## Restrições principais

- WebGL2 puro com fallback local.
- Sem CDN, fontes externas, analytics, backend ou requests de rede no runtime.
- Canvas lógico 16:9 com suporte desktop, portrait e landscape.
- Mock local do PokiSDK com `gameLoadingFinished`, `gameplayStart`, `gameplayStop` e `commercialBreak`.
- Persistência protegida contra falhas de `localStorage`.

## Core loop atual

- Ready comunica `Toque para começar` e `Cada toque alterna a faixa`.
- O primeiro input físico inicia a rodada; os próximos inputs alternam a faixa.
- A dificuldade progride por tempo: 0–15s (0,26→0,30), 15–45s (0,30→0,39), 45–90s (0,39→0,48) e 90s+ em teto de 0,52.
- O intervalo de obstáculos desce de 1,30s para 0,72s, com sequência inicial alternada e sempre uma faixa livre.
- A primeira tentativa esperada fica em aproximadamente 30–60s; jogadores que aprendem o padrão devem alcançar 60–90s.

## Organização local

O repositório deve ser aberto a partir da pasta `neon-dodge-poki`. O cofre Obsidian e as referências externas ficam como diretórios irmãos no workspace e não fazem parte do build ou do histórico do jogo.
