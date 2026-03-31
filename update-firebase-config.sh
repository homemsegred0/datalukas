#!/bin/bash

echo "🔥 Atualizando configuração Firebase"
echo "===================================="
echo ""
echo "Cole as configurações do seu projeto Firebase:"
echo "(Você pode obter em Firebase Console > Project Settings > General > Your apps)"
echo ""

read -p "API Key: " api_key
read -p "Auth Domain: " auth_domain  
read -p "Project ID: " project_id
read -p "Storage Bucket: " storage_bucket
read -p "Messaging Sender ID: " messaging_sender_id
read -p "App ID: " app_id

echo ""
echo "📝 Criando arquivo .env..."

cat > .env << EOL
# Firebase Configuration (DataLukas Project - REAL)
VITE_FIREBASE_API_KEY=$api_key
VITE_FIREBASE_AUTH_DOMAIN=$auth_domain
VITE_FIREBASE_PROJECT_ID=$project_id
VITE_FIREBASE_STORAGE_BUCKET=$storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=$messaging_sender_id
VITE_FIREBASE_APP_ID=$app_id

# Development Settings
VITE_ENVIRONMENT=production
EOL

echo ""
echo "✅ Configuração atualizada com sucesso!"
echo ""
echo "🔧 Próximos passos:"
echo "1. Inicialize o Firebase no projeto: firebase init"
echo "2. Cadastre os usuários no Firebase Console"
echo "3. Configure claims do admin: firebase auth:set-claims admin@datalukas.com '{\"admin\":true}'"
echo "4. Inicie a aplicação: npm run dev"
