import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';

// Servicio de autenticación
import { AuthService, Usuario } from '../../../services/auth.service';

/**
 * Componente de Acceso Denegado
 * 
 * Se muestra cuando un usuario intenta acceder a una página
 * para la cual no tiene permisos según su rol.
 */
@Component({
  selector: 'app-acceso-denegado',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    CardModule,
    RippleModule
  ],
  templateUrl: './acceso-denegado.component.html',
  styleUrl: './acceso-denegado.component.css'
})
export class AccesoDenegadoComponent implements OnInit {
  
  usuario: Usuario | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener información del usuario actual
    this.usuario = this.authService.getUsuario();

    // Si no está autenticado, redirigir al login
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
    }
  }

  /**
   * Navega a la página de inicio
   */
  irAlInicio(): void {
    this.router.navigate(['/']);
  }

  /**
   * Vuelve a la página anterior
   */
  volver(): void {
    window.history.back();
  }

  /**
   * Cierra la sesión y redirige al login
   */
  cerrarSesion(): void {
    this.authService.logout();
  }
}
