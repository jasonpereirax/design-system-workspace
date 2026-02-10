# 🚀 Design System Publisher Pro

Plugin Figma completo com integração automatizada para GitHub e Vercel.

## 📋 Funcionalidades

✅ **Seleção inteligente de componentes**
- Agrupamento automático por páginas do Figma
- Busca e filtros
- Seleção individual ou em massa
- Suporte completo para variantes

✅ **Workflow automatizado**
- Extração de designs do Figma
- Processamento via Figma MCP
- Geração de código em 3 formatos (HTML/CSS, React, Tailwind)
- Commit e Push automático no GitHub
- Criação de Pull Request
- Configuração de deploy na Vercel

✅ **Controle total**
- Pausar/retomar workflow a qualquer momento
- Visualização de progresso em tempo real
- Mensagens detalhadas de cada etapa
- Cancelamento seguro

✅ **Armazenamento de credenciais**
- Credenciais salvas no localStorage
- Preenchimento automático em sessões futuras
- Seguro e privado (armazenado localmente)

---

## 🔧 Instalação

### 1. Importar no Figma

1. Abra o Figma Desktop
2. Menu: `Plugins` → `Development` → `Import plugin from manifest`
3. Selecione o arquivo `manifest.json` desta pasta
4. O plugin aparecerá em `Plugins` → `Design System Publisher Pro`

### 2. Compilar TypeScript (se necessário)

Se você modificou o `code.ts`:

```bash
npm install -g typescript
tsc code.ts
```

---

## 📖 Como Usar

### Passo 1: Selecionar Componentes

1. Abra o plugin no Figma
2. Visualize todos os componentes organizados por página
3. Use a busca para filtrar
4. Clique nos componentes para selecionar
5. Para Component Sets, clique para expandir variantes
6. Use "Selecionar todos" para selecionar grupo inteiro

### Passo 2: Configurar Credenciais

**GitHub Token:**
1. Acesse: https://github.com/settings/tokens/new
2. Marque: `repo`, `workflow`
3. Gere o token e cole no plugin

**Vercel Token (Opcional):**
1. Acesse: https://vercel.com/account/tokens
2. Crie um token
3. Cole no plugin

**Claude API Key (Opcional):**
- Deixe em branco para usar Figma MCP via Chrome
- Ou adicione sua chave da Anthropic API

### Passo 3: Publicar

1. Revise o resumo
2. Clique em "Iniciar Publicação"
3. Acompanhe o progresso no painel
4. Pause/retome conforme necessário
5. Ao concluir, clique nos links para ver o PR e o deploy

---

## 🏗️ Estrutura do Código Gerado

```
seu-repositorio/
├── src/
│   └── components/
│       ├── ButtonPrimary/
│       │   ├── ButtonPrimary.html          # HTML + CSS
│       │   ├── ButtonPrimary.tsx           # React Component
│       │   ├── ButtonPrimary.tailwind.tsx  # Tailwind Component
│       │   └── ButtonPrimary.module.css    # CSS Module
│       ├── CardDefault/
│       └── InputText/
├── package.json
├── vercel.json
└── README.md
```

---

## 🔄 Workflow Detalhado

### Etapa 1: Extração de Designs
- Exporta componentes como PNG (preview)
- Exporta como SVG (código)
- Captura dimensões e propriedades

### Etapa 2: Processamento Figma MCP
- Conecta ao Figma MCP via Chrome
- Extrai estilos, tokens e metadados
- Prepara dados estruturados

### Etapa 3: Geração de Código
- **HTML/CSS**: Vanilla, semântico, acessível
- **React**: TypeScript, props tipadas, modular
- **Tailwind**: Classes utilitárias, responsivo

### Etapa 4: Criação de Arquivos
- Estrutura de pastas organizada
- Um diretório por componente
- Arquivos separados por formato

### Etapa 5: Git Commit
- Cria branch: `feature/figma-components-TIMESTAMP`
- Commit message: `feat: Add X components from Figma`
- Push automático

### Etapa 6: Pull Request
- Título descritivo
- Body com detalhes dos componentes
- Base branch: `main`

### Etapa 7: Deploy Vercel
- Configuração automática (se token fornecido)
- Ou link para configuração manual
- Preview deploy automático no PR

---

## 🛠️ Requisitos

- Figma Desktop (não funciona no browser)
- Node.js 16+ (para compilar TypeScript)
- Git instalado
- Conta GitHub com repositório criado
- Conta Vercel (opcional, para deploy automático)

---

## 🔐 Segurança

- Tokens armazenados apenas localmente (localStorage)
- Comunicação direta com APIs (GitHub, Vercel)
- Sem servidor intermediário
- Código open-source auditável

---

## 🐛 Troubleshooting

### Plugin não aparece no Figma
- Certifique-se de usar Figma Desktop (não browser)
- Reimporte o manifest.json

### Erro ao criar PR
- Verifique se o token tem permissões `repo` e `workflow`
- Confirme que o repositório existe
- Teste o token manualmente: `curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user`

### Workflow trava em uma etapa
- Clique em "Pausar" e depois "Continuar"
- Se persistir, cancele e reinicie
- Verifique console do Figma: `View` → `Developer Console`

### Código gerado incompleto
- Componentes muito complexos podem precisar ajustes manuais
- Revise o PR antes de aprovar
- Faça melhorias incrementais

---

## 📝 Changelog

### v1.0.0 (2024-02-10)
- 🎉 Lançamento inicial
- ✅ Seleção de componentes com variantes
- ✅ Workflow automatizado completo
- ✅ Geração de código em 3 formatos
- ✅ Integração GitHub + Vercel
- ✅ Controle de workflow (pausar/retomar)
- ✅ Armazenamento de credenciais

---

## 🤝 Contribuindo

Contribuições são bem-vindas! 

1. Fork este repositório
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Add: nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

---

## 📄 Licença

MIT License - veja LICENSE para detalhes

---

## 💬 Suporte

- Issues: https://github.com/seu-usuario/design-system-publisher/issues
- Documentação: https://docs.seu-site.com
- Email: suporte@seu-site.com

---

## 🙏 Créditos

Desenvolvido com ❤️ usando:
- Figma Plugin API
- Figma MCP (Model Context Protocol)
- Claude AI (Anthropic)
- GitHub API
- Vercel API

---

**🚀 Transforme seu Design System do Figma em código de produção em minutos!**
