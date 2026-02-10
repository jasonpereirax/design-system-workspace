# 🚀 Guia Completo - Gauge Design System

Sistema SaaS completo para publicação de Design Systems do Figma com versionamento, workspace multi-tenant e integração CI/CD.

---

## 📋 Índice

1. [Visão Geral](#-visão-geral)
2. [Arquitetura do Sistema](#-arquitetura-do-sistema)
3. [Instalação](#-instalação)
4. [Iniciando o Backend](#-iniciando-o-backend)
5. [Iniciando o Workspace](#-iniciando-o-workspace)
6. [Instalando o Plugin Figma](#-instalando-o-plugin-figma)
7. [Fluxo Completo de Uso](#-fluxo-completo-de-uso)
8. [Troubleshooting](#-troubleshooting)

---

## 🎯 Visão Geral

O Gauge Design System é um SaaS multi-tenant que permite:

- ✅ **Workspace Multi-tenant**: Múltiplas organizações e projetos
- ✅ **Versionamento Real**: Histórico completo de versões
- ✅ **Viewer Público**: URL única para cada Design System
- ✅ **Controle de Acesso**: Público/privado com senha
- ✅ **Plugin Figma**: Publicação direta do Figma
- ✅ **Storage Local**: Persistência de payloads no servidor
- ✅ **Geração de Código**: HTML, React, Tailwind CSS

---

## 🏗️ Arquitetura do Sistema

```
gauge-design-system/
├── src/                              # Frontend Workspace (React)
│   ├── App.tsx                       # Dashboard multi-tenant
│   └── App.css                       # Estilos do workspace
│
├── server/                           # Backend (Fastify + SQLite)
│   ├── db.js                         # Configuração do banco
│   ├── index.js                      # API + Viewer público
│   ├── seed.js                       # Dados demo
│   ├── data/dev.db                   # Banco SQLite
│   └── storage/                      # Arquivos de payload
│       └── demo.json                 # Payload de exemplo
│
├── figma-design-system-publisher-complete/  # Plugin Figma
│   ├── manifest.json                 # Configuração do plugin
│   ├── code.js                       # Lógica do workflow
│   └── ui.html                       # Interface do plugin
│
└── package.json                      # Scripts e dependências
```

---

## 🔧 Instalação

### Pré-requisitos

- Node.js v18+
- npm v8+
- Conta no Figma Desktop App

### 1. Instalar Dependências

```bash
cd gauge-design-system
npm install
```

Isso instalará:
- `fastify` - Backend web server
- `better-sqlite3` - Banco de dados local
- `@fastify/cors` - CORS para plugin Figma
- `react` + `vite` - Frontend workspace

---

## 🚀 Iniciando o Backend

### 1. Rodar Seed + Backend

```bash
npm run dev:server
```

Isso irá:
1. **Criar banco de dados** em `server/data/dev.db`
2. **Popular dados demo**: usuário, org, projeto, versão
3. **Criar payload demo** em `server/storage/demo.json`
4. **Iniciar servidor** em `http://localhost:5174`

### 2. Verificar Backend

Abra: **http://localhost:5174/public/gauge-agency/gauge-ds**

Você deve ver o viewer público com 2 componentes demo:
- Button Primary
- Card

✅ **Backend funcionando!**

---

## 🖥️ Iniciando o Workspace

Em **outro terminal**, execute:

```bash
npm run dev
```

Isso iniciará o workspace frontend em: **http://localhost:5173**

### Navegando no Workspace

1. **Dashboard**: Visualize organizações e projetos
2. **Criar novo DS**: Digite nome e clique "Criar DS"
3. **Selecionar projeto**: Clique em um projeto para ver detalhes
4. **Deploy versão**: Digite versão (ex: v1.0.0) e clique "Criar versao"
5. **Configurar acesso**:
   - Alterar visibilidade (público/privado)
   - Definir senha simples
6. **Ver ID do projeto**: Copie o ID para usar no plugin

✅ **Workspace funcionando!**

---

## 🎨 Instalando o Plugin Figma

### 1. Abrir Figma Desktop App

Você **precisa** usar o Figma Desktop (não funciona no browser devido ao localhost).

### 2. Carregar Plugin

1. No Figma, vá em **Plugins → Development → Import plugin from manifest**
2. Selecione o arquivo:
   ```
   figma-design-system-publisher-complete/manifest.json
   ```
3. O plugin **Design System Publisher Pro** será instalado

### 3. Executar Plugin

1. Abra qualquer arquivo Figma com componentes
2. Vá em **Plugins → Development → Design System Publisher Pro**
3. A interface do plugin abrirá

✅ **Plugin instalado!**

---

## 🔄 Fluxo Completo de Uso

### Passo 1: Criar Projeto no Workspace

1. Acesse **http://localhost:5173**
2. Clique em **"Criar DS"**
3. Digite nome: `Meu Design System`
4. Clique em **Criar DS**
5. **Copie o Project ID** que aparece na lista

### Passo 2: Configurar Plugin Figma

1. Abra o plugin no Figma
2. **Passo 1 - Selecionar**: Escolha componentes do Figma
3. Clique **"Continuar →"**
4. **Passo 2 - Configurar**: Preencha os campos:

```
🔐 Credenciais GitHub (opcional para MVP)
GitHub Token: [deixe em branco]
Repository Owner: [deixe em branco]
Repository Name: [deixe em branco]

🎨 Opcionais
Vercel Token: [deixe em branco]
Claude API Key: [deixe em branco]

🧩 Gauge DS (SaaS Local)
Backend URL: http://localhost:5174
Email do Usuario: demo@gauge.local
Project ID: [COLE O ID DO PROJETO AQUI]
Versao: v1.0.0
```

5. Clique **"Revisar →"**

### Passo 3: Publicar no Gauge

1. **Passo 3 - Publicar**: Revise o resumo
2. Clique **"🚀 Iniciar Publicação"**
3. Acompanhe o workflow:
   - ✅ Extraindo designs do Figma
   - ✅ Processando com Figma MCP
   - ✅ Gerando código (HTML, React, Tailwind)
   - ✅ **Publicando no Gauge DS** ← Deploy real acontece aqui!
   - ⏭️ Criando estrutura de arquivos (simulado)
   - ⏭️ Git commit (simulado)
   - ⏭️ GitHub PR (simulado)
   - ⏭️ Vercel deploy (simulado)

### Passo 4: Ver Resultado no Workspace

1. Volte para **http://localhost:5173**
2. Selecione o projeto
3. Veja a nova versão **v1.0.0** na lista
4. Clique em **"Abrir"** para ver o viewer público

### Passo 5: Acessar Viewer Público

A URL pública será:
```
http://localhost:5174/public/demo-user/meu-design-system
```

Você verá todos os componentes publicados do Figma!

✅ **Fluxo completo funcionando!**

---

## 🔍 Estrutura de URLs

### Backend API

- `POST /auth/token` - Autenticação
- `GET /organizations` - Listar organizações
- `GET /projects?org_id=X` - Listar projetos
- `POST /projects` - Criar projeto
- `GET /projects/:id/versions` - Listar versões
- `POST /projects/:id/deploy` - Fazer deploy
- `PUT /projects/:id/password` - Definir senha
- `PATCH /projects/:id` - Atualizar projeto

### Viewer Público

- `GET /public/:org/:project` - Versão default
- `GET /public/:org/:project/v/:version` - Versão específica
- `GET /public/:org/:project?password=X` - Com senha (se privado)

---

## 🐛 Troubleshooting

### Backend não inicia

**Erro**: `Cannot find module 'fastify'`

**Solução**:
```bash
npm install
```

---

### Plugin não consegue conectar no backend

**Erro**: `Gauge auth falhou`

**Causas**:
1. Backend não está rodando
2. URL errada no plugin
3. Figma browser (use Desktop App)

**Solução**:
```bash
# Terminal 1: Iniciar backend
npm run dev:server

# Verificar que está rodando
curl http://localhost:5174/public/gauge-agency/gauge-ds
```

---

### Viewer mostra "sem versao"

**Causa**: Projeto não tem versão default

**Solução**:
1. No workspace, crie uma versão
2. Clique em "Definir default"
3. Recarregue o viewer

---

### Payload de componentes vazio

**Causa**: Deploy do plugin falhou

**Solução**:
1. Verifique console do plugin
2. Confirme que Project ID está correto
3. Confirme que email é `demo@gauge.local`
4. Tente novamente

---

### Componentes não aparecem no plugin

**Causa**: Arquivo Figma sem componentes

**Solução**:
1. Crie ao menos 1 componente no Figma
2. Ou use um Component Set
3. Recarregue o plugin

---

## 📝 Notas Importantes

### Limitações Atuais (MVP)

- ✅ **Funcionam**: Gauge DS deploy, versionamento, viewer público
- ⏸️ **Simulados**: Git commit, GitHub PR, Vercel deploy

### O que é Real vs Simulado

**✅ REAL (funcionando)**:
- Backend completo com banco de dados
- Workspace multi-tenant
- Autenticação e organizações
- Criação de projetos
- Versionamento de DS
- Deploy de componentes do Figma
- Viewer público com senha
- Storage de payloads
- Geração de código em 3 formatos

**⏸️ SIMULADO (placeholder)**:
- Git commit (não cria commit real)
- GitHub PR (não cria PR real)
- Vercel deploy (não faz deploy real)

### Próximos Passos

Para implementação completa:

1. **Integração Git real**:
   - Usar `simple-git` ou `isomorphic-git`
   - Fazer commits reais no repositório

2. **GitHub API real**:
   - Usar `@octokit/rest`
   - Criar PRs reais via API

3. **Vercel API real**:
   - Usar Vercel API Client
   - Fazer deploys reais

4. **Deploy automático**:
   - Webhook do GitHub → Vercel
   - CI/CD completo

---

## 🎉 Parabéns!

Você tem um sistema SaaS funcional para Design Systems! 🚀

O fluxo core está **100% funcional**:
- ✅ Workspace funcionando
- ✅ Backend com banco de dados
- ✅ Plugin publicando componentes
- ✅ Viewer público renderizando

**Próximo passo**: Expandir integrações (Git, GitHub, Vercel) conforme necessário.

---

## 📞 Suporte

Dúvidas? Verifique:
- Console do navegador (workspace)
- Console do Figma plugin
- Logs do terminal (backend)
- Arquivo `server/data/dev.db` (banco)
- Arquivo `server/storage/*.json` (payloads)
