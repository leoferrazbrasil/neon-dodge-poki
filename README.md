# Neon Dodge

MVP hipercasual WebGL para prova de conceito técnica na Poki.

## Estado

O repositório contém o MVP implementado, sua especificação, o plano e os testes. O build runtime mantém o isolamento de rede e um descarregamento inicial de 33.230 bytes nos quatro arquivos principais.

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

## Organização local

O repositório deve ser aberto a partir da pasta `neon-dodge-poki`. O cofre Obsidian e as referências externas ficam como diretórios irmãos no workspace e não fazem parte do build ou do histórico do jogo.
