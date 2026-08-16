# Neon Dodge — Mundo e Elenco

## Objetivo

Eliminar a leitura de protótipo geométrico entregando estrada viva, mundo em paralaxe e personagens compostos, sem alterar core loop, hitboxes, curva de dificuldade ou contrato de lifecycle do SDK.

## Diagnóstico que motiva esta iteração

A especificação `2026-08-15-neon-dodge-characters-world-design.md` definiu a direção narrativa e foi implementada, mas a leitura geométrica permaneceu. A causa está na camada de primitivas, não no catálogo de formas.

1. O fragment shader é preenchimento chapado de cor única. Não existe gradiente, contorno, textura ou sombra, portanto uma entidade de uma cor só não constrói hierarquia de valor.
2. `drawPolygon` triangula por leque a partir do vértice zero, portanto apenas polígonos convexos renderizam corretamente. `OBSTACLE_SHAPES[2]`, o Portal, é côncavo e sempre renderizou errado.
3. O orçamento por entidade era de três primitivas, insuficiente para qualquer leitura de personagem.
4. As decorações de cenário tinham posição fixa e nunca rolavam, lendo como papel de parede.
5. A estrada eram três retângulos lisos, sem marcação, borda ou movimento.

## Princípio de determinismo

Toda a arte é função pura de `(snapshot, progression)`. Nenhuma chamada a `Math.random`, nenhum estado mutável de partícula, nenhuma alocação persistente entre frames no caminho de render.

O snapshot já fornece tudo o que é necessário: `elapsed`, `speed`, `player.y` interpolado, e por obstáculo `kind` derivado de `obstacleSerial % 3` e `lane`. A variante de Glitch já é reprodutível partida a partida, o que sustenta a curva de dificuldade por aprendizado de padrão.

## Público-alvo

Núcleo de 9 a 12 anos, audiência global, mobile-first com portrait priorizado, conforme as diretrizes Poki do cofre. Consequências determinadas por eliminação:

- Sem violência, combate ou dano. O conflito é interferência de sinal.
- Silhueta antes de detalhe. Toda entidade precisa ser legível a 340 px de largura.
- Identidade própria, sem asset flip nem clone genérico, que o manual operacional lista como causas de reprovação.
- Contraste sustentado por forma e valor, nunca apenas por cor.

## Fase A — Mundo

### Estrada

Substituir os três retângulos por faixas nomeadas: leito da pista, duas bordas de contenção, divisória central e marcação tracejada em movimento. O deslocamento do tracejado deriva de `elapsed` e `speed`, com módulo sobre o passo da marcação.

### Paralaxe

Três camadas com fator de profundidade próprio: fundo distante em 0,12, silhueta média em 0,38 e contenção próxima em 1,0. As posições saem da tabela congelada de decorações, deslocadas por `elapsed` e reinseridas por módulo da largura lógica. Cada decoração declara `depth`.

### Faróis de marco

Cada limiar de `NEON_MILESTONES` materializa um farol que atravessa a pista. A posição é `0,16 + (limiar - elapsed) * 0,40`, portanto o farol cruza a coluna de NOVA exatamente no instante do marco. O farol é visível enquanto sua posição estiver dentro da faixa de tela, não colide, não altera pontuação e não altera estado.

## Fase B — Elenco

### Camada habilitadora

Cada entidade passa a ser composta por uma lista congelada de partes convexas. Cada parte declara pontos em espaço local normalizado, token de cor e opacidade. A silhueta côncava emerge da união de partes convexas, sem alterar o shader, sem dependências e sem crescimento relevante de bundle.

### NOVA

Mensageira flutuante que conduz o Núcleo Neon. Partes: propulsor traseiro, aleta superior, aleta inferior, casco, placa de visor, lente de visor, anel do núcleo e núcleo. O casco reutiliza `getPlayerShape(form)`, preservando a distinção já existente entre as três formas. Formas Pulse e Plasma acrescentam partes próprias sem alterar área de colisão.

O núcleo pulsa por opacidade derivada de `elapsed`. O propulsor alonga conforme a distância entre `player.y` e a faixa alvo, portanto a troca de faixa vira movimento visível do personagem.

### Glitches

As três variantes ganham identidade dupla, forma e cor, por deixarem de compartilhar um único vermelho.

- Variante 0, Drone: corpo horizontal com dois pods laterais e olho único.
- Variante 1, Estilhaço: corpo vertical com faceta interna e duas pontas prismáticas.
- Variante 2, Portal: arco vazado decomposto em espinha e dois braços convexos, corrigindo a renderização côncava.

### Objetos

O Núcleo Neon deixa de ser abstração e fica visível preso a NOVA. Os faróis da Fase A representam os marcos de progressão dentro da corrida.

## Fora de escopo

- Combate, armas, chefes ou violência explícita.
- Comportamento novo de obstáculo, velocidade, perseguição, vida ou ataque.
- Fases temáticas dentro da corrida. O tema equipado permanece a única fonte de paleta até haver playtest humano, por já estar persistido em `neon-dodge-progression-v1`.
- Cutscenes, diálogos, tutorial adicional, inventário, moeda, loja, conta ou placar.
- Imagens, fontes externas, CDN ou qualquer requisição de rede.

## Invariantes

- `player.width` 0,07 e `player.height` 0,12 inalterados.
- `obstacle.width` 0,08 e `obstacle.height` 0,16 inalterados.
- `getDifficultyProfile` inalterado.
- `gameplayStart`, `gameplayStop` e `commercialBreak` inalterados.
- Transições da máquina de estados inalteradas.
- `prefers-reduced-motion` continua respeitado pela camada de interface.

## Critério de sucesso

Em menos de cinco segundos um jogador do público-alvo identifica NOVA, percebe que os Glitches são perigosos, reconhece a estrada em movimento e inicia a ação sem ler história. As três variantes de Glitch são distinguíveis em movimento. A apresentação é própria do Neon Dodge e mantém a performance do MVP.

## Evidência exigida

- Pureza: mesma entrada produz saída idêntica em todas as funções de arte.
- Convexidade: toda parte de toda entidade é convexa.
- Contagem: cada entidade declara pelo menos oito partes.
- Paleta: nenhuma cor de parte fora dos tokens do tema ativo.
- Invariantes de hitbox e dificuldade preservados.
- `npm test` e `npm run check:build` aprovados.
