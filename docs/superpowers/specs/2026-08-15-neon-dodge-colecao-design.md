# Neon Dodge — Coleção Neon

## Problema

O menu de coleção não comunica o que o jogador está escolhendo e desperdiça o espaço que tem. Auditoria conduzida com a skill `ui-ux-pro-max`, contra as categorias de prioridade 1, 2, 4, 5 e 6.

| Regra | Violação |
| --- | --- |
| `scroll-behavior`, prioridade 5 | A lista rola dentro do painel enquanto o painel mantém cerca de quarenta por cento de altura vazia abaixo. Região de rolagem aninhada e desnecessária. |
| `whitespace-balance`, prioridade 6 | O espaço está invertido: a grade fica espremida e cortada no meio de um card, e a folga fica no lugar errado. |
| `state-clarity`, prioridade 4 | Card equipado e card disponível têm alturas diferentes, porque um exibe rótulo e o outro exibe um botão. A grade fica irregular. |
| `primary-action`, prioridade 4 | Cada card disponível desenha uma pílula larga de ação que compete visualmente com o único botão primário da tela. |
| `touch-target-size` e `no-precision-required`, prioridade 2 | O alvo de toque é a pílula interna, não o card. O jogador mira em um retângulo estreito dentro de um retângulo grande. |
| `color-not-only`, prioridade 1 | O tipo do item é comunicado por uma borda colorida fina somada a um prefixo textual redundante. |
| `truncation-strategy`, prioridade 6 | Rótulos repetem o tipo: "Forma: Forma Inicial", "Skin: Skin Ciano". |
| `progressive-disclosure`, prioridade 8 | Itens ainda bloqueados são invisíveis. O jogador não vê o que existe para conquistar, contrariando a exigência de próximo objetivo permanente. |

Falha adicional, não catalogada: em um jogo visual, a coleção é apresentada apenas por texto. O jogador não vê o que está equipando.

## Direção

O estilo recomendado pela skill para o produto é Retro-Futurism, com foco em modo escuro, e coincide com a identidade já implementada. A correção é estrutural, não de linguagem visual. Fontes externas do design system são descartadas por causa do isolamento de rede.

## Decisões

- **D11.** Agrupar os itens por tipo em quatro seções: Forma, Skin, Equipamento e Tema. O agrupamento elimina o prefixo redundante e permite varredura.
- **D12.** Cada card exibe uma pré-visualização do próprio item, gerada pelas mesmas tabelas de arte do jogo. Forma mostra o casco de NOVA, skin mostra o disco de cor, tema mostra a paleta em faixas e equipamento mostra o seu glifo.
- **D13.** O card inteiro é o controle. A pílula interna é removida. Altura uniforme, alvo de toque mínimo de 44 pixels, retorno visual no pressionar sem deslocar layout.
- **D14.** Estado equipado é comunicado por selo, borda e rótulo acessível, sem alterar a altura do card.
- **D15.** Itens bloqueados aparecem esmaecidos, com o segundo de sobrevivência que os libera. A coleção passa a mostrar o caminho inteiro.
- **D16.** A grade usa preenchimento automático por largura mínima e o painel deixa de aninhar rolagem própria quando o conteúdo cabe.

## Invariantes

- Nenhuma alteração em core loop, hitbox, dificuldade, máquina de estados ou contrato do SDK.
- Somente itens desbloqueados podem ser equipados. O card bloqueado não é acionável nem focalizável.
- Nenhuma imagem, fonte externa, CDN ou requisição de rede.
- `prefers-reduced-motion` respeitado.
- Contraste mínimo de 4,5 para texto e 3 para elementos gráficos, verificado no fundo escuro.

## Critério de sucesso

O jogador identifica o que cada item é sem ler o rótulo, distingue equipado de disponível de bloqueado à primeira vista, e aciona qualquer card tocando em qualquer ponto dele. A grade tem altura uniforme e não corta cards pela metade.

## Evidência exigida

- Agrupamento puro e determinístico, com ordem estável.
- Todo item de `NEON_MILESTONES` presente na coleção, bloqueado ou não.
- Card bloqueado sem `data-action`, sem `tabindex` e com `aria-disabled`.
- Altura uniforme medida em navegador, alvos de toque com pelo menos 44 pixels.
- Ausência de rolagem horizontal em 375, 768 e 1024 pixels.
