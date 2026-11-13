# EcoLab Live — Etapa 2.5: base visual final

Implementada localmente em **12/11/2026**, após aprovação do plano e do aumento de civis com aparências individuais. Trabalho restrito ao EcoLab. Não houve instalação de dependências, incorporação de assets externos, publicação ou avanço para EcoVoz/backend/simulação.

## Resultado visual

| Elemento | Etapa 2 | Etapa 2.5 |
| --- | ---: | ---: |
| Terreno | 60 × 44 | 72 × 56 (+52,7% de área) |
| Edifícios | 7 | 15 |
| Veículos | 2 | 4 |
| Civis | 3 | 20 |
| Circuitos de veículos | 2 | 3 |
| Percursos de pedestres | 2 | 8 |
| Pontes | 2 | 3 |
| Bicicletas estacionadas | 0 | 6 |
| Atalhos de lugares | 0 | 6 |

A expansão acrescenta uma rua comercial ao norte, área de saúde, quarteirão escolar ao sul, novas moradias e conexões pelas bordas. Um veículo percorre a nova ligação entre comércio e vila. O enquadramento inicial mostra o conjunto ampliado com escola, quadra e canal na frente da composição.

**Escola das Águas:** prédio baixo com fachada quente, identificação legível, cobertura de entrada e pilares; playground com torre, escada, escorregador e dois balanços; quadra com linhas, círculo central, gols e cercamento com abertura de acesso. Calçadas, árvores, bancos e bicicletas integram a área ao bairro. As crianças percorrem a passagem entre escola e quadra. Os equipamentos não têm animação de uso.

**Comércio e saúde:** mercado, padaria e livraria possuem vitrines, toldos e letreiros próprios. A unidade de saúde tem faixa verde/ciano, símbolo de atendimento e entrada coberta. Apartamentos ganharam varandas; casas mantêm telhados, cores e proporções residenciais. Todos aproveitam o gerador de edifícios existente, com variações explícitas por função.

**Canal e parque:** água mais clara com brilho e movimento discreto; margens estendidas, guarda-corpos, terceira ponte, passeios nas duas margens dos trechos externos, vegetação, bancos e conexão com os novos quarteirões. O parque conserva sua identidade, com sinalização, arbustos e bicicletário. A margem leste central continua condicionada à ocupação existente; não foi criada uma passagem contínua atrás do café.

**Civis:** vinte registros estáveis com combinações únicas de cores de roupa e calça/saia, pele, cabelo, altura, porte, penteado e acessórios. Há mochilas, bonés, bolsas, óculos e variações de cabelo. Três crianças menores circulam junto à escola. Outros grupos ocupam centro, comércio, saúde, margem sul, parque e novas moradias. Não são vinte cópias do mesmo personagem com uma única troca de cor.

## Arquitetura e desempenho

- Preservados React, TypeScript, R3F, Three.js, as duas rotas originais de veículos, as duas rotas originais de pedestres e velocidades dos cinco agentes iniciais.
- A população inteira usa duas geometrias e dois materiais instanciados. Matrizes de corpos, membros e acessórios são atualizadas fora dos renders React; as funções matemáticas existentes continuam conduzindo o movimento.
- Peças arquitetônicas, equipamentos, vegetação e mobiliário reutilizam o instanciamento existente. Rodas das bicicletas também são instanciadas.
- Novas superfícies entram na validação espacial original. Colisores de escola, quadra, equipamentos, pilares, bicicletários, arbustos e suportes acompanham a exploração.
- Os seis lugares de apresentação têm configuração própria, separada dos pontos ambientais. IDs `corrego-01`, `area-verde-01` e `residencial-01` foram preservados.
- Os perfis alto e reduzido existentes continuam disponíveis. Não foi necessário alterar `quality.ts` ou reescrever `Vegetation.tsx`.

## Comparação medida

Referência da etapa 2 medida novamente **antes de alterar a cena**, servindo seu build local. Medição final realizada após construir a versão 2.5.

Ambiente: **Windows, Edge headless 157, NVIDIA GeForce GTX 1650, ANGLE/Direct3D11**. Viewport 1440 × 1000; DPR 1; canvas e buffer de desenho igualados a **1440 × 867** nos dois builds. Três janelas de dez segundos por perfil, após aquecimento, com animações ativas. O layout normal é restaurado antes da validação da interface e das medições de exploração.

| Cenário | FPS médio antes | FPS médio depois | Draw calls antes → depois | Triângulos antes → depois |
| --- | ---: | ---: | --- | --- |
| Visão geral — alto | 144,00 | 143,97 | 191 → 228 | 90.776 → 179.260 |
| Visão geral — reduzido | 143,60 | 144,00 | 122 → 163 | 33.278 → 72.264 |
| Exploração — alto | 143,80 | 141,57 | 133–169 → 132–156 | 85.830–86.986 → 169.598–170.110 |

O p95 de intervalo por amostra foi **7,1 ms** em ambos os builds. Uma janela de exploração final teve média de **136,81 FPS**, preservada no relatório; as outras tiveram 144,00 e 143,90 FPS. Não foi descartada nem substituída a amostra mais lenta.

No perfil alto, houve **+19,37% de draw calls** e **+97,48% de triângulos**. No reduzido, **+33,61%** e **+117,15%**, respectivamente. São leituras de `renderer.info` ao final das janelas, incluindo passes de sombra, e não contagens independentes do enquadramento. Na exploração, a população instanciada permanece renderizável como conjunto, mesmo com parte dos civis fora do campo de visão.

| Build completo | Antes | Depois | Variação |
| --- | ---: | ---: | ---: |
| Arquivos sem compressão | 1.481.518 bytes | 1.499.959 bytes | +18.441 bytes / +1,24% |
| Soma dos arquivos comprimidos individualmente com gzip | 418.271 bytes | 424.764 bytes | +6.493 bytes / +1,55% |

O build inclui HTML, CSS, JavaScript e documento de licenças copiado de `public/`. O valor gzip é uma medição local, não uma medição de transferência HTTP em produção.

A meta de 60 FPS foi atendida **no ambiente medido**. O ensaio fica limitado a aproximadamente 144 Hz e mede intervalos de `requestAnimationFrame`, não tempo isolado da GPU. A taxa próxima do teto não significa custo gráfico igual ao anterior. Não houve teste em GPU integrada, celular físico, DPR alto ou sessão térmica prolongada.

## Testes e validação

| Verificação | Resultado |
| --- | --- |
| `npm.cmd run typecheck` | Aprovado |
| `npm.cmd test` | 44 testes aprovados em 8 arquivos |
| `npm.cmd run build` | Aprovado |
| `node --check scripts/verify-browser.mjs` | Aprovado |
| `git diff --check` | Aprovado |
| Edge por Chrome DevTools Protocol | 34 verificações aprovadas |
| Console e carregamento de recursos | Nenhum erro/falha registrado |

A base anterior tinha 35 testes. A expansão acrescentou cobertura parametrizada para uma rota de veículo e seis rotas de pedestres, mais testes de diversidade/distribuição e visitas de câmera. As expectativas antigas de quantidade fixa foram atualizadas para conferir explicitamente a preservação dos agentes e rotas originais e permitir os novos registros.

Os testes amostram o espaço corporal de todos os percursos contra superfícies e obstáculos. A conectividade entre a posição inicial e vila, parque, praça, canal, escola, comércio, saúde e novas moradias é verificada por busca espacial com a mesma função de colisão da caminhada. Foram corrigidas interferências detectadas em árvores, placas, bancos e acessos da escola.

No navegador foram verificados câmera ortográfica, zoom, rotação, reset, seleção por raycast, pontos ambientais, clique real nos seis atalhos, ausência de sobreposição nos atalhos, presença dos 24 agentes, congelamento de todos na pausa, igualdade de pixels durante pausa, retomada individual de todos os agentes, caminhada por WASD, travessia da ponte, bloqueio de borda, mouse, saída por Esc e trocas de câmera sem acúmulo de geometrias/texturas. A conectividade de todos os bairros foi validada automaticamente; o percurso presencial por cada rua não foi realizado.

Capturas reais foram inspecionadas para visão geral, escola, comércio, saúde, canal, exploração e layout móvel. A referência e a versão final usam o mesmo computador. A primeira tentativa de automação dentro do sandbox expirou ao acessar o navegador; a execução autorizada fora do sandbox concluiu normalmente com perfil isolado dentro do EcoLab.

## Arquivos

**Criados (5):**

- `src/features/eco-sim/config/places.ts`
- `src/features/eco-sim/components/CityPlaces.tsx`
- `src/features/eco-sim/entities/SchoolCampus.tsx`
- `src/features/eco-sim/scene/PlaceLabels.tsx`
- `docs/ETAPA_2_5.md`

**Modificados (21):**

- `README.md`
- `public/assets/ASSET_LICENSES.md`
- `scripts/verify-browser.mjs`
- `src/app/App.tsx`
- `src/app/styles.css`
- `src/features/eco-sim/config/city.ts`
- `src/features/eco-sim/config/regions.ts`
- `src/features/eco-sim/config/routes.ts`
- `src/features/eco-sim/config/urbanLayout.ts`
- `src/features/eco-sim/config/urbanLayout.test.ts`
- `src/features/eco-sim/entities/Building.tsx`
- `src/features/eco-sim/entities/Pedestrian.tsx`
- `src/features/eco-sim/entities/StreetFurniture.tsx`
- `src/features/eco-sim/movement/routeValidation.ts`
- `src/features/eco-sim/movement/routeValidation.test.ts`
- `src/features/eco-sim/navigation/cameraState.ts`
- `src/features/eco-sim/navigation/cameraState.test.ts`
- `src/features/eco-sim/scene/CameraRig.tsx`
- `src/features/eco-sim/scene/CityEnvironment.tsx`
- `src/features/eco-sim/scene/CityScene.tsx`
- `src/features/eco-sim/scene/Water.tsx`

`dist/` foi regenerado. Evidências, temporários e perfil de navegador ficam em `.local/etapa-2-5/`; caches das ferramentas podem ter sido atualizados dentro do projeto. Nenhum arquivo de dependências foi alterado. Não foram executadas operações Git destrutivas, commits ou publicação.

## Evidências

- [Visão geral anterior](../.local/etapa-2-5/before-desktop.png)
- [Visão geral final](../.local/etapa-2-5/after-desktop.png)
- [Escola, crianças, playground e quadra](../.local/etapa-2-5/after-school.png)
- [Comércio](../.local/etapa-2-5/after-market.png)
- [Saúde](../.local/etapa-2-5/after-health.png)
- [Canal](../.local/etapa-2-5/after-canal.png)
- [Vila](../.local/etapa-2-5/after-village.png)
- [Parque](../.local/etapa-2-5/after-park.png)
- [Exploração](../.local/etapa-2-5/after-explore-start.png)
- [Layout móvel](../.local/etapa-2-5/after-mobile.png)
- [Medição anterior](../.local/etapa-2-5/before-results.json)
- [Medição final](../.local/etapa-2-5/after-results.json)

Esses arquivos são locais, ignorados pelo Git, e não integram o build.

## Assets, limitações e próxima etapa

Toda a geometria, água e animação são procedurais do projeto. Letreiros usam Canvas 2D com fontes do sistema, sem arquivos de fonte externos. A origem está detalhada em [ASSET_LICENSES.md](../public/assets/ASSET_LICENSES.md); não há nova licença de asset externo a atribuir.

Pessoas e veículos seguem rotas fixas, sem colisão dinâmica entre si ou com a câmera; encontros e sobreposições ocasionais continuam possíveis. Os civis são estilizados, sem expressões faciais ou rig esquelético. Bicicletas e equipamentos infantis são estáticos. A água não reflete os prédios nem representa qualidade hídrica. Não há interiores, física ou controles de caminhada por toque. Firefox, Safari e aparelhos físicos não foram testados.

A implementação desta etapa está concluída e disponível para avaliação visual do proprietário. Recomenda-se usar esta versão como base artística, verificar o notebook da apresentação e, mediante nova autorização, iniciar os contratos e fluxo do EcoVoz. EcoVoz, backend, banco, autenticação, persistência, IA, simulação ambiental e deploy não foram iniciados.
