# Neon Dodge — Metadados de submissão

Preenchido de forma determinística a partir do jogo implementado. Revalidar no portal do desenvolvedor antes de cada envio.

## Identidade

- **Título:** Neon Dodge
- **Gênero:** hipercasual, esquiva por faixas, corrida infinita
- **Público-alvo:** núcleo de 9 a 12 anos, alcance casual amplo
- **Faixa etária:** livre para todas as idades. Sem violência, sangue, combate, texto de chat, compras ou coleta de dados.
- **Orientação:** portrait e landscape, mais desktop
- **Controles:** um toque ou qualquer tecla alterna a faixa. Não existe segundo comando.

## Descrição curta

NOVA conduz o Núcleo Neon por trilhos instáveis. Cada toque alterna a faixa. Sobreviva aos Glitches e alcance o próximo farol.

## Descrição longa

Neon Dodge é um jogo de esquiva de um toque. Você guia NOVA por duas faixas de uma pista neon enquanto os Glitches corrompem a rede. Cada toque alterna a faixa, e é o único comando do jogo.

A cada marco de sobrevivência um farol atravessa a pista e NOVA evolui: novas formas, cores, equipamento e cenários. O progresso fica salvo no seu navegador e o Medidor de Sinal mostra sempre o quanto falta para a próxima conquista.

## Localização

Sete idiomas completos, com as mesmas vinte e oito chaves: inglês, português do Brasil, espanhol, francês, italiano, alemão e turco. Cobre EFIGS. A seleção segue o idioma do navegador, com recuo para inglês.

## Thumbnail

- Origem: `store/covers/thumbnail-628.svg`, gerada por `tools/build-covers.mjs` a partir das mesmas tabelas de arte do jogo.
- Formato: quadrada, 628 por 628, full bleed, sem texto.
- Ideia visual única: NOVA na forma Plasma diante de dois Glitches sobre a pista.
- Regenerar com `node tools/build-covers.mjs` sempre que a arte mudar; `tools/rasterize-covers.html` produz os PNG.

## Privacidade e direitos

- Nenhuma requisição de rede em runtime. A Content Security Policy declara `connect-src 'none'`.
- Nenhum dado pessoal coletado, nenhum analytics, nenhum backend, nenhuma conta.
- Único armazenamento local: `neon-dodge-progression-v1` e a melhor pontuação, ambos no navegador do jogador e tolerantes a falha.
- Arte, código, formas, paleta e áudio são próprios e gerados proceduralmente. Sem assets de terceiros, sem fontes externas, sem CDN.

## Técnico

- WebGL2 com recuo para Canvas 2D e para ausência de contexto.
- Canvas lógico 16:9 em três tamanhos, com `devicePixelRatio` limitado a 2.
- Descarregamento inicial em quatro arquivos, muito abaixo do alvo operacional de 8 a 10 MB.
- Ciclo de vida do SDK: `gameLoadingFinished`, `gameplayStart`, `gameplayStop` e `commercialBreak`, controlados por máquina de estados sem duplicação consecutiva.
- Durante o anúncio o gameplay é interrompido, o input é bloqueado e o áudio é silenciado.

## Pendências que exigem terceiros

- Validar o SDK real da Poki no ambiente autorizado. O Mock local não é prova de integração final.
- Playtest humano em mobile portrait, mobile landscape e desktop.
- Confirmar o entendimento do primeiro toque sem explicação humana.
