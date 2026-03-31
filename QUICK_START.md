# 🚀 Quick Start - DataLukas

## ⚡ Setup Rápido (Nova Máquina)

```bash
# 1. Clone e acesse
git clone [seu-repositorio]
cd datalukas

# 2. Setup automático
./setup-nova-maquina.sh

# 3. Configure .env com credenciais Firebase
nano .env

# 4. Inicie a aplicação
npm run dev
```

## 📧 Usuários para Testar

```
Admin:      admin@datalukas.com     / admin
Employee:   helder@datalukas.com    / helder
            andrade@datalukas.com   / andrade
            leo@datalukas.com       / leo
            rallyson@datalukas.com  / rallyson
            william@datalukas.com   / william
```

## 📚 Documentação Completa

- **[SETUP_NOVA_MAQUINA.md](./SETUP_NOVA_MAQUINA.md)** - Guia detalhado
- **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** - Configuração Firebase
- **[CONFIGURACAO_SEGURA.md](./CONFIGURACAO_SEGURA.md)** - Segurança
- **[README.md](./README.md)** - Documentação técnica completa

## 🛠️ Comandos Úteis

```bash
npm run dev        # Desenvolvimento
npm run build      # Build produção
npm run preview    # Preview build
```

## 🔧 Firebase

```bash
firebase login
firebase auth:set-claims admin@datalukas.com '{"admin":true}'
firebase deploy --only firestore:rules
```

## 📱 Acesso

- **Local**: http://localhost:5173
- **Console Firebase**: https://console.firebase.google.com/project/datalukas-7ff57

---

✅ **Projeto pronto!** Sistema completo de ranking com Firebase Auth.