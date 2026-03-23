# Central de Preços — F. Silva Reis

Sistema de consulta de preços para vendedores da F. Silva Reis.
Dados vêm de um Google Sheets que o admin atualiza.

---

## 🚀 Como colocar no ar (Deploy)

### Passo 1 — Google Sheets

1. Importe o arquivo `central_precos_fsr_completa.xlsx` no Google Sheets
2. Vá em **Arquivo → Compartilhar → Publicar na Web**
3. Selecione "Documento inteiro" e formato "Página da Web"
4. Clique em **Publicar**
5. Copie o **ID** da planilha da URL:
   ```
   https://docs.google.com/spreadsheets/d/ESTE_É_O_ID/edit
   ```
6. Cole o ID no arquivo `src/config.js`, na linha:
   ```js
   export const SHEETS_ID = 'COLE_SEU_ID_AQUI';
   ```

### Passo 2 — GitHub

1. Crie um repositório novo no GitHub (ex: `central-precos-fsr`)
2. Faça upload de todos os arquivos deste projeto para o repositório

### Passo 3 — Vercel (Deploy gratuito)

1. Acesse [vercel.com](https://vercel.com) e faça login com GitHub
2. Clique em **"New Project"**
3. Selecione o repositório `central-precos-fsr`
4. Framework: **Vite**
5. Clique em **Deploy**
6. Em ~1 minuto terá um link como: `https://central-precos-fsr.vercel.app`

### Passo 4 — Compartilhar com vendedores

Envie o link pelo WhatsApp. No celular, podem **"Adicionar à tela inicial"** para funcionar como app.

---

## 📱 Como usar

- **Vendedores**: Abrem o link, selecionam seu perfil, e veem os preços
- **Admin (Chico)**: Atualiza preços no Google Sheets — vendedores veem em tempo real
- **Pedidos**: Vendedor toca no item → Pedido → preenche → Copia p/ WhatsApp ou Email pro Roberto
- **Atualizar**: Botão 🔄 no canto superior recarrega os dados do Sheets

---

## 🔧 Estrutura do projeto

```
src/
  config.js    ← Configurações (ID do Sheets, vendedores, categorias)
  data.js      ← Busca dados do Google Sheets
  App.jsx      ← Interface completa
  main.jsx     ← Entry point React
```

---

## ⚙️ Desenvolvimento local

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`

---

## 📋 Funcionalidades

- ✅ 6 categorias com abas deslizantes
- ✅ Login por perfil (Admin / Vendedor)
- ✅ Busca e filtros por fornecedor
- ✅ Favoritos (salva no navegador)
- ✅ Copiar texto formatado para WhatsApp
- ✅ Sistema de pedidos com envio por email
- ✅ Dados em tempo real do Google Sheets
- ✅ PWA (instala como app no celular)
- ✅ Botão de atualizar dados
