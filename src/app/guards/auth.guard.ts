import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard de autenticación para proteger rutas
 * 
 * Este guard verifica si el usuario está autenticado antes de permitir
 * el acceso a una ruta. Si no está autenticado, redirige al login.
 * 
 * Uso en las rutas:
 * ```typescript
 * {
 *   path: 'dashboard',
 *   component: DashboardComponent,
 *   canActivate: [authGuard]
 * }
 * ```
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si el usuario está autenticado
  if (authService.isAuthenticated()) {
    console.log('✅ AuthGuard: Usuario autenticado, acceso permitido');
    return true;
  }

  // Si no está autenticado, guardar la URL a la que intentaba acceder
  // para redirigirlo después del login
  console.warn('⚠️ AuthGuard: Usuario no autenticado, redirigiendo al login');
  
  // Redireccionar al login con la URL de retorno
  router.navigate(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });

  return false;
};

/**
 * Guard alternativo usando clase (por si prefieres este enfoque)
 * 
 * Uso:
 * ```typescript
 * import { AuthGuardClass } from './guards/auth.guard';
 * 
 * providers: [AuthGuardClass]
 * 
 * // En las rutas:
 * canActivate: [AuthGuardClass]
 * ```
 */
/*
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardClass implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });

    return false;
  }
}
*/
