# 🔒 Configuração Segura do Firebase - DataLukas

## ⚠️ IMPORTANTE - SEGURANÇA
Este projeto está em repositório público. NUNCA commite credenciais reais!

## 📋 Passos para Configurar (Localmente)

### 1. Obter Credenciais Firebase
1. Acesse: https://console.firebase.google.com/project/datalukas-7ff57
2. Vá em ⚙️ **Project Settings** → **General** 
3. Na seção **"Your apps"**, clique no app web ou crie um novo
4. Copie as configurações mostradas

### 2. Configurar Variáveis de Ambiente
```bash
# Edite o arquivo .env (já está no .gitignore)
nano .env

# Substitua os valores your_*_here pelas credenciais reais:
VITE_FIREBASE_API_KEY=SUA_API_KEY_REAL
VITE_FIREBASE_AUTH_DOMAIN=datalukas-7ff57.firebaseapp.com  
VITE_FIREBASE_PROJECT_ID=datalukas-7ff57
VITE_FIREBASE_STORAGE_BUCKET=datalukas-7ff57.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=SEU_SENDER_ID_REAL
VITE_FIREBASE_APP_ID=SEU_APP_ID_REAL
```

### 3. Habilitar Authentication
1. No Firebase Console → **Authentication** 
2. **Get started** → **Sign-in method**
3. Habilite **Email/password**

### 4. Criar Usuários
1. **Authentication** → **Users** → **Add user**
2. Crie os usuários:
   ```
   admin@datalukas.com     (senha: admin)
   andrade@datalukas.com   (senha: andrade)  
   leo@datalukas.com       (senha: leo)
   rallyson@datalukas.com  (senha: rallyson)
   william@datalukas.com   (senha: william)
   helder@datalukas.com    (senha: helder)
   ```

### 5. Configurar Admin (Via CLI)
```bash
# Login no Firebase
firebase login

# Definir privilégios de admin
firebase auth:set-claims admin@datalukas.com '{"admin":true}'

# Verificar
firebase auth:get-claims admin@datalukas.com
```

### 6. Deploy Regras de Segurança
```bash
firebase deploy --only firestore:rules
```

### 7. Testar Aplicação
```bash
npm run dev
```

## 🛡️ Segurança Implementada

✅ `.env` no `.gitignore` (credenciais protegidas)  
✅ Firestore rules granulares  
✅ Authentication obrigatória  
✅ Role-based access control  
✅ Custom claims para admin  
✅ Nenhuma credencial no código fonte  

## ⚠️ NUNCA FAÇA

❌ Commit arquivos `.env*` com credenciais reais  
❌ Hardcode API keys no código  
❌ Push credenciais para repositório público  
❌ Compartilhe credenciais em canais inseguros  

## ✅ REPOSITÓRIO PÚBLICO SEGURO

O repositório contém apenas:
- Código fonte limpo
- Templates de configuração (.env.example)
- Documentação
- Regras de segurança (firestore.rules)

As credenciais ficam apenas local na máquina do desenvolvedor.