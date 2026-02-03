# 📂 ESTRUCTURA DE ARCHIVOS DEL SISTEMA DE AUTENTICACIÓN

```
sakai-ng/
│
├── 📄 README_AUTENTICACION.md ⭐ LÉEME PRIMERO
├── 📄 GUIA_AUTENTICACION.md (Guía completa paso a paso)
├── 📄 RESUMEN_IMPLEMENTACION.md (Resumen ejecutivo)
├── 📄 CHECKLIST_VERIFICACION.md (Lista de pruebas)
├── 📄 TOPBAR_EJEMPLOS.ts (Ejemplos para topbar)
├── 📄 ESTRUCTURA_ARCHIVOS.md (Este archivo)
├── 🔧 verificar-autenticacion.sh (Script de verificación)
│
├── src/
│   ├── app.routes.ts ✅ ACTUALIZADO (rutas con guards)
│   │
│   └── app/
│       │
│       ├── services/
│       │   └── auth.service.ts ⭐ NUEVO (servicio de autenticación)
│       │
│       ├── guards/
│       │   ├── auth.guard.ts ⭐ NUEVO (guard de autenticación)
│       │   └── role.guard.ts ⭐ NUEVO (guards de roles)
│       │
│       ├── pages/
│       │   └── auth/
│       │       ├── auth.routes.ts ✅ ACTUALIZADO
│       │       │
│       │       ├── login/ ⭐ NUEVO
│       │       │   ├── login.component.ts
│       │       │   ├── login.component.html
│       │       │   └── login.component.css
│       │       │
│       │       └── acceso-denegado/ ⭐ NUEVO
│       │           ├── acceso-denegado.component.ts
│       │           ├── acceso-denegado.component.html
│       │           └── acceso-denegado.component.css
│       │
│       └── layout/
│           └── component/
│               └── app.menu.ts ✅ ACTUALIZADO (menú dinámico)
│
└── [otros archivos del proyecto...]
```

---

## 📑 ÍNDICE DE ARCHIVOS POR CATEGORÍA

### 📚 Documentación (Archivos MD)
```
/README_AUTENTICACION.md        ⭐ Lee esto primero
/GUIA_AUTENTICACION.md          📖 Guía detallada
/RESUMEN_IMPLEMENTACION.md      📊 Resumen ejecutivo
/CHECKLIST_VERIFICACION.md      ✅ Lista de pruebas
/TOPBAR_EJEMPLOS.ts             💡 Ejemplos de código
/ESTRUCTURA_ARCHIVOS.md         📂 Este archivo
```

### 🔧 Scripts
```
/verificar-autenticacion.sh     🔍 Verifica instalación
```

### 💻 Código Fuente

#### Servicios
```
src/app/services/auth.service.ts
  ├─ Interfaz Usuario
  ├─ Interfaz Sesion
  ├─ Usuarios de prueba (admin, usuario)
  ├─ login()
  ├─ logout()
  ├─ isAuthenticated()
  ├─ getRol()
  ├─ getUsuario()
  ├─ hasRole()
  ├─ isAdmin()
  └─ getIniciales()
```

#### Guards
```
src/app/guards/auth.guard.ts
  └─ authGuard: CanActivateFn
      └─ Verifica si está autenticado

src/app/guards/role.guard.ts
  ├─ roleGuard: CanActivateFn
  │   └─ Verifica rol específico (data.roles)
  └─ adminGuard: CanActivateFn
      └─ Verifica si es ADMIN
```

#### Componentes de Autenticación
```
src/app/pages/auth/login/
  ├─ login.component.ts
  │   ├─ FormGroup con validaciones
  │   ├─ onSubmit()
  │   ├─ hasError()
  │   └─ getErrorMessage()
  ├─ login.component.html
  │   ├─ Formulario reactive
  │   ├─ Campos: usuario, contraseña
  │   ├─ Checkbox "Recordarme"
  │   └─ Toast de mensajes
  └─ login.component.css
      ├─ Diseño con gradiente
      ├─ Animaciones
      └─ Responsive

src/app/pages/auth/acceso-denegado/
  ├─ acceso-denegado.component.ts
  │   ├─ irAlInicio()
  │   ├─ volver()
  │   └─ cerrarSesion()
  ├─ acceso-denegado.component.html
  │   ├─ Mensaje claro
  │   ├─ Info del usuario
  │   └─ 3 botones de acción
  └─ acceso-denegado.component.css
      ├─ Diseño profesional
      └─ Animaciones
```

#### Rutas
```
src/app.routes.ts
  ├─ Layout principal (canActivate: [authGuard])
  │   ├─ Rutas públicas para todos
  │   └─ Rutas de admin (canActivate: [adminGuard])
  └─ Rutas de auth (sin guards)

src/app/pages/auth/auth.routes.ts
  ├─ /auth/login
  └─ /auth/acceso-denegado
```

#### Menú
```
src/app/layout/component/app.menu.ts
  ├─ generateMenu()
  │   ├─ Si es ADMIN → Menú completo
  │   ├─ Si es USUARIO → Menú limitado
  │   └─ Badges de rol
  └─ refreshMenu()
```

---

## 🗺️ FLUJO DE ARCHIVOS

### Cuando un usuario intenta acceder:

```
1. app.routes.ts
   └─> authGuard (auth.guard.ts)
       ├─ NO autenticado → /auth/login
       └─ SÍ autenticado → Continúa
           └─> adminGuard (role.guard.ts) [si es ruta de admin]
               ├─ NO es admin → /auth/acceso-denegado
               └─ SÍ es admin → Permite acceso

2. Usuario en /auth/login
   └─> login.component.ts
       └─> authService.login()
           ├─ Credenciales válidas
           │   ├─ Guarda en localStorage
           │   ├─ Actualiza signal
           │   └─ Redirige al dashboard
           └─ Credenciales inválidas
               └─ Muestra error

3. Menú lateral
   └─> app.menu.ts
       └─> authService.getUsuario()
           ├─ ADMIN → Genera menú completo
           └─ USUARIO → Genera menú limitado

4. Cerrar sesión
   └─> authService.logout()
       ├─ Limpia localStorage
       ├─ Limpia signal
       └─ Redirige a /auth/login
```

---

## 📊 DEPENDENCIAS ENTRE ARCHIVOS

```
auth.service.ts (Base)
  ↓
  ├─> auth.guard.ts (usa AuthService)
  ├─> role.guard.ts (usa AuthService)
  ├─> login.component.ts (usa AuthService)
  ├─> acceso-denegado.component.ts (usa AuthService)
  ├─> app.menu.ts (usa AuthService)
  └─> app.topbar.ts (opcional, usa AuthService)

app.routes.ts
  ├─> usa authGuard
  └─> usa adminGuard

auth.routes.ts
  ├─> usa LoginComponent
  └─> usa AccesoDenegadoComponent
```

---

## 🎯 ARCHIVOS CLAVE PARA ENTENDER EL SISTEMA

### 1️⃣ PRIMERO lee:
- `README_AUTENTICACION.md` - Inicio rápido

### 2️⃣ LUEGO revisa:
- `src/app/services/auth.service.ts` - Corazón del sistema

### 3️⃣ ENTIENDE los guards:
- `src/app/guards/auth.guard.ts` - Protección básica
- `src/app/guards/role.guard.ts` - Protección por rol

### 4️⃣ REVISA los componentes:
- `src/app/pages/auth/login/login.component.ts` - Login
- `src/app/pages/auth/acceso-denegado/acceso-denegado.component.ts` - Acceso denegado

### 5️⃣ ESTUDIA las rutas:
- `src/app.routes.ts` - Configuración de rutas con guards

### 6️⃣ ANALIZA el menú:
- `src/app/layout/component/app.menu.ts` - Menú dinámico

---

## 🔍 CÓMO BUSCAR ALGO

### Quiero entender cómo funciona el login:
```
1. src/app/pages/auth/login/login.component.ts
2. src/app/services/auth.service.ts (método login)
```

### Quiero saber cómo se protegen las rutas:
```
1. src/app.routes.ts (canActivate)
2. src/app/guards/auth.guard.ts
3. src/app/guards/role.guard.ts
```

### Quiero cambiar el menú:
```
1. src/app/layout/component/app.menu.ts (método generateMenu)
```

### Quiero modificar los usuarios de prueba:
```
1. src/app/services/auth.service.ts (array usuariosPrueba)
```

### Quiero cambiar el diseño del login:
```
1. src/app/pages/auth/login/login.component.html (estructura)
2. src/app/pages/auth/login/login.component.css (estilos)
```

---

## 📝 ARCHIVOS QUE PUEDES PERSONALIZAR

### 🎨 Diseño:
- `login.component.css` - Colores, animaciones del login
- `acceso-denegado.component.css` - Estilos de acceso denegado

### 💬 Mensajes:
- `login.component.html` - Textos del login
- `acceso-denegado.component.html` - Mensajes de error
- `login.component.ts` - Mensajes de Toast

### 👥 Usuarios:
- `auth.service.ts` - Array `usuariosPrueba`

### 📋 Menú:
- `app.menu.ts` - Método `generateMenu()`

### 🛣️ Rutas:
- `app.routes.ts` - Agregar/quitar rutas protegidas

---

## ⚠️ ARCHIVOS QUE NO DEBES MODIFICAR (sin entender)

- `auth.guard.ts` - Lógica crítica de seguridad
- `role.guard.ts` - Lógica crítica de roles
- `auth.service.ts` - Core del sistema (excepto usuarios de prueba)

Si necesitas modificarlos, lee los comentarios en el código primero.

---

## 🚀 ARCHIVOS PARA EMPEZAR RÁPIDO

Solo necesitas leer estos 2 archivos:

1. **README_AUTENTICACION.md** - Instrucciones de inicio
2. **src/app/services/auth.service.ts** - Para agregar usuarios

Todo lo demás ya funciona.

---

## 📦 ARCHIVOS DE RESPALDO

Si necesitas restaurar algo:

```bash
# Ver cambios
git status

# Restaurar un archivo
git checkout src/app/layout/component/app.topbar.ts

# Ver diferencias
git diff src/app.routes.ts
```

---

## 🎓 ORDEN DE LECTURA RECOMENDADO

### Para Aprender el Sistema:
```
1. README_AUTENTICACION.md (10 min)
2. auth.service.ts (15 min)
3. auth.guard.ts (5 min)
4. role.guard.ts (5 min)
5. login.component.ts (10 min)
6. app.routes.ts (5 min)
7. app.menu.ts (10 min)
```

### Para Probar el Sistema:
```
1. README_AUTENTICACION.md
2. CHECKLIST_VERIFICACION.md
```

### Para Personalizar:
```
1. TOPBAR_EJEMPLOS.ts (si quieres actualizar topbar)
2. login.component.css (si quieres cambiar diseño)
3. auth.service.ts (si quieres agregar usuarios)
```

---

## 🎯 RESUMEN VISUAL

```
┌─────────────────────────────────────┐
│    DOCUMENTACIÓN (6 archivos)      │
│    Léeme primero                    │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│    CÓDIGO FUENTE (13 archivos)     │
│    ├─ Servicios (1)                │
│    ├─ Guards (2)                    │
│    ├─ Componentes (6)               │
│    ├─ Rutas (2)                     │
│    └─ Menú (1)                      │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│    SCRIPTS (1 archivo)              │
│    Verificación automática          │
└─────────────────────────────────────┘
```

---

**Total: 20 archivos creados/actualizados**

- ⭐ NUEVO: 13 archivos
- ✅ ACTUALIZADO: 3 archivos
- 📚 DOCUMENTACIÓN: 6 archivos
- 🔧 SCRIPTS: 1 archivo

---

**Estructura de Archivos v1.0**
*Sistema de Autenticación SAKAI*
*Fecha: Febrero 2, 2026*
