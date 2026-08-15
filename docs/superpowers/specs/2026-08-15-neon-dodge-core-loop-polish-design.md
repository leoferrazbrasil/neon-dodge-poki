# Neon Dodge — polimento de core loop

## Objetivo

Melhorar a primeira compreensão e a retenção do Neon Dodge sem adicionar complexidade visual ou sonora nesta iteração. O jogador deve entender a ação no primeiro instante, receber uma janela inicial justa e perceber uma progressão contínua até o Game Over.

## Escopo aprovado

- Onboarding e clareza do primeiro toque.
- Ritmo, espaçamento e progressão dos obstáculos.
- Garantia de faixa segura e dificuldade determinística.
- Feedback textual de reinício após Game Over.
- Testes automatizados do diretor de obstáculos.

Fora do escopo: partículas avançadas, novos efeitos visuais, trilha sonora, novos assets e integração do SDK oficial.

## Onboarding

O estado Ready exibirá uma instrução curta e inequívoca:

```text
Toque para começar
Cada toque alterna a faixa
```

O primeiro input físico apenas inicia a rodada e chama `gameplayStart()`. Ele não troca de faixa na mesma ação. A troca de faixa começa no segundo input, evitando que o primeiro toque seja interpretado de duas formas.

O estado Playing manterá a instrução de controle disponível de maneira discreta, sem bloquear o campo de jogo. O botão Restart continuará explícito no Game Over e a transição seguirá `commercialBreak()` → `Ready` → novo input físico.

## Diretor de obstáculos

O mundo deixa de depender somente de aleatoriedade livre. Um diretor calcula os parâmetros conforme `elapsed` e mantém a dificuldade dentro de limites testáveis:

| Fase | Tempo | Velocidade | Intervalo de spawn | Regra de fairness |
| --- | ---: | ---: | ---: | --- |
| Opening | 0–15 s | 0,26 → 0,30 | 1,30 → 1,18 s | Um obstáculo por vez; alternância de faixa favorecida |
| Rising | 15–45 s | 0,30 → 0,39 | 1,18 → 0,90 s | Nunca bloquear as duas faixas |
| Challenge | 45–90 s | 0,39 → 0,48 | 0,90 → 0,74 s | Padrões alternados, sem sobreposição impossível |
| Endless | 90 s+ | máximo 0,52 | mínimo 0,72 s | Dificuldade estabilizada e faixa segura garantida |

O primeiro obstáculo entra após uma espera de aproximadamente 0,9 s. A sequência inicial será gerada com faixa segura conhecida; o diretor poderá usar aleatoriedade somente depois de verificar que a nova entrada não cria bloqueio ou sequência injusta.

## Modelo de retenção

- Primeira tentativa de jogador novo: alvo aproximado de 30–60 s.
- Jogador que aprende o padrão: progressão para 60–90 s.
- Jogador experiente: teto de dificuldade após 90 s, preservando tentativas de recorde.
- Cada morte deve ser explicável por uma decisão de faixa, não por obstáculo invisível ou mudança abrupta.

Esses alvos são critérios de playtest local, não telemetria enviada a terceiros.

## Contratos técnicos preservados

- `gameplayStart()` continua restrito ao primeiro input físico de cada sessão.
- `gameplayStop()` continua único em morte, pausa sistêmica e menu.
- `commercialBreak()` continua apenas no reinício pós-morte.
- O Mock PokiSDK e todos os locks permanecem inalterados.
- A política de zero requests, o bundle abaixo de 8 MB e a persistência tolerante a falhas permanecem obrigatórios.

## Testes de aceitação

- O texto do Ready comunica iniciar e alternar faixas sem ambiguidade.
- A primeira entrada ocorre dentro da janela de abertura e deixa uma faixa segura.
- A velocidade inicial e o intervalo de spawn respeitam os limites da fase Opening.
- A velocidade nunca excede 0,52 e o intervalo nunca fica abaixo de 0,72 s.
- O diretor não cria duas faixas bloqueadas simultaneamente.
- A curva é monotônica: não há aumento de dificuldade seguido de relaxamento acidental.
- O ciclo Poki permanece verde nos testes existentes.
