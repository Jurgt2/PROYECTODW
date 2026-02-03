#!/bin/bash

# Script de verificación del sistema de autenticación
# Este script verifica que todos los archivos necesarios estén presentes

echo "🔍 VERIFICANDO IMPLEMENTACIÓN DEL SISTEMA DE AUTENTICACIÓN"
echo "============================================================"
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de archivos
TOTAL=0
PRESENTES=0
FALTANTES=0

# Función para verificar archivo
check_file() {
    TOTAL=$((TOTAL + 1))
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1"
        PRESENTES=$((PRESENTES + 1))
    else
        echo -e "${RED}❌${NC} $1 ${RED}(FALTANTE)${NC}"
        FALTANTES=$((FALTANTES + 1))
    fi
}

echo "📂 Verificando Servicios..."
check_file "src/app/services/auth.service.ts"
echo ""

echo "🛡️  Verificando Guards..."
check_file "src/app/guards/auth.guard.ts"
check_file "src/app/guards/role.guard.ts"
echo ""

echo "🔐 Verificando Componente de Login..."
check_file "src/app/pages/auth/login/login.component.ts"
check_file "src/app/pages/auth/login/login.component.html"
check_file "src/app/pages/auth/login/login.component.css"
echo ""

echo "🚫 Verificando Componente de Acceso Denegado..."
check_file "src/app/pages/auth/acceso-denegado/acceso-denegado.component.ts"
check_file "src/app/pages/auth/acceso-denegado/acceso-denegado.component.html"
check_file "src/app/pages/auth/acceso-denegado/acceso-denegado.component.css"
echo ""

echo "🗺️  Verificando Rutas..."
check_file "src/app.routes.ts"
check_file "src/app/pages/auth/auth.routes.ts"
echo ""

echo "📋 Verificando Menú..."
check_file "src/app/layout/component/app.menu.ts"
echo ""

echo "📚 Verificando Documentación..."
check_file "GUIA_AUTENTICACION.md"
check_file "RESUMEN_IMPLEMENTACION.md"
check_file "TOPBAR_EJEMPLOS.ts"
echo ""

# Resumen
echo "============================================================"
echo -e "${YELLOW}📊 RESUMEN${NC}"
echo "============================================================"
echo -e "Total de archivos: ${TOTAL}"
echo -e "${GREEN}Presentes: ${PRESENTES}${NC}"
echo -e "${RED}Faltantes: ${FALTANTES}${NC}"
echo ""

if [ $FALTANTES -eq 0 ]; then
    echo -e "${GREEN}✅ ¡TODOS LOS ARCHIVOS ESTÁN PRESENTES!${NC}"
    echo ""
    echo "🚀 Próximos pasos:"
    echo "   1. Ejecuta: npm start"
    echo "   2. Abre: http://localhost:4200"
    echo "   3. Prueba login con: admin / admin123"
    echo ""
    echo "📖 Lee GUIA_AUTENTICACION.md para más información"
else
    echo -e "${RED}⚠️  FALTAN ALGUNOS ARCHIVOS${NC}"
    echo ""
    echo "Por favor, verifica que todos los archivos se hayan creado correctamente."
    echo "Consulta GUIA_AUTENTICACION.md para solucionar problemas."
fi

echo ""
echo "============================================================"
