#!/bin/bash

echo "🔒 DataLukas - Configuração Segura"
echo "=================================="
echo ""
echo "⚠️  IMPORTANTE: Este projeto está em repositório público"
echo "    Suas credenciais ficam apenas local (.env protegido)"
echo ""

# Verificar se está em repositório git
if [ -d ".git" ]; then
    echo "📍 Repositório Git detectado"
    echo "✅ .env está protegido no .gitignore"
else
    echo "⚠️  Não é um repositório Git - cuidado com credenciais"
fi

echo ""
echo "📋 Para configurar Firebase:"
echo ""
echo "1. Acesse: https://console.firebase.google.com/project/datalukas-7ff57"
echo "2. Project Settings > General > Your apps"
echo "3. Configure seu .env local (nunca commitado)"
echo "4. Crie usuários no Authentication"
echo "5. Execute: firebase auth:set-claims admin@datalukas.com '{\"admin\":true}'"
echo ""

# Verificar se .env existe e tem placeholder
if [ -f ".env" ]; then
    if grep -q "your_api_key_here" .env; then
        echo "⚠️  Configure seu .env com credenciais reais"
        echo "   Edite: nano .env"
    else
        echo "✅ .env configurado"
        
        # Testar se Firebase está funcionando
        echo ""
        echo "🧪 Testando configuração..."
        
        if npm run build > /dev/null 2>&1; then
            echo "✅ Build funcionando"
            
            echo ""
            echo "🚀 Iniciando aplicação..."
            echo "   Acesse: http://localhost:5173"
            echo "   Teste login: admin@datalukas.com / admin"
            echo ""
            
            npm run dev
        else
            echo "❌ Erro no build - verifique .env"
        fi
    fi
else
    echo "❌ Arquivo .env não encontrado"
    echo "   Execute: cp .env.example .env"
fi