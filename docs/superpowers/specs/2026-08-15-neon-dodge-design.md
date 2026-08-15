# Neon Dodge — especificação de design do MVP

## Objetivo

Construir um minijogo hipercasual de desvio para navegador, voltado a desktop e dispositivos móveis, com um loop jogável nos primeiros segundos e uma arquitetura limpa para demonstração técnica ao Poki for Developers.

O jogador alterna entre duas faixas com um toque ou clique. Obstáculos avançam em direção ao jogador; sobreviver aumenta a pontuação e acelera gradualmente o ritmo. Uma colisão encerra a rodada, exibe o resultado e oferece reinício imediato.

## Critérios de sucesso

- O primeiro input físico inicia uma rodada e dispara `PokiSDK.gameplayStart()` exatamente uma vez.
- A morte, pausa ou abertura de menu dispara `PokiSDK.gameplayStop()` exatamente uma vez.
- O reinício a partir de Game Over passa por `PokiSDK.commercialBreak()` antes de retornar a `Ready`.
- O estado `Ready` só é exibido depois de `PokiSDK.init()` resolver ou rejeitar, dos shaders estarem compilados e de `PokiSDK.gameLoadingFinished()` ser chamado uma vez.
- Nenhum método do jogo faz requests HTTP, carrega CDN, usa fonte externa ou depende de serviço de terceiros.
- O jogo continua funcionando se `localStorage` estiver indisponível ou lançar exceção.
- Quando a persistência falhar, a interface informa de forma não-intrusiva que o score da sessão não será retido após fechar a aba.
- O canvas mantém composição 16:9, escala de forma proporcional e funciona em portrait e landscape.
- Controles de toque ficam disponíveis em dispositivos móveis e tablets.
- O descarregamento inicial permanece abaixo de 8 MB.
- Não existem `console.log`, ferramentas de desenvolvimento ou artefatos de teste no build final.

## Abordagem escolhida

Usar WebGL2 puro em JavaScript, sem bibliotecas externas, com fallback controlado para WebGL1 e depois Canvas 2D quando WebGL não estiver disponível. As entidades visuais serão compostas por geometrias simples geradas em runtime; não haverá texturas ou fontes remotas.

Essa abordagem mantém o pacote pequeno e atende ao perfil técnico WebGL sem introduzir a complexidade de um engine. O fallback prioriza disponibilidade do jogo em navegadores com suporte gráfico limitado.

## Estrutura de arquivos

```text
index.html
styles.css
game.js
strings.json
docs/superpowers/specs/2026-08-15-neon-dodge-design.md
tests/poki-state.test.mjs
```

`index.html` contém a estrutura semântica da interface, o canvas e os painéis de Ready, pausa e Game Over.

`styles.css` contém somente estilos locais: composição fullscreen, letterboxing, HUD, botões acessíveis e controles táteis.

`game.js` contém o mock do SDK, estado da partida, input, loop, renderer, colisões, dificuldade, áudio sintético e persistência segura.

`strings.json` contém o dicionário local da interface, separado da lógica. O primeiro pacote terá as mensagens essenciais em inglês, português do Brasil, espanhol, francês, italiano, alemão e turco, sem carregar fontes externas.

`tests/poki-state.test.mjs` fica fora do build final e cobre as transições assíncronas e as travas do SDK.

## Estados e fluxo

```text
Booting
  └─ init + shaders + recursos locais concluídos → gameLoadingFinished() → Ready

Ready
  └─ primeiro input físico → Playing + gameplayStart()

Playing
  ├─ input → troca de faixa
  ├─ botão pausa/visibilidade perdida → Paused + gameplayStop()
  ├─ abertura do menu → Menu + gameplayStop()
  └─ colisão → Game Over + gameplayStop()

Paused
  └─ input de continuar → Playing + gameplayStart()

Menu
  └─ input de fechar/continuar → Playing + gameplayStart()

Game Over
  └─ toque em Reiniciar → commercialBreak() → Ready
```

O toque em Reiniciar não inicia a nova rodada diretamente. Ele apenas conclui a etapa comercial simulada e retorna à tela Ready; um novo input físico inicia a jogabilidade. Isso preserva a regra de que `gameplayStart()` só ocorre a partir de input físico e evita iniciar gameplay automaticamente depois de uma pausa comercial.

## Camada simulada do PokiSDK

O build define `window.PokiSDK` localmente com métodos assíncronos:

```js
window.PokiSDK = {
  async init() {},
  async gameLoadingFinished() {},
  async gameplayStart() {},
  async gameplayStop() {},
  async commercialBreak() {}
};
```

O mock não faz rede. `init()` resolve localmente; `gameLoadingFinished()` registra a conclusão lógica do carregamento; `commercialBreak()` representa uma espera curta local e resolve mesmo sem inventário de anúncio real.

O controlador de integração mantém pelo menos estas travas:

- `pokiInitialized`: impede inicialização concorrente.
- `pokiLoadingFinished`: impede conclusão de carregamento duplicada.
- `pokiGameplayActive`: impede `gameplayStart()` duplicado e só permite início quando falso.
- `pokiGameplayStopped`: impede `gameplayStop()` duplicado e é atualizado em cada transição válida.
- `commercialBreakBusy`: impede duas pausas comerciais simultâneas.

O bootstrap aguardará `init()` mesmo quando a Promise rejeitar, continuará preparando o renderer local e só então chamará `gameLoadingFinished()` uma vez. O painel Ready só ficará visível depois dessa chamada. As funções de transição serão os únicos pontos autorizados a chamar métodos de gameplay e monetização; o loop de renderização nunca chama métodos do SDK por conta própria.

## Renderização e proporção

O canvas lógico usa 16:9 e uma das dimensões proporcionais de referência `640x360`, `836x470` ou `1031x580`, escolhida conforme a área disponível. A resolução interna será ajustada com base no `devicePixelRatio`, com teto para evitar custo excessivo em telas de alta densidade.

O CSS centraliza o canvas, aplica `contain` e usa letterboxing quando a janela não tiver proporção 16:9. A câmera lógica continua invariável, então colisões e posicionamento não dependem da resolução física.

No WebGL, o jogo desenha fundo em gradiente simples, faixas, jogador, obstáculos e partículas por vértices/cores. O fallback usa a mesma API de alto nível de desenho, com implementações específicas por backend.

## Mecânica e game feel

- Duas faixas horizontais fixas representam as opções de movimento.
- Cada input válido alterna a faixa do jogador com interpolação curta e easing.
- Obstáculos entram pela borda oposta, com espaçamento mínimo seguro.
- A velocidade e a frequência de obstáculos aumentam em degraus suaves conforme o tempo vivo.
- A colisão usa volumes retangulares simples e tolerância pequena para manter a sensação justa.
- Feedback de acerto inclui flash, partículas curtas, mudança de cor e áudio local gerado pela Web Audio API.
- O game over exibe pontuação atual, melhor pontuação e uma chamada clara para reiniciar.

## Input, pausa e acessibilidade

O jogo aceitará pointer events no canvas e em botões, além de teclado (`Space`, `ArrowUp`, `ArrowDown`, `Escape` e `P`) no desktop. `Escape` e `P` alternarão pausa/menu conforme o estado atual. O input será normalizado para não responder duas vezes a uma mesma interação híbrida touch/mouse.

Em mobile/tablet, o controle tátil será exibido sempre. Em desktop, ele poderá permanecer oculto visualmente, mas a área de interação continuará acessível por pointer event. Botões terão área de toque confortável, foco visível e texto legível sem depender de ícones externos.

`visibilitychange`, `blur` e `resize` serão tratados para pausar com segurança e recalcular a viewport sem reiniciar a partida.

## Persistência tolerante a falhas

O melhor score será lido e escrito por wrappers isolados:

- cada leitura usa `try/catch` e retorna `0` em falha;
- cada gravação usa `try/catch` e falha silenciosamente;
- uma falha de leitura ou gravação ativa um aviso visual não-intrusivo de sessão não persistida;
- nenhum estado essencial da partida depende do armazenamento;
- o código não retém credenciais ou dados sensíveis.

## Áudio

Não serão usados arquivos externos. O áudio mínimo será criado com Web Audio API após o primeiro input, respeitando autoplay policies. Se a API não existir ou falhar, o jogo continuará sem som.

## Validação planejada

Antes da entrega, serão verificadas:

- testes automatizados das transições do SDK e das travas start/stop;
- teste da persistência quando `localStorage` lança erro;
- teste do ciclo Game Over → `commercialBreak()` → Ready;
- validação estática de ausência de URLs externas e `console.log`;
- verificação de que o painel Ready só aparece depois de `gameLoadingFinished()`;
- execução local em viewport desktop, portrait e landscape;
- verificação do tamanho total do build e dos arquivos baixados;
- verificação visual e interação básica em navegador.

## Fora de escopo

- anúncios reais, integração com o SDK oficial ou chamadas de terceiros;
- login, ranking online, backend, analytics e telemetria;
- AUDS, Netlib, Chat API, servidores Node.js e qualquer integração multiplayer;
- sistema de fases, loja, narrativa ou assets pesados;
- editor interno, debug overlay ou ferramentas de desenvolvimento no build.
