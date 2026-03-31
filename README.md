# DataLukas - Sistema de Ranking de Atendentes

Sistema de gestão e ranking de desempenho para equipe de suporte técnico com **Firebase Auth** e **Firestore Security Rules**.

## 🚀 Tecnologias

- **Vite** - Build tool e dev server
- **React 18** - Framework UI
- **TypeScript** - Type safety
- **Framer Motion** - Animações
- **Lucide React** - Ícones
- **Firebase Auth** - Autenticação real e segura
- **Firestore** - Backend com regras de segurança
- **CSS Modules** - Estilos (mantém identidade visual original)

## 🔥 Firebase Auth Implementado

### Mapeamento de Usuários
```
admin     → admin@datalukas.com
andrade   → andrade@datalukas.com
leo       → leo@datalukas.com
rallyson  → rallyson@datalukas.com
william   → william@datalukas.com
helder    → helder@datalukas.com
```

### Segurança
- ✅ JWT tokens com custom claims
- ✅ Role-based access control
- ✅ Firestore rules granulares
- ✅ Session management automático
- ✅ Proteção de rotas com ProtectedRoute

## 📁 Estrutura do Projeto

```
datalukas/
├── src/
│   ├── components/          # Componentes React
│   │   ├── ProtectedRoute.tsx # Proteção de rotas
│   │   ├── Login.tsx         # Login com Firebase Auth
│   │   ├── AdminPanel.tsx    # Painel administrativo
│   │   ├── EmployeePanel.tsx # Painel do funcionário
│   │   ├── Mailbox.tsx       # Mensagens anônimas
│   │   ├── Ranking.tsx       # Visualização do ranking
│   │   └── ...
│   ├── contexts/
│   │   └── AuthContext.tsx   # Contexto de autenticação
│   ├── hooks/
│   │   └── useAuth.ts        # Hook customizado
│   ├── services/
│   │   └── firebase.ts       # Config + user mapping
│   └── ...
├── firestore.rules           # Regras de segurança
├── FIREBASE_SETUP.md        # Guia de configuração
├── firebase-setup.sh        # Script de setup
└── ...
```

## 🛡️ Firestore Security Rules

### Mensagens (messages)
- ✅ Criar: Livre para autenticados (envio anônimo)
- ✅ Ler: Apenas destinatário + admin
- ✅ Atualizar: Apenas destinatário (marcar como lido)

### Contestações (contests)
- ✅ Criar: Funcionários autenticados
- ✅ Ler: Próprias contestações + admin
- ✅ Atualizar status: Apenas admin

### Notas (attendants)
- ✅ Ler: Todos autenticados
- ✅ Escrever: Apenas admin (proteção dos scores)

## 🔧 Setup Rápido

### 1. Instalar Dependências
```bash
NODE_ENV=development npm install
```

### 2. Configurar Firebase
```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar com suas credenciais
nano .env

# Executar setup automático
./firebase-setup.sh
```

### 3. Criar Usuários Firebase
No [Firebase Console](https://console.firebase.google.com):
```
admin@datalukas.com      (senha: admin)
andrade@datalukas.com    (senha: andrade)
leo@datalukas.com        (senha: leo)
rallyson@datalukas.com   (senha: rallyson)
william@datalukas.com    (senha: william)
helder@datalukas.com     (senha: helder)
```

### 4. Deploy Regras + Admin Claims
```bash
firebase deploy --only firestore:rules
firebase auth:set-claims admin@datalukas.com '{"admin":true}'
```

### 5. Iniciar Desenvolvimento
```bash
npm run dev
```

## 👤 Acesso ao Sistema

### Administrador
- **Login**: admin@datalukas.com
- **Senha**: admin
- **Acesso**: Painel completo + edição de notas

### Funcionários
- **Login**: nome@datalukas.com (ex: helder@datalukas.com)
- **Senha**: próprio nome (ex: helder)
- **Acesso**: Ranking + painel pessoal + mensagens

## 📊 Funcionalidades

### Para Funcionários
- ✅ Ver ranking completo com justificativas
- ✅ Ver própria nota e histórico detalhado
- ✅ Enviar contestações sobre notas
- ✅ Sistema de mensagens anônimas
- ✅ Consultar regras de avaliação
- ✅ **Firebase Auth** com session persistence

### Para Admin
- ✅ Todas as funcionalidades do funcionário
- ✅ Aprovar/rejeitar contestações
- ✅ Editar notas manualmente
- ✅ Ver histórico de todos os funcionários
- ✅ Painel de controle completo
- ✅ **Custom claims** para privilégios especiais

## 🎯 Status do Projeto

### ✅ Etapa 1 - Estruturação e UI/UX
- Projeto Vite + React + TypeScript
- 8 componentes modulares
- CSS original 100% preservado
- Estado em memória

### ✅ Etapa 2 - Firebase Auth e Infraestrutura  
- **Firebase Authentication** implementado
- **AuthContext** e **ProtectedRoute**
- **Firestore Security Rules** granulares
- **User mapping** para emails fictícios
- **Custom claims** para admin
- **Variáveis de ambiente** seguras

### 🔄 Etapa 3 - Firestore Integration (Próxima)
- Substituir estado local por Firestore
- Real-time listeners
- Custom hooks para collections
- Sync automático entre usuários

## 🛠️ Comandos

```bash
# Desenvolvimento
npm run dev

# Build produção
npm run build

# Preview build
npm run preview

# Setup Firebase
./firebase-setup.sh
```

## 📄 Documentação

- [ETAPA1_CONCLUIDA.md](./ETAPA1_CONCLUIDA.md) - Primeira etapa
- [ETAPA2_CONCLUIDA.md](./ETAPA2_CONCLUIDA.md) - Firebase Auth
- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Guia Firebase
- [firestore.rules](./firestore.rules) - Regras de segurança

## ⚠️ Observações

### Desenvolvimento
- Requer usuários criados no Firebase Auth
- Variáveis de ambiente obrigatórias
- Admin precisa de custom claim

### Build
- Bundle: 164KB gzipped (Firebase incluído)
- Build time: ~10s
- Suporte a emuladores Firebase

### Segurança
- Autenticação real com JWT
- Regras Firestore testadas
- Role-based access control
- Session management automático

---

📄 **Licença**: Projeto interno - DataLukas Internet UP  
🔥 **Firebase**: Auth + Firestore integrados  
✅ **Status**: Pronto para Etapa 3 (Firestore Integration)
