#!/bin/bash
# DataLukas - Quick Start Automatizado

echo "═══════════════════════════════════════"
echo "  🚀 DataLukas - Quick Start"
echo "═══════════════════════════════════════"
echo ""

# Verificar se está na raiz do projeto
if [ ! -f "package.json" ]; then
    echo "❌ Execute na raiz do projeto DataLukas"
    exit 1
fi

echo "📦 Instalando dependências..."
if npm install; then
    echo "✅ Dependências instaladas"
else
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

echo ""
echo "⚙️ Configurando .env..."
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ Arquivo .env criado"
        echo "⚠️  Configure suas credenciais Firebase no .env"
        echo ""
        echo "📍 Obtenha em: https://console.firebase.google.com/project/datalukas-7ff57"
        echo "   Project Settings > General > Your apps"
        echo ""
        read -p "Pressione ENTER após configurar .env..."
    fi
else
    echo "✅ Arquivo .env encontrado"
fi

echo ""
echo "🧪 Testando build..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Build funcionando"
else
    echo "❌ Erro no build - verifique configurações .env"
    exit 1
fi

echo ""
echo "═══════════════════════════════════════"
echo "  📧 Credenciais de Acesso"
echo "═══════════════════════════════════════"
echo ""
echo "🔐 Admin:"
echo "   Email: admin@datalukas.com"
echo "   Senha: admin"
echo ""
echo "👥 Funcionários:"
echo "   Email: helder@datalukas.com    | Senha: helder"
echo "   Email: andrade@datalukas.com   | Senha: andrade"
echo "   Email: leo@datalukas.com       | Senha: leo"
echo "   Email: rallyson@datalukas.com  | Senha: rallyson"
echo "   Email: william@datalukas.com   | Senha: william"
echo ""

echo "🚀 Iniciando aplicação..."
echo "📍 Acesse: http://localhost:5173"
echo "🔧 Pressione Ctrl+C para parar"
echo ""

npm run dev
