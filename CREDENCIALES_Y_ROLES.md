# 🔐 Credenciales y Roles del Sistema

## Usuarios Disponibles

### 👨‍💼 Administradores

#### 1. Admin Principal
- **Usuario**: `admin`
- **Contraseña**: `admin123`
- **Rol**: Administrador
- **Email**: admin
- **Permisos**: Acceso completo al sistema

#### 2. Carlos Rodríguez
- **Usuario**: `carlos@example.com`
- **Contraseña**: `carlos123`
- **Rol**: Administrador
- **Departamento**: IT
- **Permisos**: Acceso completo al sistema

### 👤 Usuarios Regulares

#### 1. Usuario de Prueba
- **Usuario**: `usuario`
- **Contraseña**: `user123`
- **Rol**: Usuario
- **Email**: usuario
- **Permisos**: Vista limitada

#### 2. María García
- **Usuario**: `maria@example.com`
- **Contraseña**: `maria123`
- **Rol**: Usuario
- **Departamento**: Calidad
- **Permisos**: Ver proyectos, registrar riesgos, ver reportes

#### 3. Ana Martínez (Inactiva)
- **Usuario**: `ana@example.com`
- **Contraseña**: `ana123`
- **Rol**: Usuario
- **Estado**: INACTIVO
- **Nota**: No puede iniciar sesión

---

## 📋 Diferencias entre Roles

### ✅ Administrador puede acceder a:
- ✓ Panel de Control Principal
- ✓ Matriz de Riesgos
- ✓ Registro de Riesgos
- ✓ Gestión de Proyectos (completa)
- ✓ **Gestión de Usuarios** (exclusivo)
- ✓ **Reportes y Análisis** (exclusivo)
- ✓ **Configuración del Sistema** (exclusivo)
- ✓ Subir Archivos
- ✓ Documentación
- ✓ Mi Perfil
- ✓ Cerrar Sesión

### 👤 Usuario Regular puede acceder a:
- ✓ Dashboard
- ✓ Gestión de Proyectos (solo lectura)
- ✓ Subir Archivos
- ✓ Documentación
- ✓ Cerrar Sesión

---

## 🔒 Sistema de Protección de Rutas

### Guards Implementados:

1. **authGuard**: Verifica que el usuario esté autenticado
   - Si no está autenticado → redirige a `/auth/login`
   
2. **adminGuard**: Verifica que el usuario sea administrador
   - Si no es admin → redirige a `/auth/acceso-denegado`
   - Si no está autenticado → redirige a `/auth/login`

### Rutas Protegidas:

```
/                           → authGuard (cualquier usuario autenticado)
├── /dashboard              → authGuard
├── /subir-archivos         → authGuard
├── /gestion-de-proyectos   → authGuard
│
├── /panel-de-control-principal   → authGuard + adminGuard (solo ADMIN)
├── /registro-de-riesgos          → authGuard + adminGuard (solo ADMIN)
├── /gestion-de-usuarios          → authGuard + adminGuard (solo ADMIN)
├── /reportes-y-analisis          → authGuard + adminGuard (solo ADMIN)
└── /configuracion-del-sistema    → authGuard + adminGuard (solo ADMIN)
```

---

## 🎨 Interfaz según Rol

### Barra Superior (Topbar):
- **Logo SAKAI**
- **Botón de menú** (☰)
- **Cambiar tema** (🌙/☀️)
- **Paleta de colores** (🎨)
- **Avatar del usuario**:
  - 🔴 Rojo para Administradores
  - 🔵 Azul para Usuarios Regulares

### Menú del Avatar (clic en el avatar):
- **Administradores**:
  - Mi Perfil
  - Configuración
  - Cerrar Sesión

- **Usuarios Regulares**:
  - Cerrar Sesión

---

## 🚀 Cómo Probar

### 1. Iniciar Sesión como Admin:
```
Usuario: admin
Contraseña: admin123
```
→ Verás todas las opciones del menú con badges "ADMIN"

### 2. Iniciar Sesión como Usuario:
```
Usuario: usuario
Contraseña: user123
```
→ Verás solo las opciones básicas del menú

### 3. Probar Acceso Denegado:
1. Inicia sesión como usuario regular
2. Intenta acceder a: `http://localhost:4200/configuracion-del-sistema`
3. Deberías ver la página "Acceso Denegado"

---

## 📝 Notas Importantes

1. **Sesión Persistente**: El sistema guarda la sesión en `localStorage`
2. **Cambio de Usuario**: Para cambiar de usuario, cierra sesión primero
3. **Menú Dinámico**: El menú lateral cambia automáticamente según el rol
4. **Avatar Personalizado**: Los administradores tienen avatar rojo, los usuarios azul
5. **Badges**: Las opciones exclusivas de admin tienen un badge rojo "ADMIN"

---

## 🔧 Desarrollo

Para agregar un nuevo usuario con rol específico, edita:
```
src/app/pages/service/usuarios.service.ts
```

Método: `getUsuariosMock()`

Ejemplo:
```typescript
{
  id: 6,
  nombre: 'Nuevo Usuario',
  email: 'nuevo@example.com',
  password: 'nuevo123',
  rol: 'Administrador', // o 'Usuario'
  estado: 'activo',
  fechaRegistro: '2024-02-01',
  // ... más campos
}
```

---

✅ **Sistema completamente funcional con control de acceso por roles**
