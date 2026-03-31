#!/bin/bash

# DataLukas - Setup Automático para Nova Máquina
# ===============================================

set -e  # Exit on error

echo "🚀 DataLukas - Setup Nova Máquina"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}$1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Arquivo package.json não encontrado!"
    echo "Execute este script na raiz do projeto DataLukas"
    exit 1
fi

print_success "Projeto DataLukas detectado"
echo ""

# Step 1: Check Node.js
print_step "1. Verificando Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js encontrado: $NODE_VERSION"
else
    print_error "Node.js não encontrado!"
    echo "Instale Node.js 18+ antes de continuar"
    exit 1
fi

# Step 2: Install dependencies
print_step "2. Instalando dependências..."
if npm install; then
    print_success "Dependências instaladas"
else
    print_error "Falha ao instalar dependências"
    exit 1
fi

# Step 3: Setup .env
print_step "3. Configurando variáveis de ambiente..."
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_success "Arquivo .env criado a partir do template"
        print_warning "CONFIGURE suas credenciais Firebase no arquivo .env"
        echo "   Edite: nano .env"
    else
        print_error "Template .env.example não encontrado"
        exit 1
    fi
else
    print_success "Arquivo .env já existe"
fi

# Check if .env has real values
if grep -q "your_api_key_here" .env 2>/dev/null; then
    print_warning "Configure credenciais reais no .env antes de continuar"
    echo ""
    echo "📋 Passos para obter credenciais:"
    echo "1. Acesse: https://console.firebase.google.com/project/datalukas-7ff57"
    echo "2. Project Settings > General > Your apps"
    echo "3. Copie as configurações para o .env"
    echo ""
    read -p "Pressione ENTER quando terminar de configurar..."
fi

# Step 4: Check Firebase CLI
print_step "4. Verificando Firebase CLI..."
if command -v firebase &> /dev/null; then
    FIREBASE_VERSION=$(firebase --version)
    print_success "Firebase CLI encontrado: $FIREBASE_VERSION"
else
    print_warning "Firebase CLI não encontrado"
    echo "Instalando Firebase CLI..."
    if npm install -g firebase-tools; then
        print_success "Firebase CLI instalado"
    else
        print_warning "Falha ao instalar Firebase CLI globalmente"
        echo "Execute manualmente: npm install -g firebase-tools"
    fi
fi

# Step 5: Test build
print_step "5. Testando build..."
if npm run build > /dev/null 2>&1; then
    print_success "Build funcionando corretamente"
else
    print_error "Falha no build"
    echo "Verifique suas configurações no .env"
    echo "Execute: npm run build para ver os erros"
fi

# Step 6: Information about users
print_step "6. Informações sobre usuários Firebase..."
echo ""
echo "📧 Usuários que devem existir no Firebase Auth:"
echo "   admin@datalukas.com     (senha: admin)"
echo "   andrade@datalukas.com   (senha: andrade)"
echo "   leo@datalukas.com       (senha: leo)"
echo "   rallyson@datalukas.com  (senha: rallyson)"
echo "   william@datalukas.com   (senha: william)"
echo "   helder@datalukas.com    (senha: helder)"
echo ""
echo "🔧 Para configurar admin claims:"
echo "   firebase login"
echo "   firebase auth:set-claims admin@datalukas.com '{\"admin\":true}'"
echo ""

# Step 7: Final instructions
print_step "7. Próximos passos..."
echo ""
echo "🚀 Para iniciar o projeto:"
echo "   npm run dev"
echo ""
echo "🧪 Para testar:"
echo "   Acesse: http://localhost:5173"
echo "   Login admin: admin@datalukas.com / admin"
echo "   Login funcionário: helder@datalukas.com / helder"
echo ""

# Step 8: Ask to start dev server
echo "═══════════════════════════════════════════"
print_success "Setup concluído!"
echo ""
read -p "Deseja iniciar o servidor de desenvolvimento agora? (y/N): " start_dev

if [[ $start_dev =~ ^[Yy]$ ]]; then
    echo ""
    print_step "Iniciando servidor..."
    echo "Acesse: http://localhost:5173"
    echo "Pressione Ctrl+C para parar"
    echo ""
    npm run dev
else
    echo ""
    print_success "Setup completo! Execute 'npm run dev' quando estiver pronto."
fi