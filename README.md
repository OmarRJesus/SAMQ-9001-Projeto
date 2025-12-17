# 💎 SAMQ-9001 - Sistema de Gestão da Qualidade

Este projeto é um protótipo funcional de um Sistema de Gestão da Qualidade (SGQ) baseado na norma **ISO 9001:2015**, desenvolvido no âmbito da unidade curricular de Engenharia de Requisitos.

O sistema permite a gestão de Não Conformidades (NC), Planos de Ação Corretiva (PAC) e Documentação de Indicadores de Desempenho (KPIs).

---

## 🛠️ Tecnologias Utilizadas
- **Frontend:** React.js (Vite)
- **Backend:** Node.js (Express)
- **Base de Dados:** MySQL
- **Estilos:** CSS3 Puro (Custom Dashboard)

---

## 🚀 Guia de Instalação e Execução

Para correr o projeto localmente, siga os 3 passos abaixo (Base de Dados, Backend e Frontend).

### Passo 1: Configurar a Base de Dados 🗄️

1. Certifique-se que tem o **MySQL Server** e o **MySQL Workbench** instalados.
2. Abra o MySQL Workbench.
3. Crie uma nova Schema (base de dados) vazia chamada:
   `samq9001`
4. Vá ao menu **Server** > **Data Import**.
5. Selecione a opção **"Import from Self-Contained File"**.
6. Escolha o ficheiro `base_dados_samq9001.sql` que se encontra na **raiz** deste repositório.
7. Selecione a Schema `samq9001` como destino (Target Schema).
8. Clique em **Start Import**.

> **Nota:** O servidor backend está configurado para aceder com o utilizador `root` e sem palavra-passe (ou password padrão). Se o seu MySQL tiver uma password diferente, por favor altere o ficheiro `samq-9001-backend/server.js` na secção de conexão à DB.

---

### Passo 2: Iniciar o Backend (Servidor API) ⚙️

Abra um terminal na raiz do projeto e execute:

```bash
# Entrar na pasta do backend
cd samq-9001-backend
# Instalar dependências
npm install
# Iniciar o Servidor (corre na porta 3001)
node server.js

---
```

### Passo 3: Iniciar o Frontend (Aplicação Web) 💻

Abra um **segundo** terminal na raiz do projeto (mantenha o terminal do backend a correr) e execute:

```bash
# Entrar na pasta do dashboard
cd samq-9001-dashboard

# Instalar dependências
npm install

# Iniciar a aplicação React
npm run dev
