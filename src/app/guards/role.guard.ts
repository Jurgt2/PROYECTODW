import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard de roles para proteger rutas según el rol del usuario
 * 
 * Este guard verifica si el usuario tiene el rol necesario para acceder
 * a una ruta específica. Si no tiene el rol, redirige a "acceso-denegado".
 * 
 * Uso en las rutas:
 * ```typescript
 * {
 *   path: 'admin/panel',
 *   component: PanelComponent,
 *   canActivate: [authGuard, roleGuard],
 *   data: { roles: ['ADMIN'] }
 * }
 * ```
 * 
 * IMPORTANTE: Este guard debe usarse JUNTO con authGuard
 * El authGuard verifica la autenticación, este verifica el rol.
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar primero si está autenticado
  if (!authService.isAuthenticated()) {
    console.warn('⚠️ RoleGuard: Usuario no autenticado');
    router.navigate(['/auth/login']);
    return false;
  }

  // Obtener los roles permitidos desde la configuración de la ruta
  const rolesPermitidos = route.data['roles'] as Array<'ADMIN' | 'USUARIO'>;
  
  // Si no hay roles definidos en la ruta, permitir acceso
  if (!rolesPermitidos || rolesPermitidos.length === 0) {
    console.warn('⚠️ RoleGuard: No hay roles definidos en la ruta, permitiendo acceso');
    return true;
  }

  // Obtener el rol del usuario actual
  const rolUsuario = authService.getRol();

  // Verificar si el usuario tiene uno de los roles permitidos
  if (rolUsuario && rolesPermitidos.includes(rolUsuario)) {
    console.log(`✅ RoleGuard: Usuario tiene rol ${rolUsuario}, acceso permitido`);
    return true;
  }

  // Si no tiene el rol necesario, redirigir a acceso denegado
  console.error(
    `❌ RoleGuard: Usuario con rol ${rolUsuario} no tiene permiso. Roles requeridos: ${rolesPermitidos.join(', ')}`
  );
  
  router.navigate(['/auth/acceso-denegado']);
  return false;
};

/**
 * Guard específico solo para administradores
 * 
 * Este es un atajo para rutas que solo deben ser accesibles por ADMIN
 * 
 * Uso en las rutas:
 * ```typescript
 * {
 *   path: 'admin/usuarios',
 *   component: UsuariosComponent,
 *   canActivate: [authGuard, adminGuard]
 * }
 * ```
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si está autenticado
  if (!authService.isAuthenticated()) {
    console.warn('⚠️ AdminGuard: Usuario no autenticado');
    router.navigate(['/auth/login']);
    return false;
  }

  // Verificar si es administrador
  if (authService.isAdmin()) {
    console.log('✅ AdminGuard: Usuario es ADMIN, acceso permitido');
    return true;
  }

  // Si no es admin, redirigir a acceso denegado
  console.error('❌ AdminGuard: Usuario no es ADMIN, acceso denegado');
  router.navigate(['/auth/acceso-denegado']);
  return false;
};

/**
 * Guard alternativo usando clase (por si prefieres este enfoque)
 * 
 * Uso:
 * ```typescript
 * import { RoleGuardClass } from './guards/role.guard';
 * 
 * providers: [RoleGuardClass]
 * 
 * // En las rutas:
 * canActivate: [RoleGuardClass]
 * data: { roles: ['ADMIN'] }
 * ```
 */
/*
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardClass implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    const rolesPermitidos = route.data['roles'] as Array<'ADMIN' | 'USUARIO'>;
    const rolUsuario = this.authService.getRol();

    if (!rolesPermitidos || rolesPermitidos.length === 0) {
      return true;
    }

    if (rolUsuario && rolesPermitidos.includes(rolUsuario)) {
      return true;
    }

    this.router.navigate(['/auth/acceso-denegado']);
    return false;
  }
}
*/
