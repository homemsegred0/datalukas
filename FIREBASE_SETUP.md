# 🔥 Firebase Setup Guide - DataLukas

## Overview
Sistema agora usa Firebase Auth real com autenticação segura e regras granulares do Firestore.

## Quick Setup

### 1. Configurar Variáveis de Ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite com suas credenciais Firebase
nano .env
```

### 2. Instalar Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### 3. Criar Usuários no Firebase
No [Firebase Console](https://console.firebase.google.com):

**Authentication → Users → Add User:**
```
admin@datalukas.com      | Senha: admin
andrade@datalukas.com    | Senha: andrade
leo@datalukas.com        | Senha: leo
rallyson@datalukas.com   | Senha: rallyson
william@datalukas.com    | Senha: william
helder@datalukas.com     | Senha: helder
```

### 4. Deploy Regras Firestore
```bash
firebase deploy --only firestore:rules
```

### 5. Configurar Admin Claims
```bash
firebase auth:set-claims admin@datalukas.com '{"admin":true}'
```

### 6. Iniciar Aplicação
```bash
npm run dev
```

## Credenciais de Acesso

### Admin
- **Email**: admin@datalukas.com
- **Senha**: admin
- **Acesso**: Todas as funcionalidades

### Funcionários
- **Email**: nome@datalukas.com
- **Senha**: próprio nome
- **Exemplo**: helder@datalukas.com / helder

## Arquitetura de Segurança

### Authentication Flow
```
Username → Email Mapping → Firebase Auth → JWT Token → App Access
```

### Firestore Rules
- **Messages**: Leitura restrita ao destinatário
- **Contests**: Users veem apenas suas contestações
- **Attendants**: Admin-only write para scores
- **History**: Append-only audit trail

### Access Levels
- 🔴 **Public**: Nenhum acesso
- 🟡 **Employee**: Dados próprios + ranking
- 🟢 **Admin**: Acesso completo + edição

## Development

### Local com Emuladores (Opcional)
```bash
# Terminal 1: Start emulators
firebase emulators:start --only auth,firestore

# Terminal 2: Start app
VITE_ENVIRONMENT=development npm run dev
```

### Produção
```bash
# Build
npm run build

# Deploy (se configurado)
firebase deploy
```

## Troubleshooting

### "Missing Firebase environment variables"
- Verifique se o arquivo `.env` existe
- Confirme que todas as variáveis VITE_FIREBASE_* estão definidas

### "User not found" 
- Crie o usuário no Firebase Console
- Use o email correto: `username@datalukas.com`

### "Permission denied"
- Deploy das regras: `firebase deploy --only firestore:rules`
- Verifique se o admin tem custom claim: `firebase auth:list-claims`

### "Auth domain mismatch"
- Verifique VITE_FIREBASE_AUTH_DOMAIN no .env
- Adicione domínio autorizado no Firebase Console

## Security Features

✅ JWT-based authentication  
✅ Role-based access control  
✅ Granular Firestore rules  
✅ Custom claims for admin privileges  
✅ Session persistence  
✅ Automatic token refresh  
✅ Secure logout  
✅ Input validation client + server  

---

📚 **Docs**: [ETAPA2_CONCLUIDA.md](./ETAPA2_CONCLUIDA.md)  
🔧 **Setup Script**: `./firebase-setup.sh`  
🛡️ **Security Rules**: `./firestore.rules`