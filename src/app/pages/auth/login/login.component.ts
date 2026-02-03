import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';

// Servicio de autenticación
import { AuthService } from '../../../services/auth.service';

/**
 * Componente de Login
 * 
 * Pantalla de inicio de sesión con validación de formularios,
 * manejo de errores y conexión real con el backend
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    ToastModule,
    RippleModule
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  
  loginForm!: FormGroup;
  loading = false;
  returnUrl: string = '/';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // Si ya está autenticado, redirigir al dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }

    // Inicializar formulario con validaciones
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      recordarme: [false]
    });

    // Obtener la URL de retorno si existe
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  /**
   * Maneja el envío del formulario de login
   */
  onSubmit(): void {
    // Verificar si el formulario es válido
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      this.showError('Por favor completa todos los campos correctamente');
      return;
    }

    this.loading = true;

    const { username, password } = this.loginForm.value;

    // Llamar al servicio de autenticación (ahora devuelve Observable)
    this.authService.login(username, password).subscribe({
      next: (success) => {
        if (success) {
          const usuario = this.authService.getUsuario();
          
          // Mostrar mensaje de éxito
          this.showSuccess(
            `¡Bienvenido ${usuario?.nombre}!`,
            `Has iniciado sesión como ${usuario?.rol}`
          );

          // Redirigir después de un breve delay
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
            this.loading = false;
          }, 1000);
        } else {
          // Login fallido
          this.showError(
            'Usuario o contraseña incorrectos',
            'Por favor verifica tus credenciales'
          );
          this.loading = false;
        }
      },
      error: (error) => {
        // Error de conexión o del servidor
        this.showError(
          'Error de conexión',
          'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.'
        );
        console.error('❌ Error en login:', error);
        this.loading = false;
      }
    });
  }

  /**
   * Verifica si un campo tiene error y ha sido tocado
   */
  hasError(field: string, error: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.hasError(error) && control.touched);
  }

  /**
   * Obtiene el mensaje de error para un campo
   */
  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);
    
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    
    return '';
  }

  /**
   * Marca todos los campos del formulario como tocados
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Muestra mensaje de éxito
   */
  private showSuccess(summary: string, detail?: string): void {
    this.messageService.add({
      severity: 'success',
      summary,
      detail,
      life: 3000
    });
  }

  /**
   * Muestra mensaje de error
   */
  private showError(summary: string, detail?: string): void {
    this.messageService.add({
      severity: 'error',
      summary,
      detail,
      life: 5000
    });
  }

  /**
   * Muestra información de usuarios de prueba (solo para desarrollo)
   */
  mostrarUsuariosPrueba(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Usuarios de Prueba',
      detail: 'Ingresa con tu usuario y contraseña registrados en el backend',
      life: 8000,
      sticky: false
    });
  }
}