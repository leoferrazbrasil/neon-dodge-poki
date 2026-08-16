# Plano — Neon Dodge Objetivo visível

Especificação: `docs/superpowers/specs/2026-08-15-neon-dodge-objetivo-visivel-design.md`.

1. Implementar `getRunObjective` como função pura com continuidade garantida de alvo.
2. Acrescentar `applyMilestones` ao repositório de progressão, idempotente e tolerante a falha de storage.
3. Acrescentar a marcação e o estilo do Medidor de Sinal, com estados `tracking`, `imminent`, `reward` e `record`.
4. Ligar o medidor ao laço de quadro, exibindo-o apenas em Playing.
5. Aplicar os marcos durante a corrida, no cruzamento do farol.
6. Retirar a dica de controle por domínio ou por tempo.
7. Exibir na celebração a recompensa conquistada, não a seguinte.
8. Testes de continuidade, monotonicidade, janela iminente, idempotência e celebração.
9. Validação em navegador com laço de quadro dirigido manualmente.
10. `npm test`, `npm run check:build`, cofre e publicação.
