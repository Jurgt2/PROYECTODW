# 🚀 GUÍA DE IMPLEMENTACIÓN DEL SISTEMA DE AUTENTICACIÓN
# Sistema de Login con Control de Roles - Angular 17+ (SAKAI)

## 📋 TABLA DE CONTENIDOS
1. [Archivos Generados](#archivos-generados)
2. [Instalación de Dependencias](#instalación-de-dependencias)
3. [Configuración Paso a Paso](#configuración-paso-a-paso)
4. [Actualización del Topbar](#actualización-del-topbar)
5. [Pruebas del Sistema](#pruebas-del-sistema)
6. [Solución de Problemas](#solución-de-problemas)

---

## ✅ ARCHIVOS GENERADOS

### Servicios:
- ✅ `src/app/services/auth.service.ts` - Servicio de autenticación

### Guards:
- ✅ `src/app/guards/auth.guard.ts` - Guard de autenticación
- ✅ `src/app/guards/role.guard.ts` - Guard de roles (incluye adminGuard)

### Componentes de Autenticación:
- ✅ `src/app/pages/auth/login/login.component.ts`
- ✅ `src/app/pages/auth/login/login.component.html`
- ✅ `src/app/pages/auth/login/login.component.css`
- ✅ `src/app/pages/auth/acceso-denegado/acceso-denegado.component.ts`
- ✅ `src/app/pages/auth/acceso-denegado/acceso-denegado.component.html`
- ✅ `src/app/pages/auth/acceso-denegado/acceso-denegado.component.css`

### Rutas:
- ✅ `src/app.routes.ts` - Actualizado con guards
- ✅ `src/app/pages/auth/auth.routes.ts` - Rutas de autenticación

### Layout:
- ✅ `src/app/layout/component/app.menu.ts` - Menú dinámico por roles

---

## 📦 INSTALACIÓN DE DEPENDENCIAS

Todas las dependencias de PrimeNG ya están instaladas en tu proyecto.
No necesitas instalar nada adicional.

---

## 🔧 CONFIGURACIÓN PASO A PASO

### PASO 1: Verificar que todos los archivos estén creados

Ejecuta este comando para verificar:

```bash
ls -la src/app/services/auth.service.ts
ls -la src/app/guards/auth.guard.ts
ls -la src/app/guards/role.guard.ts
ls -la src/app/pages/auth/login/login.component.ts
ls -la src/app/pages/auth/acceso-denegado/acceso-denegado.component.ts
```

### PASO 2: Actualizar el Topbar con información de usuario

El archivo `src/app/layout/component/app.topbar.ts` necesita ser actualizado para mostrar
la información del usuario logueado. 

**OPCIÓN A: Actualización Manual del Topbar**

Abre el archivo `src/app/layout/component/app.topbar.ts` y:

1. Importa el AuthService:
```typescript
import { AuthService, Usuario } from '../../services/auth.service';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
```

2. Agrega los imports en el decorador @Component:
```typescript
imports: [
    RouterModule, 
    CommonModule, 
    StyleClassModule, 
    AppConfigurator,
    AvatarModule,
    BadgeModule
],
```

3. En la clase del componente, agrega:
```typescript
authService = inject(AuthService);
usuario: Usuario | null = null;

ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
}

getIniciales(): string {
    return this.authService.getIniciales();
}
```

4. En el template HTML (dentro del `<div class="layout-topbar-menu">`), reemplaza el contenido con:
```html
<div class="layout-topbar-menu-content">
    @if (usuario) {
        <button type="button" class="layout-topbar-action">
            <i class="pi pi-user"></i>
            <span>{{ usuario.nombre }} {{ usuario.apellido }}</span>
            <span class="ml-2 text-xs">({{ usuario.rol }})</span>
        </button>
        <button type="button" class="layout-topbar-action" (click)="authService.logout()">
            <i class="pi pi-sign-out"></i>
            <span>Cerrar Sesión</span>
        </button>
    } @else {
        <button type="button" class="layout-topbar-action" routerLink="/auth/login">
            <i class="pi pi-sign-in"></i>
            <span>Iniciar Sesión</span>
        </button>
    }
</div>
```

**OPCIÓN B: Topbar Simplificado** (Si la Opción A es muy compleja)

Si tienes problemas, simplemente agrega un botón de logout en el menú lateral.
El menú ya está actualizado y tiene la opción de "Cerrar Sesión".

### PASO 3: Compilar y ejecutar

```bash
cd /Users/jorgeynoelcurioso/sakai-ng
npm start
```

O si prefieres:

```bash
ng serve
```

### PASO 4: Abrir en el navegador

```
http://localhost:4200
```

---

## 🧪 PRUEBAS DEL SISTEMA

### TEST 1: Login como Administrador

1. Abre `http://localhost:4200`
2. Serás redirigido a `http://localhost:4200/auth/login`
3. Ingresa:
   - **Usuario:** `admin`
   - **Contraseña:** `admin123`
4. Click en "Iniciar Sesión"
5. ✅ Deberías ver:
   - Mensaje de bienvenida
   - Redirección al dashboard
   - Menú completo con TODAS las opciones
   - Badge "ADMIN" en las opciones exclusivas

### TEST 2: Verificar acceso de Admin

1. Estando logueado como admin, navega a:
   - `/panel-de-control-principal` ✅ Debe permitir acceso
   - `/registro-de-riesgos` ✅ Debe permitir acceso
   - `/gestion-de-usuarios` ✅ Debe permitir acceso
   - `/configuracion-del-sistema` ✅ Debe permitir acceso
   - `/reportes-y-analisis` ✅ Debe permitir acceso

### TEST 3: Cerrar sesión

1. En el menú lateral, busca la sección "Usuario"
2. Click en "Cerrar Sesión"
3. ✅ Deberías ser redirigido al login

### TEST 4: Login como Usuario Normal

1. En el login, ingresa:
   - **Usuario:** `usuario`
   - **Contraseña:** `user123`
2. Click en "Iniciar Sesión"
3. ✅ Deberías ver:
   - Mensaje de bienvenida
   - Menú limitado (solo "Mi Espacio")
   - NO ver opciones de admin

### TEST 5: Intentar acceso no autorizado

1. Estando logueado como usuario normal, intenta acceder a:
   ```
   http://localhost:4200/panel-de-control-principal
   ```
2. ✅ Deberías ser redirigido a:
   ```
   http://localhost:4200/auth/acceso-denegado
   ```
3. ✅ Verás un mensaje claro de "Acceso Denegado"

### TEST 6: Acceso directo sin login

1. Cierra sesión
2. Intenta acceder directamente a:
   ```
   http://localhost:4200/dashboard
   ```
3. ✅ Deberías ser redirigido al login

---

## 🔍 VERIFICACIÓN DEL MENÚ DINÁMICO

### Menú para ADMIN:
```
📊 Administración
  ├─ Panel de Control Principal [ADMIN]
  ├─ Matriz de Riesgos
  ├─ Registro de Riesgos [ADMIN]
  ├─ Gestión de Proyectos
  ├─ Gestión de Usuarios [ADMIN]
  ├─ Reportes y Análisis [ADMIN]
  └─ Configuración del Sistema [ADMIN]

🔧 Herramientas
  ├─ Subir Archivos
  └─ Documentación

👤 Usuario
  ├─ [Nombre del Usuario] (ADMIN)
  ├─ Mi Perfil
  └─ Cerrar Sesión
```

### Menú para USUARIO:
```
🏠 Mi Espacio
  ├─ Dashboard
  ├─ Gestión de Proyectos (Vista)
  └─ Subir Archivos

🔧 Herramientas
  ├─ Subir Archivos
  └─ Documentación

👤 Usuario
  ├─ [Nombre del Usuario] (USUARIO)
  ├─ Mi Perfil
  └─ Cerrar Sesión
```

---

## ❌ SOLUCIÓN DE PROBLEMAS

### Problema 1: Error de compilación en auth.service.ts

**Síntoma:** Error de tipo o compilación
**Solución:** 
1. Verifica que el archivo esté en la ruta correcta
2. Reinicia el servidor de desarrollo: `Ctrl+C` y luego `npm start`

### Problema 2: Rutas no protegidas

**Síntoma:** Puedo acceder sin login
**Solución:**
1. Verifica que `app.routes.ts` tenga `canActivate: [authGuard]` en el layout principal
2. Limpia el localStorage: `localStorage.clear()` en la consola del navegador
3. Recarga la página

### Problema 3: Menú no se actualiza después del login

**Síntoma:** El menú sigue vacío o con opciones incorrectas
**Solución:**
1. Verifica que `app.menu.ts` importa correctamente `AuthService`
2. Agrega un console.log en `generateMenu()` para debug:
```typescript
private generateMenu(): void {
    const usuario = this.authService.getUsuario();
    console.log('Usuario actual:', usuario);
    // ... resto del código
}
```

### Problema 4: No se redirige al login

**Síntoma:** Se queda en página en blanco
**Solución:**
1. Verifica la ruta del login en auth.routes.ts
2. Asegúrate que la ruta es `/auth/login` no `/login`

### Problema 5: Error "Cannot find module '@/app/layout/service/layout.service'"

**Síntoma:** Error de import con `@/app`
**Solución:**
El alias `@` está configurado en tu tsconfig. Si hay problemas, usa rutas relativas:
```typescript
import { LayoutService } from '../service/layout.service';
```

### Problema 6: Usuario queda logueado después de cerrar el navegador

**Síntoma:** Al abrir de nuevo, sigue logueado
**Comportamiento:** Esto es NORMAL. El sistema guarda la sesión en localStorage.
**Si quieres cambiarlo:** Modifica `auth.service.ts` para usar sessionStorage en lugar de localStorage.

---

## 🎯 USUARIOS DE PRUEBA

### Administrador:
- **Usuario:** `admin`
- **Contraseña:** `admin123`
- **Acceso:** Completo a todas las funcionalidades

### Usuario Normal:
- **Usuario:** `usuario`
- **Contraseña:** `user123`
- **Acceso:** Limitado (solo dashboard y proyectos en modo lectura)

---

## 🔐 SEGURIDAD - IMPORTANTE

⚠️ **ESTE SISTEMA ES SOLO PARA DESARROLLO**

En PRODUCCIÓN debes:

1. **Conectar a un backend real:**
   - Eliminar usuarios hardcodeados del `auth.service.ts`
   - Implementar llamadas HTTP a tu API
   - Usar JWT tokens reales

2. **Ejemplo de conexión a backend:**
```typescript
// En auth.service.ts
login(username: string, password: string): Observable<boolean> {
    return this.http.post<{token: string, user: Usuario}>('/api/auth/login', 
        { username, password }
    ).pipe(
        map(response => {
            localStorage.setItem('token', response.token);
            this.usuarioActualSignal.set(response.user);
            return true;
        }),
        catchError(() => of(false))
    );
}
```

3. **Agregar interceptor HTTP para el token:**
```typescript
// auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('token');
    if (token) {
        req = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
        });
    }
    return next(req);
};
```

---

## 📞 SOPORTE

Si tienes problemas:

1. Revisa la consola del navegador (F12) para ver errores
2. Revisa la terminal donde corre `ng serve` para errores de compilación
3. Verifica que todos los archivos estén en las rutas correctas
4. Limpia la caché: `npm clean cache --force` y reinstala: `npm install`

---

## 🎉 CARACTERÍSTICAS IMPLEMENTADAS

✅ Login funcional con validación
✅ Dos usuarios de prueba (admin y usuario)
✅ Guards de autenticación
✅ Guards de roles
✅ Menú dinámico según rol
✅ Página de acceso denegado
✅ Logout funcional
✅ Persistencia de sesión en localStorage
✅ Mensajes de error y éxito con Toast
✅ Diseño responsive con PrimeNG
✅ Animaciones y transiciones suaves
✅ Badges visuales para roles
✅ Protección de rutas por rol

---

## 🚀 PRÓXIMOS PASOS (Opcional)

Si quieres mejorar el sistema:

1. **Agregar "Recordar contraseña"**
2. **Crear página de registro**
3. **Implementar cambio de contraseña**
4. **Agregar perfil de usuario editable**
5. **Conectar a backend real**
6. **Agregar más roles (MODERADOR, SUPERVISOR, etc.)**
7. **Implementar refresh token**
8. **Agregar log de actividad del usuario**

---

## 📝 NOTAS FINALES

- El sistema usa **Signals de Angular** para reactividad
- Compatible con **Angular 17+**
- Usa **standalone components** (sin NgModule)
- Integrado con el template **SAKAI de PrimeNG**
- Código completamente comentado y documentado

---

**¡Sistema de autenticación completado! 🎊**

Desarrollado para SAKAI Angular
Fecha: 2 de febrero de 2026
