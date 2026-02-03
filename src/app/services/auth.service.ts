import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UsuariosService } from '../pages/service/usuarios.service';
import { environment } from '../../environments/environment';

export interface Usuario {
  id?: number;  // Agregado el campo id
  username: string;
  nombre: string;
  apellido: string;
  rol: 'ADMIN' | 'USUARIO';
  email: string;
}

/**
 * Interfaz para la sesión almacenada
 */
interface Sesion {
  usuario: Usuario;
  token: string;
  recordarme: boolean;
}

/**
 * Servicio de autenticación para manejar login, logout y control de acceso
 * 
 * NOTA: Integrado con UsuariosService para autenticación con usuarios creados en la app.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  // Señal reactiva para el usuario actual
  private usuarioActualSignal = signal<Usuario | null>(null);
  
  // URL del backend
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private router: Router,
    private usuariosService: UsuariosService,
    private http: HttpClient  // AGREGADO
  ) {
    // Restaurar sesión si existe al iniciar el servicio
    this.restaurarSesion();
  }

  /**
   * Método para iniciar sesión
   * @param username Username
   * @param password Contraseña
   * @returns Observable que emite true si el login es exitoso, false en caso contrario
   */
  login(username: string, password: string): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        map(response => {
          // El backend devuelve: { token: "...", usuario: { id, username, role } }
          if (response && response.token) {
            // Crear sesión con los datos del backend
            const sesion: Sesion = {
              token: response.token,
              usuario: {
                id: response.usuario.id,
                username: response.usuario.username,
                nombre: response.usuario.username, // Temporal, si el backend no envía nombre
                apellido: '', // Temporal, si el backend no envía apellido
                rol: response.usuario.role, // El backend envía "role"
                email: response.usuario.email || '' // Si existe
              },
              recordarme: true
            };
            
            // Guardar en localStorage
            localStorage.setItem('sesion', JSON.stringify(sesion));
            
            // Actualizar señal del usuario actual
            this.usuarioActualSignal.set(sesion.usuario);
            
            console.log('✅ Login exitoso:', sesion.usuario);
            
            return true;
          }
          return false;
        }),
        catchError(error => {
          console.error('❌ Error en login:', error);
          return of(false);
        })
      );
  }

  /**
   * Método para cerrar sesión
   */
  logout(): void {
    // Limpiar localStorage
    localStorage.removeItem('sesion');
    
    // Limpiar señal reactiva
    this.usuarioActualSignal.set(null);
    
    console.log('👋 Sesión cerrada');
    
    // Redireccionar al login
    this.router.navigate(['/auth/login']);
  }

  /**
   * Verifica si el usuario está autenticado
   * @returns true si está autenticado, false en caso contrario
   */
  isAuthenticated(): boolean {
    return this.usuarioActualSignal() !== null;
  }

  /**
   * Obtiene el usuario actual
   * @returns Usuario actual o null si no está autenticado
   */
  getUsuario(): Usuario | null {
    return this.usuarioActualSignal();
  }

  /**
   * Obtiene el rol del usuario actual
   * @returns Rol del usuario o null si no está autenticado
   */
  getRol(): 'ADMIN' | 'USUARIO' | null {
    const usuario = this.usuarioActualSignal();
    return usuario ? usuario.rol : null;
  }

  /**
   * Verifica si el usuario tiene un rol específico
   * @param rol Rol a verificar
   * @returns true si el usuario tiene el rol, false en caso contrario
   */
  hasRole(rol: 'ADMIN' | 'USUARIO'): boolean {
    const rolActual = this.getRol();
    return rolActual === rol;
  }

  /**
   * Verifica si el usuario es administrador
   * @returns true si es administrador, false en caso contrario
   */
  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  /**
   * Obtiene el token de sesión
   * @returns Token de sesión o null
   */
  getToken(): string | null {
    const sesionStr = localStorage.getItem('sesion');
    if (sesionStr) {
      try {
        const sesion: Sesion = JSON.parse(sesionStr);
        return sesion.token;
      } catch (error) {
        console.error('Error al parsear sesión:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Obtiene las iniciales del usuario para el avatar
   * @returns Iniciales del usuario (ej: "AS" para Admin Sistema)
   */
  getIniciales(): string {
    const usuario = this.usuarioActualSignal();
    if (usuario) {
      const nombreInicial = usuario.nombre?.charAt(0) || '?';
      const apellidoInicial = usuario.apellido?.charAt(0) || '?';
      return `${nombreInicial}${apellidoInicial}`.toUpperCase();
    }
    return '??';
  }

  /**
   * Restaura la sesión desde localStorage
   * @private
   */
  private restaurarSesion(): void {
    const sesionStr = localStorage.getItem('sesion');
    
    if (sesionStr) {
      try {
        const sesion: Sesion = JSON.parse(sesionStr);
        this.usuarioActualSignal.set(sesion.usuario);
        console.log('✅ Sesión restaurada:', sesion.usuario.nombre);
      } catch (error) {
        console.error('Error al restaurar sesión:', error);
        localStorage.removeItem('sesion');
      }
    }
  }

  /**
   * Verifica si la sesión actual es válida
   * @returns true si la sesión es válida
   */
  validarSesion(): boolean {
    const token = this.getToken();
    return token !== null && this.isAuthenticated();
  }
}