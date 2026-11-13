# Prova visual — Escola das Águas

Implementação do piloto aprovada pelo proprietário e concluída em 12/11/2026 (horário de São Paulo). **A aprovação artística continua pendente.** O padrão não foi aplicado ao restante da cidade.

## Comparação visual

[Abrir comparação interativa local](../.local/school-pilot/comparison.html).

| Enquadramento | Antes | Depois |
| --- | --- | --- |
| Isométrico | [PNG](../.local/school-pilot/before-fixed-isometric.png) | [PNG](../.local/school-pilot/after-fixed-isometric.png) |
| Fachada | [PNG](../.local/school-pilot/before-fixed-facade.png) | [PNG](../.local/school-pilot/after-fixed-facade.png) |
| Córrego | [PNG](../.local/school-pilot/before-fixed-canal.png) | [PNG](../.local/school-pilot/after-fixed-canal.png) |

São renders reais do WebGL, não imagens geradas ou retoques. Mesma câmera, alvo, projeção, resolução e iluminação global nos pares. Agentes são ocultados nas capturas comparativas e o tempo da água é fixado em zero; a validação funcional e os benchmarks mantêm os agentes ativos. Os PNGs têm fundo transparente. A página comparativa aplica um fundo neutro idêntico aos dois lados.

As evidências ficam em `.local/`, ignorado pelo Git. Para compartilhar o relatório, leve também essa pasta de evidências; não é necessário compartilhar `sources/` nem o perfil do navegador.

## Implementação

- Escola montada com módulos externos de alvenaria, portas, esquadrias e cornija do **Modular Factory Facade**. Foi aproveitada a implantação existente de 9 × 4,4 m. Cobertura e marquise são geometrias simples de integração. Letreiro, playground, quadra e acessos foram preservados.
- Materiais PBR de tijolo, asfalto, concreto e solo, com cor em sRGB, normal OpenGL e ARM. Escala de repetição ajustada às superfícies; sem mapas 4K ou 8K.
- Árvores externas em dois níveis de detalhe: **56.896** triângulos na versão alta e **21.212** na reduzida, ante **1.072.213** no original. Árvores e grama são instanciadas; malhas e texturas são compartilhadas.
- Bancos, arbusto e alambrado externos. Folhas, grama, arbusto e cerca recebem os canais alpha corretos do fornecedor, combinados às texturas de cor. Teste automatizado verifica que os WebPs realmente contêm transparência.
- Trecho sul do córrego com revestimento de tijolo, passeios PBR, substituição dos antigos juncos retangulares e água de cor mais natural. A água continua sendo um shader leve, sem reflexão da cena.
- Ambiente pré-filtrado local para materiais importados, gerado uma vez por contexto WebGL com `RoomEnvironment`. Sem renderização extra de reflexos por frame, HDRI externo ou mudança da iluminação global.
- A cidade não cresceu. Configurações de rotas, edifícios, colisões, câmeras e população não foram editadas neste piloto. Permanecem 20 civis diferentes e quatro veículos.

Origem, licença CC0 e adaptações: [ASSET_LICENSES.md](../public/assets/ASSET_LICENSES.md). Inventário e hashes: [manifest.json](../public/assets/school-pilot/manifest.json). Os GLBs são servidos localmente; o aplicativo não consulta o Poly Haven em runtime.

## Desempenho medido

Edge 157 headless, Windows, NVIDIA GeForce GTX 1650 via ANGLE/D3D11. Viewport 1440 × 1000; canvas de benchmark 1440 × 867; DPR 1. Três amostras de dez segundos por perfil, após aquecimento. Qualidade alta e reduzida medidas pelo atalho da escola; exploração medida no ponto inicial original.

| Perfil | FPS médio antes → depois | Draw calls antes → depois | Triângulos antes → depois |
| --- | ---: | ---: | ---: |
| Escola, alta | 143,97 → 144,00 | 123 → 320 | 166.424 → 1.343.630 |
| Escola, reduzida | 141,37 → 144,00 | 61 → 168 | 59.475 → 331.586 |
| Exploração, alta | 144,00 → 143,97 | 140 → 257 | 169.769 → 1.289.802 |

FPS é a média das três amostras de intervalos `requestAnimationFrame`. Draw calls e triângulos são médias dos três snapshots de `renderer.info.render`, incluindo passes de sombra; não uma média de todos os frames. Os snapshots variam com a posição dos agentes e o recorte da câmera. P95 ficou em 7,0–7,1 ms depois, contra 7,1–7,2 ms antes.

**O custo de renderização aumentou:** na escola em alta, aproximadamente 2,6 vezes as chamadas e 8,1 vezes os triângulos. O FPS próximo de 144 está limitado pela cadência do ambiente de teste e não demonstra sobra proporcional de GPU. O piloto passou da meta de 60 FPS nessa máquina; não foram medidos celulares, GPUs integradas, consumo de VRAM ou tempo de GPU por timer query. O teste de layout móvel não equivale a benchmark em celular.

Assets distribuídos: **14.948.703 bytes (14,95 MB)**, abaixo do orçamento de 15.000.000 bytes. Inclui os dois níveis da árvore; o carregamento normal solicita o nível correspondente à qualidade. Fontes originais ficam fora do build.

Build anterior: **1.500.765 bytes**. Build final, incluindo o documento de licenças atualizado: **16.534.406 bytes (16,53 MB)**. Gzip somado por arquivo: **425.051 → 13.452.165 bytes**. Isso é uma estimativa de compressão, não medição de transferência HTTP nem de tempo de carregamento. O relatório do benchmark registra 16.531.830 bytes porque foi salvo antes da atualização documental; o JavaScript e os modelos são os mesmos. O inventário final fica em `.local/school-pilot/final-build.json`.

Dados completos: [antes](../.local/school-pilot/before-results.json) e [depois](../.local/school-pilot/after-results.json). A referência anterior foi capturada antes das alterações artísticas. Não execute `--capture=before` no código atual para tentar recriá-la.

## Testes e validação

- `npm.cmd run typecheck`: aprovado.
- `npm.cmd test`: **48 testes aprovados em nove arquivos**, incluindo os testes anteriores e quatro testes do piloto.
- `npm.cmd run build`: aprovado.
- Navegador real: **35 verificações aprovadas**, incluindo carregamento dos modelos, câmeras ortográfica e de exploração, zoom, rotação, reset, raycast, pontos ambientais, seis atalhos, 20 civis/quatro veículos, pausa/retomada, caminhada, ponte, bloqueio de navegação, mouse, Esc, estabilidade de geometrias/texturas ao trocar câmera e layout móvel.
- Console sem erros e requisições sem falhas na execução final. Três enquadramentos fixos inspecionados visualmente; corrigidos alpha do alambrado e escala do revestimento do canal durante a revisão.

## Arquivos deste piloto

Modificados:

- `src/features/eco-sim/scene/CityScene.tsx`: diagnóstico de assets e captura comparável.
- `src/features/eco-sim/scene/CityEnvironment.tsx`: integração do piloto e remoção das representações substituídas.
- `src/features/eco-sim/scene/Water.tsx`: aparência regional da água.
- `src/features/eco-sim/scene/PlaceLabels.tsx`: posição e dimensão do letreiro escolar.
- `src/features/eco-sim/entities/SchoolCampus.tsx`: substituição da cerca procedural.
- `src/features/eco-sim/entities/Vegetation.tsx` e `StreetFurniture.tsx`: exclusão dos elementos substituídos na região.
- `src/features/eco-sim/config/quality.ts`: níveis de árvore e densidade de grama.
- `scripts/verify-browser.mjs`: protocolo e evidências do piloto.
- `package.json`, `package-lock.json`: ferramenta de preparo como dependência de desenvolvimento.
- `README.md`, `public/assets/ASSET_LICENSES.md`: execução, escopo e origens.

Criados:

- `src/features/eco-sim/config/schoolArt.ts` e `schoolArt.test.ts`.
- `src/features/eco-sim/scene/SchoolArtRegion.tsx`.
- `src/features/eco-sim/entities/SchoolAsset.tsx`.
- `src/features/eco-sim/materials/schoolMaterials.ts`.
- `scripts/prepare-school-assets.mjs`.
- `public/assets/school-pilot/`: sete GLBs, 12 mapas WebP e manifesto.
- Este relatório e evidências em `.local/school-pilot/`; build regenerado em `dist/`.

O repositório já continha alterações da etapa 2.5 anterior. A lista acima corresponde a este piloto, e não a todos os arquivos exibidos por `git status`.

## Limites e próxima decisão

O resultado é um piloto de materiais e modelos mais naturais, ainda combinado com uma cidade estilizada. Playground, personagens e veículos continuam procedurais; não há interiores, pedestres escaneados, reflexos reais da água, vegetação animada nos novos GLBs ou tratamento global cinematográfico. A árvore escolhida tem copa irregular e relativamente aberta. As colisões permanecem aproximações da base existente, sem colisão por triângulo dos novos modelos.

`npm audit` reportou quatro avisos moderados na cadeia de desenvolvimento `@gltf-transform/cli → @donmccurdy/caporal → glob/minimatch`: possíveis consumos excessivos de recursos em globbing. A correção sugerida pelo npm envolve downgrade principal da CLI; não foi aplicada automaticamente. Essas dependências não integram o JavaScript entregue ao navegador. O preparo usa arquivos conhecidos do Poly Haven, e não arquivos arbitrários fornecidos por usuários.

A próxima decisão é a aprovação visual destes três pares de imagens. Não foi iniciada a propagação para outras regiões, EcoVoz, backend ou simulação ambiental. Antes de propagar este padrão, convém medir um dispositivo menos potente e manter o orçamento de download e geometria por região.
