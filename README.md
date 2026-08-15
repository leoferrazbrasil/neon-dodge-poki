# Neon Dodge

MVP hipercasual WebGL para prova de conceito técnica na Poki.

## Estado

O repositório contém a especificação de design e o plano de implementação aprovados. A implementação do jogo será adicionada nas tarefas seguintes, mantendo o build sem dependências externas e abaixo de 8 MB.

## Documentação

- [Especificação](docs/superpowers/specs/2026-08-15-neon-dodge-design.md)
- [Plano de implementação](docs/superpowers/plans/2026-08-15-neon-dodge.md)
- Cofre Obsidian local: `D:\LEONARDO\Games\cofre-games`

## Restrições principais

- WebGL2 puro com fallback local.
- Sem CDN, fontes externas, analytics, backend ou requests de rede no runtime.
- Canvas lógico 16:9 com suporte desktop, portrait e landscape.
- Mock local do PokiSDK com `gameLoadingFinished`, `gameplayStart`, `gameplayStop` e `commercialBreak`.
- Persistência protegida contra falhas de `localStorage`.
