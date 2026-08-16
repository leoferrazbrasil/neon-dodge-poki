# Plano — Neon Dodge Coleção

Especificação: `docs/superpowers/specs/2026-08-15-neon-dodge-colecao-design.md`.

1. Extrair as tabelas de tema e skin para constantes exportadas e puras.
2. Implementar `getLoadoutSections`, agrupando por tipo com ordem de conquista.
3. Renderizar seções, pré-visualização por tipo e cadeado vetorial nos itens bloqueados.
4. Substituir a linha com pílula interna por um botão único de altura uniforme.
5. Reescrever o estilo: grade de preenchimento automático, estados equipado, disponível e bloqueado.
6. Corrigir a coluna do painel, que encolhia ao conteúdo e desperdiçava largura.
7. Reservar duas linhas para o nome, para manter altura uniforme nos sete idiomas.
8. Promover o menu a modal de tela cheia em portrait e landscape curto.
9. Estreitar a exceção do namespace SVG no auditor de rede.
10. Corrigir `equipReward`, que rejeitava os itens iniciais.
11. Testes, medição de geometria em navegador e publicação.
