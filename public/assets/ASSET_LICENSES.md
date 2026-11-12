# Assets — EcoLab Live, etapa 2

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
