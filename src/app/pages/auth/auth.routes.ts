import { Routes } from '@angular/router';
import { Access } from './access';
import { Error } from './error';

// Importar los nuevos componentes de autenticación
import { LoginComponent } from './login/login.component';
import { AccesoDenegadoComponent } from './acceso-denegado/acceso-denegado.component';

export default [
    // ========== RUTAS DE AUTENTICACIÓN CON SISTEMA DE ROLES ==========
    { 
        path: 'login', 
        component: LoginComponent,
        title: 'Iniciar Sesión - SAKAI'
    },
    { 
        path: 'acceso-denegado', 
        component: AccesoDenegadoComponent,
        title: 'Acceso Denegado - SAKAI'
    },
    
    // ========== RUTAS ANTIGUAS (Compatibilidad) ==========
    { path: 'access', component: Access },
    { path: 'error', component: Error }
] as Routes;
