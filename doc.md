# Sistema de Ranking de Conta Corrente

## 📋 Visão Geral

Sistema web corporativo desenvolvido para visualização e análise de dados de conta corrente de representantes comerciais autônomos (RCA's). O sistema apresenta um dashboard interativo com ranking em tempo real, gráficos de alterações de saldo e funcionalidades de exportação.

## 🎯 Objetivo

Fornecer uma interface moderna e intuitiva para acompanhamento do desempenho financeiro dos RCA's, permitindo:
- Visualização de ranking por saldo atual
- Análise de tendências através de gráficos
- Filtros e ordenação personalizáveis
- Exportação de relatórios em PDF

## 🏗️ Arquitetura

### Frontend
- *Tecnologia*: HTML5, CSS3, JavaScript ES6+ (Módulos)
- *Servidor*: Express.js
- *Bibliotecas*: Chart.js, Lucide Icons
- *Estilo*: CSS responsivo com design corporativo

### Backend
- *API Externa*: Sistema de conta corrente (http://192.168.1.102:3006)
- *Endpoints utilizados*:
  - GET /contacorrente - Lista todos os RCA's
  - GET /contacorrente/alteracoes?rca={id} - Alterações diárias
  - GET /contacorrente/alteracoes-mes?rca={id} - Alterações mensais

## 📁 Estrutura do Projeto


front_contacorrente/
├── assets/
│   └── logo.png                 # Logo da empresa
├── index.html                   # Página principal
├── script.js                    # Lógica JavaScript principal
├── style.css                    # Estilos CSS
├── server.js                    # Servidor Express
├── package.json                 # Dependências do projeto
├── dockerfile                   # Configuração Docker
├── docker-compose.yml           # Orquestração Docker
└── README.md                    # Documentação


## 🚀 Funcionalidades

### 1. Dashboard Principal
- *Header Corporativo*: Logo da empresa, título do sistema e estatísticas
- *Controles de Filtro*: 
  - Filtro por faixa de RCA (001-005, 001-010, 001-020, Todos)
  - Ordenação por saldo, nome ou RCA
- *Atualização Automática*: Dados atualizados a cada 5 minutos

### 2. Tabela de Ranking
- *Colunas*:
  - Posição (com indicadores visuais para top 5)
  - Código RCA
  - Nome completo do representante
  - Saldo atual (formatado em BRL)
  - Status de alteração (Subiu/Desceu/Estável)
- *Destaques Visuais*:
  - Top 5 posições com cores diferenciadas
  - Saldos positivos em verde, negativos em vermelho
  - Status com ícones e cores específicas

### 3. Gráficos Interativos
- *Gráfico Diário*: Alterações de saldo ao longo do dia
- *Gráfico Mensal*: Tendências mensais de alterações
- *Seleção de RCA*: Dropdown para escolher representante específico
- *Tooltips*: Valores formatados em tempo real

### 4. Funcionalidades de Exportação
- *Exportar PDF*: Botão para impressão/exportação
- *Estilos de Impressão*: Otimizado para documentos corporativos

## 🛠️ Tecnologias Utilizadas

### Frontend
- *HTML5*: Estrutura semântica
- *CSS3*: 
  - Flexbox e Grid para layout
  - Media queries para responsividade
  - Variáveis CSS para temas
  - Animações e transições
- *JavaScript ES6+*:
  - Módulos ES6
  - Async/Await para requisições
  - Chart.js para gráficos
  - Lucide para ícones

### Backend
- *Node.js*: Runtime JavaScript
- *Express.js*: Framework web
- *dotenv*: Gerenciamento de variáveis de ambiente

### Bibliotecas Externas
- *Chart.js*: Gráficos interativos
- *Lucide*: Ícones SVG
- *Google Fonts*: Tipografia (Inter)

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Docker (opcional)

### Instalação Local

1. *Clone o repositório*
bash
git clone <url-do-repositorio>
cd front_contacorrente


2. *Instale as dependências*
bash
npm install


3. *Configure as variáveis de ambiente*
bash
# Crie um arquivo .env na raiz do projeto
PORT=3007


4. *Execute o servidor*
bash
npm run dev


5. *Acesse a aplicação*

http://localhost:3007/contacorrente


### Execução com Docker

1. *Build da imagem*
bash
docker build -t front-contacorrente .


2. *Execução do container*
bash
docker run -p 3007:3007 front-contacorrente


## 🔧 Configuração

### Variáveis de Ambiente
- PORT: Porta do servidor (padrão: 3007)

### URLs da API
- *Base URL*: http://192.168.1.102:3006
- *Endpoints*:
  - /contacorrente - Lista de RCA's
  - /contacorrente/alteracoes - Alterações diárias
  - /contacorrente/alteracoes-mes - Alterações mensais

### Personalização
- *Logo*: Substitua assets/logo.png
- *Cores*: Modifique as variáveis CSS em style.css
- *Intervalo de atualização*: Altere o valor em script.js (linha 73)

## 📱 Responsividade

O sistema é totalmente responsivo com breakpoints:
- *Desktop*: > 1024px
- *Tablet*: 768px - 1024px
- *Mobile*: < 768px
- *Mobile pequeno*: < 480px

## 🎨 Design System

### Cores Principais
- *Verde Corporativo*: #079b13 (header)
- *Azul Primário*: #3b82f6 (botões)
- *Verde Positivo*: #059669 (saldos positivos)
- *Vermelho Negativo*: #dc2626 (saldos negativos)
- *Dourado Top 5*: #f8bf02 (posições destacadas)

### Tipografia
- *Fonte Principal*: Inter (Google Fonts)
- *Fonte Monospace*: Courier New (códigos RCA)

## 🔄 Fluxo de Dados

1. *Carregamento Inicial*: Sistema busca dados da API
2. *Renderização*: Tabela e gráficos são populados
3. *Interação*: Usuário aplica filtros e ordenações
4. *Atualização*: Dados são recarregados automaticamente
5. *Exportação*: Sistema gera PDF otimizado

## 🐛 Troubleshooting

### Problemas Comuns

1. *Erro de conexão com API*
   - Verifique se a API está rodando em 192.168.1.102:3006
   - Confirme conectividade de rede

2. *Gráficos não carregam*
   - Verifique se Chart.js está carregando corretamente
   - Confirme se há dados válidos para o RCA selecionado

3. *Problemas de responsividade*
   - Teste em diferentes resoluções
   - Verifique media queries no CSS

## 📈 Melhorias Futuras

### Funcionalidades Planejadas
- [ ] Filtros por período de tempo
- [ ] Comparação entre RCA's
- [ ] Alertas de saldo baixo
- [ ] Histórico de alterações detalhado
- [ ] Dashboard administrativo
- [ ] Notificações push
- [ ] Modo escuro

### Otimizações Técnicas
- [ ] Cache de dados
- [ ] Lazy loading de gráficos
- [ ] Compressão de assets
- [ ] Service Worker para offline
- [ ] Testes automatizados

## 👥 Contribuição

### Padrões de Código
- *JavaScript*: ES6+ com módulos
- *CSS*: BEM methodology
- *Commits*: Conventional Commits
- *Branches*: Git Flow

### Processo de Contribuição
1. Fork do repositório
2. Criação de branch para feature
3. Desenvolvimento com testes
4. Pull request com descrição detalhada

## 📄 Licença

Este projeto é propriedade da *COMAL - Comércio Atacadista de Alimentos LTDA*.

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o sistema, entre em contato com a equipe de desenvolvimento.

---

*Desenvolvido com ❤️ para COMAL Comércio Atacadista de Alimentos LTDA*
