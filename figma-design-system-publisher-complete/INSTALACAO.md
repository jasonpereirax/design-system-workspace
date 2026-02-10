# 📦 Guia Rápido de Instalação

## 🚀 3 Passos para Começar

### 1️⃣ Importar no Figma

1. Abra o **Figma Desktop** (não funciona no navegador)
2. Menu: **Plugins** → **Development** → **Import plugin from manifest...**
3. Selecione o arquivo `manifest.json` desta pasta
4. Pronto! O plugin está instalado

### 2️⃣ Criar Token do GitHub

1. Acesse: https://github.com/settings/tokens/new
2. Marque as permissões:
   - ✅ `repo` (acesso total ao repositório)
   - ✅ `workflow` (executar GitHub Actions)
3. Clique em **Generate token**
4. **COPIE O TOKEN** (você não poderá vê-lo novamente!)

### 3️⃣ Usar o Plugin

1. Abra seu arquivo no Figma
2. Menu: **Plugins** → **Design System Publisher Pro**
3. Selecione os componentes
4. Configure o GitHub Token
5. Clique em **Iniciar Publicação**

---

## ✅ Checklist Pré-Instalação

Antes de começar, certifique-se de ter:

- [ ] Figma Desktop instalado
- [ ] Conta no GitHub
- [ ] Repositório criado no GitHub
- [ ] Token do GitHub com permissões corretas
- [ ] (Opcional) Conta na Vercel para deploy automático

---

## 🎯 Primeiro Uso

### Passo a Passo Completo

**1. Abrir o Plugin**
```
Figma → Plugins → Design System Publisher Pro
```

**2. Selecionar Componentes**
- Visualize componentes organizados por página
- Use a busca se precisar filtrar
- Clique para selecionar (✓ aparece no canto)
- Component Sets: clique para expandir variantes

**3. Configurar GitHub**
```
Passo 2 → Configurar

GitHub Token: ghp_xxxxxxxxxxxx
Owner: seu-usuario
Repositório: design-system
```

**4. Configurar Vercel (Opcional)**
```
Vercel Token: (deixe em branco para configurar depois)
```

**5. Revisar e Publicar**
```
Passo 3 → Revisar
- Veja o resumo
- Clique em "🚀 Iniciar Publicação"
- Acompanhe o progresso
```

---

## 🔧 Configuração do Repositório

### Estrutura Recomendada

Crie um repositório novo no GitHub:

```bash
# Opção 1: Via interface do GitHub
https://github.com/new

# Opção 2: Via CLI
gh repo create design-system --public
cd design-system
git init
```

### Arquivos Base (Opcional)

O plugin cria tudo automaticamente, mas você pode preparar:

```
design-system/
├── .gitignore
├── package.json
├── README.md
└── vercel.json
```

**package.json mínimo:**
```json
{
  "name": "design-system",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "react": "^18.2.0"
  },
  "devDependencies": {
    "vite": "^4.0.0"
  }
}
```

**vercel.json:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "react"
}
```

---

## 🎨 Preparar Componentes no Figma

### Melhores Práticas

**1. Organizar por Páginas**
```
📄 Buttons
📄 Inputs
📄 Cards
📄 Modals
```

**2. Usar Component Sets para Variantes**
```
Button/
  ├─ Primary
  ├─ Secondary
  └─ Outlined
```

**3. Nomear Corretamente**
```
✅ Button/Primary
✅ Card/Default
❌ Button 1
❌ Rectangle 123
```

**4. Adicionar Descrições**
```
Clique com botão direito → Edit description
"Botão primário usado para ações principais"
```

---

## 🚀 Deploy na Vercel

### Opção 1: Automático (com Token)

1. Obtenha token: https://vercel.com/account/tokens
2. Cole no plugin
3. Pronto! Deploy configurado automaticamente

### Opção 2: Manual

1. Acesse: https://vercel.com/new
2. Importe seu repositório do GitHub
3. Configure:
   - Framework Preset: **React**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Clique em **Deploy**

---

## ❓ FAQ

**Q: Funciona no Figma Browser?**
A: Não, apenas no Figma Desktop.

**Q: Preciso instalar algo além do plugin?**
A: Não! Tudo funciona direto no Figma.

**Q: Meus tokens ficam salvos onde?**
A: No localStorage do Figma, apenas no seu computador.

**Q: Posso usar com repositório privado?**
A: Sim! Funciona com repos públicos e privados.

**Q: E se eu não tiver Vercel?**
A: Deixe o campo em branco. Você pode configurar depois.

**Q: Posso cancelar o workflow?**
A: Sim! Clique em "Cancelar" durante a execução.

**Q: O que fazer se der erro?**
A: Veja o console: `View` → `Developer Console` no Figma.

---

## 🆘 Problemas Comuns

### Plugin não aparece
```
Solução: Use Figma Desktop, não o navegador
```

### Token inválido
```
Solução: Verifique se marcou as permissões "repo" e "workflow"
```

### Repositório não encontrado
```
Solução: Confirme que o repositório existe e o nome está correto
```

### Workflow trava
```
Solução: Clique em "Pausar" e depois "Continuar"
```

---

## 📞 Suporte

Precisa de ajuda?

- 📧 Email: suporte@exemplo.com
- 💬 GitHub Issues: [criar issue]
- 📖 Docs completa: README.md

---

**🎉 Pronto para começar! Boa sorte com seu Design System!**
