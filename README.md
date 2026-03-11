# Finance App (App de Finanças)

Uma aplicação completa de gerenciamento financeiro pessoal construída com as tecnologias mais modernas.

## 🚀 Funcionalidades

- **Dashboard**: Acompanhe seu saldo, receitas e despesas em tempo real.
- **Gerenciamento de Transações**: Adicione, atualize e exclua transações financeiras com facilidade.
- **Metas Financeiras (Cofrinho)**: Defina objetivos e deposite dinheiro manualmente.
- **Insights Visuais**: Gráficos interativos usando Recharts para análise por categoria.
- **Autenticação Segura**: Suporte integrado com Firebase Auth.

## 🛠️ Tecnologias Utilizadas

- **Front-end**: Next.js 14, React, Vanilla CSS.
- **Back-end**: Firebase Cloud Functions (Node.js), Banco de Dados Firestore.
- **Visualização**: Recharts.
- **Arquitetura**: Sistema de Automação de 3 Camadas (Diretrizes, Orquestração, Execução).

## 📂 Estrutura do Projeto

- `frontend/`: Aplicação web Next.js.
- `backend/`: Cloud Functions do Firebase e regras do Firestore.
- `directives/`: Procedimentos Operacionais Padrão (SOPs) para o agente de IA.
- `execution/`: Scripts de execução determinística.

## 🚦 Começando

### Pré-requisitos

- Node.js (v18+)
- Firebase CLI (`npm install -g firebase-tools`)

### Configuração

1. **Clone o repositório**
   ```bash
   git clone https://github.com/ViniciusFerreira2001/finance-app.git
   ```

2. **Configuração do Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Configuração do Backend**
   ```bash
   cd backend/functions
   npm install
   ```

## 📜 Licença

Projeto privado para gerenciamento de finanças pessoais.
