# EcoLab Live — Entrega da etapa 2

Implementação local em **12/11/2026**, dentro de C:\Users\Caio\Desktop\EcoLab, após aprovação do plano. A entrega fica disponível para avaliação do proprietário. Não houve publicação nem avanço para a etapa 3.

## Implementação

- Terreno ampliado de 48 × 36 para 60 × 44 unidades, mantendo o circuito original e as duas pontes.
- Três casas adicionais na **Vila das Águas**, **Parque das Nascentes** com caminhos e praça, e passeio ribeirinho conectado às calçadas.
- Quatro regiões com IDs: centro, residencial-oeste, parque-leste e corrego-central.
- Fachadas com pavimentos de proporções revisadas, caixilhos, peitoris, portas com maçanetas, marquises, coberturas, chaminés e painéis solares.
- Bancos com ripas, postes, lixeiras, placas, faixas e juntas de pavimentação. Posições dos sólidos compartilhadas com a navegação.
- Troncos cilíndricos, copas com quatro volumes e movimento discreto; plantas nas margens do córrego.
- Materiais PBR para sólidos, vidro e metal. Luz natural com sombras filtradas de 2048² no perfil alto.
- Água com ondulação contínua, variação nas margens, brilho e aproximação de Fresnel dependente da câmera. Sem reflexão real da cena.
- Dois veículos compactos com janelas e proporções revisadas, maçanetas e raios visíveis nas rodas. Pedestres com torso arredondado e suavização da amplitude de caminhada durante as pausas.
- Interface em português, tema escuro verde/ciano, seleção de câmera, instruções, painel ambiental, qualidade e métricas opcionais.

## Câmeras e colisões

**Visão geral:** câmera ortográfica, rotação e zoom limitados, reset que elimina a inércia residual, enquadramento para a área expandida e aproximação dos pontos ambientais.

**Explorar cidade:** perspectiva de 65°, olhos a 1,65 m sobre o piso, WASD, direção pelo mouse, captura do ponteiro e alternativa por arraste. Esc, perda de captura ou botão retornam à visão geral. O foco do teclado fica no canvas; inputs e botões não são tratados como comandos de caminhada.

A aceleração usa integração exponencial dependente do tempo. Eventos de blur e visibilidade limpam as teclas; os listeners são removidos ao sair do modo. Frames muito longos são limitados a 100 ms para evitar saltos após interrupções.

A geometria de colisão usa caixas para edifícios, entradas, bancos, canteiros, troncos, postes, lixeiras, placas e guarda-corpos. O corpo circular tem raio de 0,27 m. Há verificação de apoio em 16 amostras do perímetro, subdivisão do deslocamento em até 8 cm e deslizamento nas bordas. O córrego só pode ser cruzado pelas pontes; gramados sem caminho não são superfícies de exploração.

Não foi adicionado motor de física. Os agentes continuam seguindo o sistema matemático original.

## Pontos e preparação para integração

| ID estável | Região | Coordenada do marcador (x, y, z) |
| --- | --- | --- |
| corrego-01 | corrego-central | (5,5; 1,1; 1,5) |
| area-verde-01 | parque-leste | (25,5; 1,2; 3) |
| residencial-01 | residencial-oeste | (-26,7; 5,1; 0) |

Cada registro contém categoria, nome, descrição, posição e alvo de enquadramento. Os marcadores são objetos 3D selecionados por raycast, com rótulos projetados a partir da posição real e oclusão. O painel também permite selecionar e aproximar cada local.

Tipos e configuração estão separados dos componentes de apresentação. Não há acesso de rede nos componentes de pontos. IDs são chaves para integração; alterações futuras nos nomes não devem alterar os IDs.

Não foram criados API, endpoints, autenticação, banco, persistência, formulários de denúncia ou simulações ambientais.

## Bibliotecas e modelos

Dependências existentes preservadas: React/React DOM 19.3.1, Three.js 0.187.0, React Three Fiber 9.8.2, Drei 10.7.9, MUI 9.5.0 e Emotion 11.14.x. TypeScript 7.0.2, Vite 8.3.8 e Vitest 5.1.0 permanecem nas ferramentas de desenvolvimento.

Nenhuma instalação foi executada. Todos os modelos são procedurais. As páginas de Kenney City Kit (Suburban) e Quaternius Ultimate Animated Character Pack foram consultadas novamente; ambas informam CC0. O pacote Quaternius consultado anuncia FBX, OBJ e Blend. Foi escolhido manter a geometria própria para preservar dimensões, colisões e coerência sem conversões ou novos arquivos de modelos.

Referências e decisão completas em [ASSET_LICENSES.md](../public/assets/ASSET_LICENSES.md).

## Testes e verificação

| Verificação | Resultado |
| --- | --- |
| npm.cmd run typecheck | Aprovado |
| npm.cmd test | 35 testes aprovados em 8 arquivos |
| npm.cmd run build | Aprovado |
| node --check scripts/verify-browser.mjs | Aprovado |
| git diff --check | Aprovado |
| Edge por Chrome DevTools Protocol | 25 verificações aprovadas |
| Console / carregamento de recursos | Nenhum erro ou requisição com falha |

Os **18 testes anteriores** foram preservados. Os **17 testes novos** verificam superfícies permitidas, raio corporal, água, obstáculos, limites, travessia de pontes, deslocamentos longos, deslizamento, equivalência de movimento a 30/60/144 FPS, transições de câmera, seleção por ID, coordenadas e estatísticas.

A conectividade entre a posição inicial, vila, parque, praça e passeio do córrego foi testada por busca em uma malha de posições permitidas. Os testes também conferem os waypoints e velocidades originais e amostram o espaço dos agentes contra os novos sólidos.

No navegador foram verificados:

- Carregamento, projeção ortográfica, zoom, rotação, reset e eliminação da inércia.
- Marcador selecionado na cena por raycast; seleção e enquadramento dos três pontos pelo painel.
- Coordenadas projetadas mudam com a câmera, mantendo as coordenadas no mundo.
- Pausa dos cinco agentes e igualdade dos pixels da cena durante a pausa, incluindo água e vegetação; retomada do movimento.
- Perspectiva na altura prevista, WASD, direção pelo mouse, cruzamento de ponte e bloqueio ao terminar a superfície válida.
- Esc e botão de retorno; ciclos de troca de câmera sem crescimento de geometrias/texturas.
- Viewports desktop 1440 × 1000 e móvel 390 × 844, sem transbordamento horizontal; captura da página móvel completa.
- Inspeção visual das capturas geral, residencial, parque, córrego e exploração.

## Comparação de desempenho

Referência da etapa 1 medida novamente **antes de alterar o cenário**, além do relatório histórico existente.

Ambiente: Windows, Edge headless 157, ANGLE/Direct3D11, **NVIDIA GeForce GTX 1650**, viewport 1440 × 1000, DPR 1. Para a comparação dos perfis, o canvas foi igualado a **1440 × 867 pixels**, incluindo o buffer de desenho. O script restaura o layout normal após medir.

Cada perfil usa **três amostras de dez segundos**, com aquecimento e animações ativas. A exploração usa três amostras adicionais no ponto inicial; não representa toda a cidade ou um percurso prolongado.

| Cenário / perfil | FPS médio¹ | p95 por amostra | Draw calls² | Triângulos² |
| --- | ---: | ---: | ---: | ---: |
| Etapa 1 — alto | 143,5 | 7,1 ms | 149 | ≈38.200 |
| Etapa 2 — alto | 142,6 | 7,1 ms | 191 | 90.776 |
| Etapa 1 — reduzido | 142,4 | 7,1 ms | 89 | ≈18.600 |
| Etapa 2 — reduzido | 143,9 | 7,1 ms | 122 | 33.278 |
| Etapa 2 — exploração, alto | 144,0 | 7,1 ms | 133–169 | 85.830–86.986 |

¹ Média das três janelas. O p95 é calculado por janela, não um p95 agregado de todo o ensaio. FPS e intervalo são medidos com requestAnimationFrame; não são tempos isolados da GPU.  
² Valores lidos ao final das janelas em renderer.info, incluindo passes de sombra. Na etapa 1, os triângulos foram registrados pelo painel com arredondamento.

A taxa de atualização de aproximadamente 144 Hz limita as amostras. A cena atingiu a meta de 60 FPS **neste ambiente medido**, mas isso não demonstra custo de GPU igual ao anterior. O trabalho geométrico aumentou: cerca de **28% mais draw calls no alto** e **137,6% mais triângulos**, com copas mais densas e sombras maiores. O perfil reduzido desativa sombras, reduz as copas e a água e limita o DPR a 1.

| Build completo | Etapa 1 | Etapa 2 |
| --- | ---: | ---: |
| Tamanho sem compressão, incluindo licença e HTML | 1.451.711 bytes | 1.481.518 bytes |
| Variação | — | aproximadamente +2,05% |

O JavaScript permanece separado entre interface e cena, com carregamento tardio da cena. Os tamanhos individuais e gzip calculado por arquivo estão nos relatórios JSON; o compressor do Vite pode apresentar valores gzip ligeiramente diferentes.

O renderer registrou **122 geometrias e 3 texturas internas** antes e depois de quatro ciclos de troca de modo. Isso demonstra estabilidade nesse ensaio, não ausência comprovada de todo vazamento de memória ou uma medida em MB de VRAM. As texturas contadas incluem recursos internos do renderer, não downloads de assets.

## Arquivos modificados

- src/app/App.tsx
- src/app/styles.css
- src/features/eco-sim/types.ts
- src/features/eco-sim/config/city.ts
- src/features/eco-sim/config/quality.ts
- src/features/eco-sim/components/SimulationControls.tsx
- src/features/eco-sim/components/SceneStatus.tsx
- src/features/eco-sim/scene/CityScene.tsx
- src/features/eco-sim/scene/CameraRig.tsx
- src/features/eco-sim/scene/CityEnvironment.tsx
- src/features/eco-sim/scene/Water.tsx
- src/features/eco-sim/entities/Building.tsx
- src/features/eco-sim/entities/Vegetation.tsx
- src/features/eco-sim/entities/Vehicle.tsx
- src/features/eco-sim/entities/Pedestrian.tsx
- README.md
- public/assets/ASSET_LICENSES.md

## Arquivos criados

- src/features/eco-sim/config/regions.ts
- src/features/eco-sim/config/environmentalPoints.ts
- src/features/eco-sim/config/environmentalPoints.test.ts
- src/features/eco-sim/config/urbanLayout.ts
- src/features/eco-sim/config/urbanLayout.test.ts
- src/features/eco-sim/navigation/collision.ts
- src/features/eco-sim/navigation/collision.test.ts
- src/features/eco-sim/navigation/movement.ts
- src/features/eco-sim/navigation/movement.test.ts
- src/features/eco-sim/navigation/cameraState.ts
- src/features/eco-sim/navigation/cameraState.test.ts
- src/features/eco-sim/scene/ExplorationCamera.tsx
- src/features/eco-sim/scene/EnvironmentalMarkers.tsx
- src/features/eco-sim/entities/StreetFurniture.tsx
- src/features/eco-sim/components/EnvironmentalPanel.tsx
- src/features/eco-sim/performance/metrics.ts
- src/features/eco-sim/performance/metrics.test.ts
- scripts/verify-browser.mjs
- docs/ETAPA_2.md

O build atualizou dist/ e as ferramentas podem atualizar caches locais. Evidências e perfil de navegador estão em .local/etapa-2/, ignorados pelo Git. package.json, package-lock.json, config/routes.ts e o diretório movement/ não foram alterados.

## Evidências locais

- [.local/etapa-2/baseline-results.json](../.local/etapa-2/baseline-results.json)
- [.local/etapa-2/stage2-results.json](../.local/etapa-2/stage2-results.json)
- [Visão geral](../.local/etapa-2/stage2-desktop.png)
- [Exploração](../.local/etapa-2/stage2-explore-start.png)
- [Vila residencial](../.local/etapa-2/stage2-residential.png)
- [Parque](../.local/etapa-2/stage2-park.png)
- [Córrego](../.local/etapa-2/stage2-creek.png)
- [Página móvel](../.local/etapa-2/stage2-mobile.png)

Esses artefatos não integram o build nem substituem os testes versionados.

## Limitações e riscos

- Arte procedural ainda estilizada, especialmente personagens e veículos; sem rig esquelético ou animação de contato adaptativo dos pés.
- Colisões estáticas e apoio amostrado. Sem colisão dinâmica câmera–agente, agente–agente, tráfego autônomo, gravidade ou física completa.
- A altura acompanha o piso; transições entre rua e calçada podem produzir pequenos degraus visuais.
- Navegação a pé requer teclado e mouse. Interface móvel validada por viewport emulado; não houve ensaio em telefone físico nem controle de caminhada por toque.
- Não foram testados Safari, Firefox, GPUs integradas, DPR alto ou sessões térmicas prolongadas. A medição headless não substitui a avaliação presencial no notebook do apresentador.
- A água aproxima efeitos visuais; não reflete edifícios nem representa qualidade hídrica.
- A geometria expandida custa mais para renderizar; o resultado medido não garante a mesma taxa em todo hardware.

## Recomendações para a etapa 3

Após avaliação e nova autorização: validar a direção artística com o público, testar o notebook de apresentação e uma GPU integrada, ampliar acessibilidade/controles por toque se necessário e definir contratos de dados de EcoVoz/EcoSim mantendo os IDs publicados. Planejar API TypeScript em Cloudflare Workers e D1 somente a partir desses requisitos. Nenhuma dessas integrações foi iniciada nesta entrega.

