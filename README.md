# EcoLab · Prova técnica — EcoSim 3D

Uma cidade 3D interativa construída com React, TypeScript e Three.js. Esta entrega cobre somente a prova técnica visual do EcoSim: não inclui EcoVoz, backend, autenticação, banco de dados ou simulações ambientais.

O projeto está diretamente em `C:\Users\Caio\Desktop\EcoLab`, conforme aprovado. Nenhuma publicação foi realizada.

## Executar localmente

Requisito: Node.js **22.12+**; a implementação foi verificada com **Node 24.4.0** e npm 11.4.2.

```powershell
cd C:\Users\Caio\Desktop\EcoLab
npm.cmd run dev
```

Abra o endereço informado pelo Vite, normalmente `http://127.0.0.1:5173`. As dependências já estão instaladas neste workspace. Para uma instalação limpa a partir do lockfile:

```powershell
npm.cmd ci --cache .npm-cache --no-audit --no-fund
```

Usa-se `npm.cmd` porque a política de execução do PowerShell deste ambiente bloqueia `npm.ps1`. Não é necessário alterar essa política. Em outros shells, `npm` também funciona.

```powershell
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd run preview
```

O último comando serve `dist/` localmente, normalmente na porta 4173. Não publica a aplicação.

## Conteúdo da cena

- Diorama 3D com duas margens, canal aberto e duas pontes que sustentam a rua e as calçadas.
- Avenida em circuito com duas faixas e curvas suaves, marcações e travessias pintadas.
- Quatro edifícios com janelas, portas, marquises, detalhes de cobertura e painéis solares.
- Árvores, canteiros, bancos e postes.
- Um carro e uma van em sentidos opostos, com rodas girando.
- Três pedestres com animação dos braços e pernas; um deles para por três segundos a cada volta.
- Água com animação leve em shader, iluminação hemisférica/direcional e sombras.
- Câmera ortográfica, rotação limitada, zoom limitado e reset.
- Interface escura em português, controles MUI, pausa global, qualidade reduzida, FPS opcional e estado real de preparação da cena.

Os modelos são procedurais. O indicador de carregamento informa a preparação da geometria local; não simula downloads inexistentes.

## Organização

```text
EcoLab/
├── public/assets/
│   ├── ASSET_LICENSES.md
│   ├── models/                         # reservado; sem arquivos nesta versão
│   └── textures/                       # reservado; sem arquivos nesta versão
├── src/
│   ├── main.tsx
│   ├── app/                            # interface, tema e CSS
│   ├── components/                     # tratamento de falha da cena
│   └── features/eco-sim/
│       ├── components/                 # controles, estado de carga e FPS
│       ├── config/                     # cidade, rotas e perfis gráficos
│       ├── scene/                      # câmera, ambiente e água
│       ├── entities/                   # edifícios, vegetação, carros e pedestres
│       ├── movement/                   # funções de rota, validação, hook e testes
│       └── types.ts
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

`services`, `utils`, um estado global e outras abstrações genéricas não foram criados porque ainda não há uso concreto. O estado dos controles vive em React; objetos móveis atualizam suas referências no loop do Fiber. Zustand não foi adicionado como dependência direta.

`node_modules/`, `.npm-cache/`, `.local/` e `dist/` são locais e ignorados pelo Git. A pasta `.local/` contém os artefatos da verificação visual e o perfil isolado do navegador de teste. A configuração existente `.codex/` não foi modificada.

## Rotas e superfícies

`config/city.ts` define coordenadas, alturas, pontes e volumes dos edifícios. Essas informações são compartilhadas pela renderização e pela validação. O eixo Y aponta para cima; as coordenadas têm escala aproximada de metros.

`config/routes.ts` define waypoints independentes para veículos e pedestres. `buildRoute` converte os cantos em arcos circulares tangentes. O comprimento de cada arco é conhecido, portanto a velocidade é constante por distância percorrida, sem depender da parametrização de uma spline.

`sampleRoute` fornece posição, altura e orientação. `advanceMotion` consome o delta time, incluindo o tempo de espera e o restante do frame após uma parada. As funções são puras por padrão; o hook fornece objetos de saída reutilizados para evitar alocação a cada frame. O movimento não provoca renders React contínuos.

`validateRoute` verifica os waypoints e amostra a trajetória a cada **8 cm**, considerando centro, bordas e cantos do espaço ocupado pelo corpo. Rejeita alturas incorretas, água sem ponte, edifícios e superfícies incompatíveis. A cena recusa iniciar caso uma rota configurada falhe.

Essa validação é geométrica e amostrada; não é um motor físico nem uma prova matemática contínua. Não há desvio de obstáculos dinâmicos, semáforos ou prevenção de colisões entre agentes. Os carros usam faixas separadas. Pedestres podem se sobrepor ao se encontrar; não representam uma simulação completa de trânsito ou multidão.

## Controles e qualidade

| Controle | Ação |
| --- | --- |
| Arrastar na cena | Girar dentro dos limites de azimute e inclinação |
| Rolagem, gesto de pinça ou botões +/− | Aproximar/afastar dentro dos limites |
| Redefinir câmera | Restaurar posição, alvo e zoom iniciais, cancelando a inércia |
| Pausar/continuar | Congelar/retomar deslocamento, caminhada, rodas, espera e água |
| Qualidade reduzida | Desativar sombras, limitar DPR a 1 e reduzir a subdivisão da água |
| Exibir FPS | Mostrar FPS, draw calls e triângulos, atualizados a cada 0,75 s |

O perfil alto limita DPR a 1,5 e sombras a 1024². Edifícios, mobiliário e vegetação usam instanciamento; os componentes estáticos evitam renders desnecessários. O Fiber gerencia o descarte das geometrias e materiais ao desmontar a cena. Falhas de WebGL e perda de contexto têm mensagens de recuperação.

## Dependências e compatibilidade

Versões fixadas no `package.json` e no lockfile:

- React/React DOM 19.3.1; React Three Fiber 9.8.2; Drei 10.7.9.
- Three.js e tipagens 0.187.0.
- Material UI 9.5.0 com Emotion 11.14.x.
- TypeScript 7.0.2; Vite 8.3.8; plugin React 6.3.0; Vitest 5.1.0.

O Fiber 9 é a linha compatível com React 19; Fiber 10 alpha não foi utilizado. Emotion é o mecanismo padrão de estilos do MUI. Vitest é apenas uma ferramenta de desenvolvimento para validar as funções matemáticas. Não foram instalados motores de física, navegação, conversores de modelos ou bibliotecas de ícones.

Referências oficiais consultadas:

- [React — versões](https://react.dev/versions)
- [Fiber — introdução e compatibilidade](https://r3f.docs.pmnd.rs/getting-started/introduction)
- [Drei — introdução](https://drei.docs.pmnd.rs/getting-started/introduction)
- [Material UI — instalação](https://mui.com/material-ui/getting-started/installation/)
- [Vite — requisitos e instalação](https://vite.dev/guide/)
- [TypeScript — documentação](https://www.typescriptlang.org/docs/)
- Metadados oficiais dos pacotes no registro npm para versões estáveis, engines e peer dependencies.

## Validação executada em 12/11/2026

- `npm.cmd run build`: aprovado; inclui TypeScript estrito sem emissão, seguido do build de produção.
- `npm.cmd test`: **18 testes aprovados em 2 arquivos**.
- Testes de comprimento de arcos, continuidade de posição/orientação, fechamento do circuito, altura, reuso de saída e rejeição de entradas degeneradas.
- Comparação do mesmo movimento a 30, 60 e 144 FPS, incluindo paradas, além de equivalência entre frames longos e pequenos.
- Validação de todas as rotas com o espaço ocupado pelos agentes e travessias de ambas as pontes; rejeição de curvas que saem da rua mesmo com waypoints válidos.
- Build de produção aberto no Edge headless via Chrome DevTools Protocol, sem instalar dependências de automação.
- Inspeção visual em 1440×1000 e 390×844; a versão móvel usa rolagem vertical e não apresentou transbordamento horizontal.
- Pausa verificada por igualdade dos pixels da cena em capturas separadas; retomada verificada por mudança desses pixels.
- Verificados zoom, limites, rotação, reset, seletor de qualidade, indicador de FPS, estado de carregamento, console e requisições da página.

Os resultados detalhados da sessão estão em `.local/browser-results.json`; capturas em `.local/desktop.png` e `.local/mobile.png`. Esses artefatos são locais, não fazem parte do build e não substituem os testes versionados.

## Desempenho observado e limites

Ambiente da medição: Edge headless, Windows, ANGLE/Direct3D11, **NVIDIA GeForce GTX 1650**, viewport 1440×1000, DPR 1. Amostras curtas de quatro segundos, após o carregamento:

| Perfil | FPS médio aproximado | Draw calls | Triângulos por frame, incluindo sombras |
| --- | --- | --- | --- |
| Alto | 144 | 149 | 38,2 mil |
| Reduzido | 144 | 89 | 18,6 mil |

O intervalo de frame no percentil 95 foi aproximadamente 7,1 ms nessa amostra. Não houve gargalo de renderização observado nesse teste curto. Isso não garante 60 FPS em outros notebooks nem 30 FPS em GPUs integradas; ainda faltam avaliações em hardware modesto, telas com DPR maior e sessões prolongadas. O indicador conta frames renderizados mesmo com a animação pausada, para manter a câmera interativa.

O JavaScript de produção tem aproximadamente **484 kB para a interface** e **955 kB para a cena**, ou cerca de **153 + 255 kB gzip**. A cena é carregada separadamente via `React.lazy`; a rede e a compilação inicial de shaders ainda podem afetar o primeiro carregamento. Não foram usados HDRIs, texturas grandes ou downloads externos em runtime.

## Assets, limitações visuais e próxima avaliação

Consulte [fontes e licenças dos assets](public/assets/ASSET_LICENSES.md). Os downloads da Kenney retornaram HTTP 403. Os personagens da Quaternius consultados não ofereciam GLB pronto na página. Foram usadas geometrias próprias, sem incorporar arquivos de terceiros.

A direção visual é uma maquete urbana com materiais PBR e iluminação de jogo, ainda estilizada. Edifícios, carros e sobretudo personagens precisam de refinamento artístico para atingir uma aparência semi-realista final. A caminhada procedural é visível, mas não possui rig esquelético, passos adaptativos ou contato físico com o chão. A água é um efeito visual simples, sem reflexão/refração física.

Antes da próxima etapa, avaliar a cidade em navegação real, confirmar a direção de arte, substituir os modelos prioritários por GLB otimizados com licença registrada e medir desempenho em hardware modesto. O teste móvel usou emulação de viewport, não um dispositivo físico.

`EnvironmentAppearance` e `DEFAULT_APPEARANCE` permitem alterar a água e a vegetação sem reescrever a cena. Novos resíduos, fumaça ou comportamentos poderão ser implementados como entidades/configurações específicas quando houver requisitos; não existem endpoints fictícios nem simulações antecipadas.

**Esta entrega encerra a etapa 1. EcoVoz, backend e simulações ambientais dependem de nova avaliação e autorização.**
