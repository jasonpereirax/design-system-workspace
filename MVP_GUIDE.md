# Gauge DS MVP - Guia Tecnico

Este guia descreve o que mudou, como rodar o MVP localmente e como publicar um Design System a partir do plugin do Figma.

**Resumo do que foi construido**
- Workspace multi-tenant com Organizacoes e Projetos (DS)
- Backend local com SQLite e APIs de deploy/versoes/acesso
- Viewer publico com render real (HTML/CSS/SVG)
- Acesso privado com senha simples por projeto
- Plugin integrado para publicar direto no backend local

---
## 1. Arquitetura local

**Backend**
- Fastify + SQLite
- Porta: `http://localhost:5174`

**Frontend**
- Vite + React
- Porta: `http://localhost:5173`

---
## 2. Como rodar

1. Instalar dependencias
```bash
npm install
```

2. Iniciar backend
```bash
npm run dev:server
```

3. Iniciar frontend
```bash
npm run dev
```

---
## 3. Fluxo MVP (Workspace)

1. Abra o workspace em `http://localhost:5173`
2. Crie um Design System
3. Copie o **Project ID** exibido na lista
4. Clique em “Criar versao”
5. Abra o link publico para validar o viewer
6. Se necessario, defina senha e altere visibilidade para privado

---
## 4. Viewer publico

**Rotas**
- Projeto: `http://localhost:5174/public/{orgSlug}/{projectSlug}`
- Versao: `http://localhost:5174/public/{orgSlug}/{projectSlug}/v/{version}`

**Render**
O viewer usa os dados do deploy para renderizar:
- `svgData` (quando existe)
- `html` + `css`
- fallback para nome do componente

---
## 5. Plugin do Figma -> Deploy

No plugin, configure:
- `Backend URL`: `http://localhost:5174`
- `Email do Usuario`: mesmo do workspace (ex: `demo@gauge.local`)
- `Project ID`: copiado do workspace
- `Versao`: opcional

Durante o workflow, a etapa “Publicando no Gauge DS” envia:
- `html`, `css`, `react`, `tailwind`
- `svgData`, `figmaUrl`, `bounds`

---
## 6. APIs principais

- `POST /auth/token`
- `GET /organizations`
- `GET /projects?org_id=...`
- `POST /projects`
- `GET /projects/:id/versions`
- `POST /projects/:id/deploy`
- `PATCH /projects/:id`
- `PUT /projects/:id/password`
- `GET /public/:org/:project`
- `GET /public/:org/:project/v/:version`

---
## 7. Onde estao as mudancas

**Backend**
- `server/index.js`
- `server/db.js`
- `server/seed.js`

**Frontend**
- `src/App.tsx`
- `src/App.css`

**Plugin**
- `figma-design-system-publisher-complete/code.js`
- `figma-design-system-publisher-complete/ui.html`

---
## 8. Checklist para demo

1. Backend ativo em `5174`
2. Frontend ativo em `5173`
3. Criar DS no workspace
4. Publicar via plugin com Project ID
5. Abrir viewer publico e validar render real
6. Mostrar senha simples e visibilidade

