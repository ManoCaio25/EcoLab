# Assets — EcoLab Live

Estado atual: o piloto da Escola das Águas usa os assets CC0 abaixo. As seções posteriores preservam o histórico das etapas procedurais anteriores.

## Piloto da Escola das Águas — novembro de 2026

Fonte: **Poly Haven**, API oficial e arquivos em `dl.polyhaven.org`. Licença verificada em [Poly Haven License](https://polyhaven.com/license): [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/), permitindo adaptação e redistribuição. As páginas de origem identificam os colaboradores responsáveis por cada asset.

| Arquivos distribuídos | Origem | Adaptações |
| --- | --- | --- |
| facade.glb | [Modular Factory Facade](https://polyhaven.com/a/modular_factory_facade) | Sete módulos selecionados, composição escolar própria, WebP 1K |
| tree.glb / tree-low.glb | [Island Tree 02](https://polyhaven.com/a/island_tree_02) | Dois níveis de geometria, alpha combinado à cor, texturas 1K/512 |
| shrub.glb | [Shrub 01](https://polyhaven.com/a/shrub_01) | Simplificação, alpha e WebP 1K |
| grass.glb | [Grass Medium 02](https://polyhaven.com/a/grass_medium_02) | Simplificação, alpha e WebP 1K |
| bench.glb | [Painted Wooden Bench](https://polyhaven.com/a/painted_wooden_bench) | WebP 1K e escala local |
| fence.glb | [Modular Chainlink Fence](https://polyhaven.com/a/modular_chainlink_fence) | Seleção de painel/poste, simplificação, alpha e WebP 1K |
| red_brick-*.webp | [Red Brick](https://polyhaven.com/a/red_brick) | Cor, normal OpenGL e ARM, 1K |
| asphalt_02-*.webp | [Asphalt 02](https://polyhaven.com/a/asphalt_02) | Cor, normal OpenGL e ARM, 1K |
| concrete_pavement-*.webp | [Concrete Pavement](https://polyhaven.com/a/concrete_pavement) | Cor, normal OpenGL e ARM, 1K |
| brown_mud_leaves_01-*.webp | [Brown Mud Leaves 01](https://polyhaven.com/a/brown_mud_leaves_01) | Cor, normal OpenGL e ARM, 1K |

Distribuição: `public/assets/school-pilot/`. O manifesto registra origem, licença, tamanho, triângulos e SHA-256 dos GLBs. Fontes de trabalho e cópia da página de licença ficam em `.local/school-pilot/sources/`, fora do build. A aplicação carrega os assets pelo próprio domínio, sem depender do Poly Haven em runtime.

O preparo é reproduzível com `scripts/prepare-school-assets.mjs --download --build`. Não são redistribuídos os conjuntos originais completos. A iluminação de ambiente usa `RoomEnvironment` do Three.js, coberto pela licença MIT da biblioteca; não inclui HDRI externo. Personagens, playground, quadra e demais regiões continuam com geometria do EcoLab.

## Histórico — etapa 2

A cidade usa exclusivamente modelos, materiais e animações procedurais do projeto. Não foram incorporados GLB/GLTF, imagens, texturas, fontes, HDRIs ou outros assets externos. Os ícones são SVGs do código e a tipografia usa fontes do sistema.

| Elemento | Origem | Licença de asset externo |
| --- | --- | --- |
| Sete edifícios, coberturas, esquadrias e painéis solares | Geometria procedural em src/features/eco-sim/entities/Building.tsx | Não se aplica |
| Árvores, canteiros e vegetação ribeirinha | Geometria procedural instanciada | Não se aplica |
| Bancos, postes, placas e lixeiras | Geometria procedural instanciada | Não se aplica |
| Carro compacto, van compacta e três pedestres | Geometria e animação procedural | Não se aplica |
| Ruas, parque, córrego e pontes | Configuração e geometria do EcoLab | Não se aplica |
| Água e marcadores ambientais | Shader GLSL e geometria próprios | Não se aplica |

O código permanece sujeito à licença definida pelo proprietário do EcoLab. Este documento não concede licença aberta ao projeto. As licenças das bibliotecas são independentes das licenças de assets.

## Avaliação das fontes externas

Páginas oficiais consultadas novamente em **12/11/2026**, sem baixar modelos:

- [Kenney — City Kit (Suburban)](https://kenney.nl/assets/city-kit-suburban): 40 assets; a página informa **Creative Commons CC0**. O estilo modular é adequado para protótipos, mas a geometria existente permite manter dimensões, colisões e direção artística sem introduzir um pacote inteiro.
- [Quaternius — Ultimate Animated Character Pack](https://quaternius.com/packs/ultimatedanimatedcharacter.html): a página informa **CC0**, mais de 50 personagens e formatos **FBX, OBJ e Blend**. Não anuncia GLB diretamente. Conversão e adaptação de rig não são necessárias para os três personagens desta etapa.
- [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).

Decisão: refinar os elementos procedurais existentes. Nenhum modelo foi incorporado nem dependência instalada. Não foram usados espelhos ou downloads externos em runtime.

O histórico da etapa 1 registrava HTTP 403 ao tentar obter downloads da Kenney; a consulta às páginas informativas nesta etapa funcionou. Isso não comprova disponibilidade dos arquivos de download.

Qualquer futura incorporação deverá registrar URL exata, autor, licença, arquivo, tamanho, alterações e licença original, após aprovação do proprietário.

## Etapa 2.5 — base visual final

A etapa 2.5 mantém exclusivamente geometria própria: 15 edifícios, escola com quadra e playground, comércios, unidade de saúde, seis bicicletas estacionadas, três pontes e 20 civis com combinações únicas de roupa, pele, cabelo, altura, porte e acessórios. Personagens compartilham duas geometrias instanciadas. Não foram adicionados modelos, imagens ou dependências externos.

Os letreiros são texturas geradas em Canvas 2D com fontes locais do sistema (Segoe UI ou sans-serif disponível); nenhum arquivo de fonte é redistribuído ou baixado. Os links de fornecedores acima registram somente a avaliação histórica da etapa 2: não houve nova consulta nem incorporação desses pacotes na etapa 2.5.
