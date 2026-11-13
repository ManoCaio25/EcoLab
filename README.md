# EcoLab Live — Base visual da cidade

React, TypeScript, Three.js e React Three Fiber. A etapa 2.5 amplia a cidade existente para 72 × 56 unidades, com 15 edifícios, escola com playground e quadra, comércio, unidade de saúde, moradias, parque e passeio ribeirinho. Quatro veículos percorrem três circuitos; vinte civis distintos percorrem oito rotas. Seis bicicletas estacionadas completam a mobilidade visual.

## Executar e verificar

Requer Node.js 22.12+ e as dependências já presentes no projeto. Nenhuma dependência foi instalada nesta etapa.

```powershell
npm.cmd run dev
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd run preview
```

O preview serve `dist/` em http://127.0.0.1:4173 e não publica a aplicação.

## Apresentação

- **Visão geral:** câmera ortográfica com rotação, zoom e redefinição.
- **Conheça o distrito:** seis atalhos para escola, canal, vila, comércio, saúde e parque. Funcionam também ao sair da exploração.
- **Pontos ambientais:** seleção pela cena ou pelo painel; os IDs `corrego-01`, `area-verde-01` e `residencial-01` foram preservados.
- **Explorar cidade:** WASD para caminhar; clique e mouse para olhar; arraste como alternativa à captura do ponteiro; Esc para voltar.
- **Pausar animação:** congela todos os agentes, água e vegetação; a câmera continua operável.
- **Qualidade reduzida:** sem sombras, DPR limitado a 1, copas e água simplificadas.
- **Exibir FPS:** FPS, p95, draw calls, triângulos e geometrias.

Os civis têm combinações estáveis e únicas de roupa, calça/saia, pele, cabelo, altura, porte, penteado e acessórios. Há crianças próximas à escola e adultos distribuídos por comércio, saúde, margens, parque, moradias e centro. Toda a população compartilha duas geometrias e dois materiais, animados por matrizes fora do ciclo de renderização React.

## Organização preservada

- `src/app/`: interface e estado da apresentação.
- `src/features/eco-sim/config/`: dimensões, edifícios, superfícies, obstáculos, rotas, regiões, lugares e pontos ambientais.
- `scene/`: composição 3D, água, câmeras, marcadores e letreiros.
- `entities/`: edifícios, escola, mobiliário, vegetação, veículos e população instanciada.
- `navigation/`: colisões, caminhada e transições da câmera.
- `movement/`: matemática original de rotas e validação espacial.
- `performance/`: estatísticas de intervalos entre frames.

Y é o eixo vertical, com escala aproximada em metros. Rotas e sólidos usam dados compartilhados com a exploração. Os agentes originais conservam rotas e velocidades; novos agentes e percursos foram acrescentados. Os testes verificam suporte do corpo, obstáculos, conectividade dos lugares e preservação dos dados originais.

## Verificação no navegador

Com o preview ativo:

```powershell
node scripts/verify-browser.mjs --capture=after
```

`--quick` faz somente uma amostra curta de desempenho e serve para verificação funcional. A comparação final usa três amostras de dez segundos em cada perfil, após aquecimento, com viewport 1440 × 1000, DPR 1 e canvas 1440 × 867. O layout normal é restaurado para avaliar a interface, os atalhos e a exploração. A exploração também recebe três amostras de dez segundos no ponto inicial.

O script usa o Edge instalado no caminho padrão do Windows e o Chrome DevTools Protocol, sem biblioteca de automação adicional. O perfil isolado, temporários, capturas e relatórios ficam em `.local/etapa-2-5/`, ignorado pelo Git; o navegador de teste é fechado ao terminar. A referência `before-results.json` foi medida com o build da etapa 2 antes das alterações visuais. Não representa uma execução do código atual.

## Escopo e limites

A etapa 2.5 é visual. Não há EcoVoz, formulários, backend, autenticação, banco, persistência, IA ou simulações ambientais. Os lugares de apresentação são independentes dos pontos ambientais para preservar suas futuras chaves de integração.

A Escola das Águas e seu entorno usam modelos externos CC0 otimizados e materiais PBR, servidos pelo próprio projeto. As demais regiões e os personagens continuam procedurais. Letreiros usam fontes locais; a água usa shader próprio. Agentes seguem percursos fixos, sem tráfego autônomo ou colisão dinâmica entre pessoas, veículos e câmera. A exploração é externa, sem interiores ou motor de física. Caminhada por toque não foi implementada.

Resultados, métricas, arquivos e evidências estão em [ETAPA_2_5.md](docs/ETAPA_2_5.md). O histórico permanece em [ETAPA_2.md](docs/ETAPA_2.md). Origens e licenças estão em [ASSET_LICENSES.md](public/assets/ASSET_LICENSES.md).

## Prova visual da Escola das Águas

O piloto não expande a cidade nem altera rotas ou colisões. Use **Conheça o distrito → Escola das Águas** para visitar. O perfil reduzido usa a árvore de menor densidade e menos grama.

- Relatório e comparação: [PROVA_VISUAL_ESCOLA.md](docs/PROVA_VISUAL_ESCOLA.md).
- Preparação dos assets: `node scripts/prepare-school-assets.mjs --download --build` (requer rede; fontes restritas a Poly Haven).
- Verificação, com preview ativo: `node scripts/verify-browser.mjs --school --capture=after`.
- Evidências locais: `.local/school-pilot/comparison.html` e relatórios JSON. O arquivo `before-results.json` é a referência histórica anterior ao piloto; não o sobrescreva com o código atual.

`@gltf-transform/cli` é dependência de desenvolvimento usada para preparar os arquivos, sem participação no runtime. A auditoria registrou quatro avisos moderados na cadeia CLI → caporal → glob/minimatch; detalhes e limites constam no relatório.
