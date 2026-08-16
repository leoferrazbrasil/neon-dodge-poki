# Plano — Neon Dodge Mundo e Elenco

Especificação: `docs/superpowers/specs/2026-08-15-neon-dodge-mundo-e-elenco-design.md`.

## Fase A — Mundo

1. Acrescentar `depth` às decorações de cenário e ampliar cada tema para três camadas de profundidade.
2. Implementar `getParallaxOffset(elapsed, speed, depth, span)` com módulo sobre a largura lógica.
3. Implementar `getRoadBands()` com leito, bordas, divisória e faixas de guia.
4. Implementar `getLaneDashes(elapsed, speed)` com deslocamento determinístico do tracejado.
5. Implementar `getActiveBeacons(elapsed)` derivado de `NEON_MILESTONES`.
6. Ligar `drawWorldArt` nos dois renderers, antes das entidades.
7. Testes de Fase A e `check:build`.
8. Commit.

## Fase B — Elenco

1. Implementar tabelas congeladas de partes convexas para NOVA e para as três variantes de Glitch.
2. Implementar `getPlayerParts(style)` reutilizando `getPlayerShape` como casco.
3. Implementar `getGlitchParts(kind)` decompondo o Portal em partes convexas.
4. Implementar `getGlitchTone(style, kind)` dando cor própria a cada variante.
5. Derivar pulso do núcleo de `elapsed` e alongamento do propulsor da distância até a faixa alvo.
6. Substituir `drawPlayerArt` e `drawObstacleArt` pelo desenho por partes.
7. Testes de Fase B, incluindo pureza, convexidade, contagem e paleta.
8. `npm test`, `npm run check:build`.
9. Commit.

## Encerramento

1. Atualizar `README.md`.
2. Atualizar o cofre: estado atual, decisões, validação e entrega.
3. Publicar em `main`.
