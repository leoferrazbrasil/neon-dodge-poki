# Neon Dodge — Plano de avanço por plataforma

Data de revalidação: 2026-08-16

Este documento separa o `base-offline` do Neon Dodge dos fluxos de publicação de Poki e CrazyGames. Não contém credenciais, tokens ou dados pessoais.

## Decisão operacional

Executar as duas frentes em paralelo, com prioridade operacional para CrazyGames Basic Launch:

1. Preparar e submeter o pacote CrazyGames Basic para obter QA e dados de jogadores reais.
2. Preparar a aplicação de desenvolvedor da Poki e usar as ferramentas de inspeção/playtest quando o acesso estiver liberado.
3. Não integrar monetização real antes de a plataforma autorizar o estágio correspondente.
4. Não usar resultados técnicos locais como substitutos de métricas reais.

## Estado atual do produto

- Build HTML5 offline, WebGL2 com fallback Canvas.
- 16:9 responsivo, desktop, portrait e landscape.
- Bundle runtime verificado em 79.776 bytes.
- 32/32 testes automatizados aprovados na última validação registrada.
- Inglês e demais traduções disponíveis no arquivo local de strings.
- Mock PokiSDK local; isso não comprova integração real de nenhum portal.
- NOVA, Glitches, cenários, progressão cosmética e primeiro toque implementados.
- Métricas de jogadores reais ainda não disponíveis.

## Frente CrazyGames Basic Launch

### Fluxo

`Developer Portal → Preview → submissão HTML5 → QA inicial → Basic Launch → métricas reais → decisão sobre Full Launch`

O Basic Launch é o próximo gate externo recomendado. Segundo a documentação pública consultada, a etapa usa uma audiência limitada, dura entre 7 e 21 dias, exige pelo menos 500 plays para encerrar normalmente e acompanha dados no dashboard. O SDK é opcional e anúncios ficam desativados durante o Basic Launch.

### Pacote a preparar

- [x] Build web leve.
- [x] Gameplay de um toque e reinício rápido.
- [x] Eventos de estado local sem duplicação no Mock.
- [x] Layout 16:9 e suporte mobile.
- [ ] Capa landscape 1920x1080.
- [ ] Capa portrait 800x1200.
- [ ] Capa square 800x800.
- [x] Vídeo preview landscape, 18 segundos, sem áudio, 7,6 MB.
- [x] Vídeo preview portrait, 18 segundos, sem áudio, 5,6 MB.
- [ ] Descrição em inglês.
- [ ] Instruções de controle em inglês.
- [ ] Pacote final sem branding ou dependência de outro portal.
- [ ] Teste no Preview Tool com os tamanhos de iframe documentados; aguardando o upload no portal.

### Critérios técnicos relevantes

- Download inicial Basic: até 50 MB; para elegibilidade da homepage mobile: até 20 MB.
- Até 250 MB no total e até 1.500 arquivos.
- O jogo deve ter inglês e controles intuitivos.
- O jogo deve ser PEGI-12 e adequado a uma audiência de 13 anos ou mais; não apresentar o produto como jogo direcionado a crianças.
- O jogo deve funcionar em landscape no desktop e pode declarar orientações compatíveis no envio.
- Full Launch exige SDK real, gameplay start/stop e QA adicional; isso não é requisito para começar o Basic Launch.

### Posicionamento específico

Para CrazyGames, o Neon Dodge será descrito como arcade casual de ficção científica para audiência geral 13+, PEGI-12, sem linguagem de produto infantil. A fantasia pode continuar acessível e amigável, mas a comunicação não deve usar “crianças de 9–12 anos” como público-alvo nessa plataforma, pois isso conflita com o requisito público do portal.

### Métricas para decisão

- conversão para gameplay de pelo menos um minuto;
- average playtime;
- Day 1 retention;
- abandono antes do primeiro input;
- retorno após morte;
- entendimento dos controles;
- feedback qualitativo do portal.

Os números publicados pelo portal são referências de diagnóstico, não metas garantidas. A decisão deve comparar os dados do Neon Dodge com os benchmarks vigentes no dashboard e com jogos da categoria.

## Frente Poki

### Fluxo

`aplicação de desenvolvedor → análise/aprovação da conta → ferramentas do portal → submissão/playtest Poki → QA → iteração → lançamento`

O acesso à área de desenvolvedor deve ser feito pelo portal oficial. A aplicação será preparada sem inventar experiência ou métricas: o Neon Dodge é um MVP próprio em HTML5 Canvas/WebGL, com build offline, controles touch/keyboard, progressão cosmética e Mock local do SDK.

### Informações preparadas para a aplicação

- **Título:** Neon Dodge.
- **Gênero:** Arcade / Hypercasual.
- **Tecnologia:** HTML5, JavaScript, WebGL2 com fallback Canvas.
- **Descrição curta:** Um arcade de um toque em que NOVA atravessa trilhos de energia e desvia de Glitches para alcançar o próximo beacon.
- **Diferencial:** troca imediata de faixa, identidade narrativa procedural e progressão cosmética sem alterar a justiça da dificuldade.
- **Plataformas:** navegador desktop, mobile e tablet.
- **Estado:** MVP técnico pronto para avaliação e playtest; métricas de jogadores reais ainda pendentes.
- **Rede:** sem CDN, analytics externo, backend ou requests no build-base.
- **Localização:** inglês como fallback global, com pt-BR e demais traduções locais.

### Pré-envio

- [x] Core loop jogável.
- [x] Primeiro toque e reinício definidos.
- [x] Persistência protegida contra falha de localStorage.
- [x] Bundle abaixo do limite operacional do projeto.
- [x] Testes automatizados e verificação visual local.
- [ ] Aplicação de desenvolvedor enviada pelo portal oficial.
- [ ] Acesso ao Poki Inspector/playtest obtido.
- [ ] Teste da build pelo Inspector.
- [ ] Evidência de onboarding, loading, mobile e lifecycle do SDK real.
- [ ] Thumbnail, descrição, controles e localização finais.

## Regra de evidência

Os estados devem ser registrados separadamente:

- **Técnico:** testes, build, responsividade, rede e estabilidade.
- **Portal:** aplicação, QA, aprovação, preview e integração do SDK.
- **Jogadores reais:** conversão, tempo de sessão, retenção e retorno.
- **Comercial:** monetização e distribuição após autorização do estágio.

Não marcar o Neon Dodge como validado comercialmente enquanto os dois últimos grupos não possuírem evidência externa.

## Próximo avanço executável

1. Revisar o pacote em inglês e o posicionamento PEGI-12/13+.
2. Abrir o Preview do CrazyGames e executar o QA de submissão.
3. Preparar a aplicação Poki com as informações acima.
4. Após a entrada em Basic Launch ou Poki Playtest, analisar os dados reais antes de alterar o core loop.

## Fontes oficiais revalidadas

- CrazyGames Requirements: https://docs.crazygames.com/requirements/intro/
- CrazyGames Technical Requirements: https://docs.crazygames.com/requirements/technical/
- CrazyGames Gameplay Requirements: https://docs.crazygames.com/requirements/gameplay/
- CrazyGames Quality Guidelines: https://docs.crazygames.com/requirements/quality/
- CrazyGames Game Covers: https://docs.crazygames.com/requirements/game-covers/
- CrazyGames FAQ: https://docs.crazygames.com/faq/
- CrazyGames Basic Launch Metrics: https://docs.crazygames.com/resources/basic-launch-metrics/
- Poki Developer Guide: https://developers.poki.com/guide
- Poki Easy Access: https://developers.poki.com/guide/easy-access
- Poki Localization: https://developers.poki.com/guide/localization
- Poki Game Development Tools: https://developers.poki.com/guide/game-dev-tools
