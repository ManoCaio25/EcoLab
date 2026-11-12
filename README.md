# EcoLab Live — Cidade explorável

Aplicação educacional em React, TypeScript, Three.js e React Three Fiber. A etapa 2 amplia a cidade da prova técnica com uma vila residencial, parque, passeio junto ao córrego, exploração ao nível da rua e três pontos ambientais.

## Executar

Requer Node.js 22.12+; verificado com Node 24.4.0. As dependências existentes foram reutilizadas, sem instalações nesta etapa.

```powershell
npm.cmd run dev
```

Use o endereço local informado pelo Vite. Para validar:

```powershell
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd run preview
```

O preview serve o build local em http://127.0.0.1:4173. Não publica a aplicação.

## Controles

| Controle | Ação |
| --- | --- |
| Visão geral | Câmera ortográfica; arrastar gira, rolagem ou +/− ajustam zoom |
| Redefinir câmera | Restaura enquadramento, alvo e zoom; limpa a seleção |
| Explorar cidade | Perspectiva a 1,65 m acima do piso |
| W, A, S, D | Caminhar com aceleração e desaceleração suaves |
| Clicar na cena e mover o mouse | Olhar em volta; arrastar funciona como alternativa quando a captura do mouse não está disponível |
| Esc / Voltar à visão geral | Sair da exploração e liberar o mouse |
| Marcador 3D ou item do painel | Selecionar ponto ambiental |
| Aproximar deste ponto | Enquadrar a região selecionada na visão geral |
| Pausar animação | Congelar agentes, rodas, caminhada, água e vegetação; a câmera continua utilizável |
| Qualidade reduzida | Desligar sombras, limitar DPR a 1 e reduzir água e copas |
| Exibir FPS | FPS, p95, draw calls, triângulos e contagem de geometrias |

A exploração usa teclado e mouse. A interface e a visão geral adaptam-se a telas pequenas; não foi implementado controle de caminhada por joystick de toque.

## Organização

- `src/app/`: interface e estado da câmera/seleção.
- `src/features/eco-sim/config/`: cidade, regiões, superfícies, obstáculos, pontos, qualidade e rotas.
- `navigation/`: funções puras de colisão, movimento e transições de estado.
- `scene/`: composição, câmeras, ambiente, água e marcadores.
- `entities/`: edifícios, vegetação, mobiliário e agentes.
- `movement/`: sistema original de rotas, preservado.
- `performance/`: estatística de intervalos de frame.
- `components/`: controles, painel e leitura de desempenho.
- `scripts/verify-browser.mjs`: verificação no Edge por Chrome DevTools Protocol, sem instalar biblioteca de automação.
- `docs/ETAPA_2.md`: entrega, arquivos, testes, comparação de desempenho e limites.
- `.local/etapa-2/`: evidências locais, ignoradas pelo Git.

Todos os dados espaciais usam Y para cima e escala aproximada em metros. A área passou de 48 × 36 para 60 × 44 unidades. Os dois veículos e três pedestres conservam waypoints, velocidades e sistema matemático.

## Navegação e dados ambientais

A câmera percorre uma união de ruas, calçadas, praças e caminhos. Um corpo circular de raio 0,27 m verifica apoio em 16 pontos e colisão com caixas dos sólidos. Deslocamentos são subdivididos em passos de até 8 cm; isso impede atravessar uma barreira verificando apenas o destino. O movimento desliza nas bordas e respeita o córrego e os guarda-corpos. Não há gravidade, salto ou motor de física.

IDs estáveis dos pontos: `corrego-01`, `area-verde-01`, `residencial-01`. Nome, descrição, região, categoria, posição 3D e alvo de enquadramento ficam na configuração tipada. Marcadores e painel recebem os registros por propriedades; não buscam dados nem conhecem um backend.

## Verificação no navegador

Com o preview ativo:

```powershell
node scripts/verify-browser.mjs
```

O script usa Edge instalado no caminho padrão do Windows, porta de depuração 9224 e perfil isolado em `.local/etapa-2/browser`. Fecha o navegador de teste ao terminar. `--quick` executa uma verificação funcional curta; `--baseline` identifica uma medição da versão servida como referência, portanto só deve ser usado com o build da etapa 1. O relatório original da referência já está preservado.

A medição completa usa três amostras de 10 segundos por perfil, após aquecimento, com viewport 1440 × 1000 e DPR 1. Para comparar os builds, o script iguala temporariamente a área do canvas à da etapa 1. Depois restaura o layout normal para verificar a interface. FPS e p95 medem intervalos de requestAnimationFrame, não tempo de GPU via queries.

## Limites e escopo

Os modelos mantêm estética procedural de jogo de gerenciamento; não são fotogrametria nem personagens com rig esquelético. A água aproxima brilho e reflexão do céu, sem reflexão real da cena. Obstáculos da exploração são estáticos; veículos e pedestres não possuem colisão dinâmica com a câmera nem entre si.

Não há backend, persistência, formulários de denúncia, autenticação, endpoints fictícios ou simulações ambientais. Cloudflare Workers/D1, EcoVoz e EcoSim permanecem para uma etapa futura mediante avaliação e autorização.

Consulte [a entrega da etapa 2](docs/ETAPA_2.md) e [as origens e licenças](public/assets/ASSET_LICENSES.md).
