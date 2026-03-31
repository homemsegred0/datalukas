# 🚀 Setup DataLukas - Nova Máquina

## 📋 Guia Completo para Configurar o Projeto em Qualquer Máquina

### ⚡ Quick Start (Resumo)
```bash
git clone [seu-repositorio] && cd datalukas
npm install
cp .env.example .env
# Configure .env com credenciais Firebase
npm run dev
```

---

## 🔧 Setup Detalhado Passo a Passo

### **Pré-requisitos**
- ✅ Node.js 18+ instalado
- ✅ Git configurado
- ✅ Firebase CLI (opcional, mas recomendado)

### **1. Clonar e Preparar Projeto**

```bash
# Clone o repositório
git clone [URL_DO_SEU_REPOSITORIO]
cd datalukas

# Verificar branch
git branch -a
git checkout estruturacao-feature

# Instalar dependências
npm install
```

### **2. Configurar Variáveis de Ambiente**

```bash
# Copiar template de configuração
cp .env.example .env

# Editar com suas credenciais reais
nano .env
# ou
code .env
```

**Obter credenciais no Firebase Console:**
1. Acesse: https://console.firebase.google.com/project/datalukas-7ff57
2. ⚙️ **Project Settings** → **General**
3. Seção **"Your apps"** → **Config** do app web
4. Copie e cole no `.env`:

```bash
# Firebase Configuration - datalukas-7ff57
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=datalukas-7ff57.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=datalukas-7ff57
VITE_FIREBASE_STORAGE_BUCKET=datalukas-7ff57.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id

VITE_ENVIRONMENT=production
```

### **3. Configurar Firebase (Se Necessário)**

**Se os usuários já existem no Firebase, pule para o passo 4.**

```bash
# Instalar Firebase CLI (se não tiver)
npm install -g firebase-tools

# Login no Firebase
firebase login

# Verificar projeto
firebase projects:list
firebase use datalukas-7ff57
```

**Criar usuários no Firebase Console:**
1. **Authentication** → **Users** → **Add user**
2. Criar cada usuário:

```
📧 Email                    🔑 Senha
admin@datalukas.com         admin
andrade@datalukas.com       andrade
leo@datalukas.com           leo
rallyson@datalukas.com      rallyson
william@datalukas.com       william
helder@datalukas.com        helder
```

**Configurar privilégios de admin:**
```bash
firebase auth:set-claims admin@datalukas.com '{"admin":true}'
```

### **4. Habilitar Serviços Firebase**

**Authentication:**
1. Firebase Console → **Authentication**
2. **Sign-in method** → **Email/Password** → **Enable**

**Firestore:**
1. Firebase Console → **Firestore Database**
2. **Create database** → **Test mode** → **us-central**

**Deploy regras (se necessário):**
```bash
firebase deploy --only firestore:rules
```

### **5. Testar Configuração**

```bash
# Verificar se build funciona
npm run build

# Iniciar desenvolvimento
npm run dev
```

**Acesse:** http://localhost:5173

**Teste login:**
- **Admin**: admin@datalukas.com / admin
- **Employee**: helder@datalukas.com / helder

---

## 🛠️ Scripts Úteis

### **Configuração Automática**
```bash
# Script de setup completo
./setup-seguro.sh

# Setup Firebase
./firebase-setup.sh
```

### **Comandos de Desenvolvimento**
```bash
# Desenvolvimento
npm run dev

# Build produção
npm run build

# Preview build
npm run preview
```

### **Firebase CLI**
```bash
# Verificar usuários
firebase auth:export users.json

# Ver claims do admin
firebase auth:get-claims admin@datalukas.com

# Deploy regras
firebase deploy --only firestore:rules
```

---

## 🔍 Verificação de Funcionamento

### ✅ **Checklist de Validação**

**1. Build sem erros:**
```bash
npm run build
# Deve compilar sem erros
```

**2. Servidor funcionando:**
```bash
npm run dev
# Acesse http://localhost:5173
```

**3. Firebase conectado:**
- Abrir DevTools → Console
- Não deve ter erros de Firebase

**4. Login funcionando:**
- Tente login: admin@datalukas.com / admin
- Deve acessar painel admin

**5. Funcionário funcionando:**
- Tente login: helder@datalukas.com / helder
- Deve acessar painel employee

---

## 🚨 Resolução de Problemas

### **Erro: "Missing Firebase environment variables"**
```bash
# Verificar .env
cat .env | grep VITE_FIREBASE

# Deve mostrar todas as variáveis preenchidas
```

### **Erro: "User not found"**
```bash
# Verificar usuários no Firebase
firebase auth:export --format=JSON users.json
cat users.json | jq '.users[].email'
```

### **Erro: "Permission denied"**
```bash
# Redeploy regras Firestore
firebase deploy --only firestore:rules
```

### **Erro: Build falha**
```bash
# Limpar cache
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### **Erro: "Admin não tem privilégios"**
```bash
# Verificar claims
firebase auth:get-claims admin@datalukas.com

# Redefinir claims
firebase auth:set-claims admin@datalukas.com '{"admin":true}'
```

---

## 📁 Estrutura de Arquivos Importantes

```
datalukas/
├── .env                    # 🔐 Credenciais (nunca commitado)
├── .env.example           # 📝 Template público
├── firebase.json          # ⚙️ Configuração Firebase
├── firestore.rules        # 🛡️ Regras de segurança
├── src/
│   ├── services/firebase.ts   # 🔥 Config Firebase
│   ├── contexts/AuthContext.tsx # 🔐 Contexto auth
│   └── components/           # 🎨 Componentes React
└── README.md              # 📖 Documentação
```

---

## 🎯 Primeiros Passos Após Setup

1. **Testar todos os logins** (admin + funcionários)
2. **Verificar funcionalidades principais:**
   - Ranking de funcionários
   - Envio de contestações
   - Sistema de mensagens
   - Painel administrativo
3. **Customizar dados** se necessário
4. **Deploy** quando pronto

---

## 📞 Suporte

### **Documentação Detalhada:**
- `ETAPA1_CONCLUIDA.md` - Estruturação UI/UX
- `ETAPA2_CONCLUIDA.md` - Firebase Auth
- `FIREBASE_SETUP.md` - Configuração Firebase
- `CONFIGURACAO_SEGURA.md` - Segurança

### **Scripts de Ajuda:**
- `./setup-seguro.sh` - Setup automatizado
- `./firebase-setup.sh` - Configuração Firebase

---

## ✅ **Projeto Pronto Para Uso!**

Após seguir este guia, você terá:
- 🔥 Firebase Auth funcionando
- 🛡️ Firestore com regras de segurança
- 🎨 Interface completa preservada
- 👥 Sistema de usuários configurado
- 📱 Aplicação totalmente funcional

**Happy coding!** 🚀