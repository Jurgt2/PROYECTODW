import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { SubirArchivosComponent } from './app/pages/subir-archivos/subir-archivos.component';
import { RegistroDeRiesgos } from './app/pages/registro-de-riesgos/registro-de-riesgos';
import { GestionDeUsuarios } from './app/pages/gestion-de-usuarios/gestion-de-usuarios';
import { ReportesYAnalisis } from './app/pages/reportes-y-analisis/reportes-y-analisis';
import { ConfiguracionDelSistema } from './app/pages/configuracion-del-sistema/configuracion-del-sistema';

// Importar Guards de autenticación y roles
import { authGuard } from './app/guards/auth.guard';
import { adminGuard } from './app/guards/role.guard';


export const appRoutes: Routes = [
    // Redirección por defecto: si no hay sesión, ir a login
    {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full'
    },
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard], // Proteger todo el layout con autenticación
        children: [
            // ========== RUTAS ACCESIBLES PARA TODOS LOS USUARIOS ==========
            { 
                path: 'dashboard', 
                component: Dashboard,
                title: 'Dashboard - SAKAI'
            },
            { 
                path: 'subir-archivos', 
                component: SubirArchivosComponent,
                title: 'Subir Archivos - SAKAI'
            },
            { 
                path: 'zip', 
                component: SubirArchivosComponent,
                title: 'Subir Archivos - SAKAI'
            },
            { 
                path: 'gestion-de-proyectos',
                loadComponent: () => 
                    import('./app/pages/gestion-de-proyectos/components/gestion-de-proyectos-widget')
                        .then(m => m.GestionDeProyectosWidget),
                title: 'Gestión de Proyectos - SAKAI'
            },
            // ========== RUTAS SOLO PARA ADMINISTRADOR ==========
            { 
                path: 'panel-de-control-principal',
                loadComponent: () => 
                    import('./app/pages/panel-de-control-principal/components/panel-de-control-principal-widget')
                        .then(m => m.PanelDeControlPrincipalWidget),
                canActivate: [adminGuard], // Solo ADMIN
                title: 'Panel de Control - SAKAI'
            },
            { 
                path: 'registro-de-riesgos', 
                component: RegistroDeRiesgos,
                canActivate: [adminGuard], // Solo ADMIN
                title: 'Registro de Riesgos - SAKAI'
            },
            { 
                path: 'gestion-de-usuarios', 
                component: GestionDeUsuarios,
                canActivate: [adminGuard], // Solo ADMIN
                title: 'Gestión de Usuarios - SAKAI'
            },
            { 
                path: 'reportes-y-analisis', 
                component: ReportesYAnalisis,
                canActivate: [adminGuard], // Solo ADMIN
                title: 'Reportes y Análisis - SAKAI'
            },
            { 
                path: 'configuracion-del-sistema', 
                component: ConfiguracionDelSistema,
                canActivate: [adminGuard], // Solo ADMIN
                title: 'Configuración del Sistema - SAKAI'
            },
            // ========== PÁGINAS ADICIONALES ==========
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    
    // ========== RUTAS DE AUTENTICACIÓN (SIN PROTECCIÓN) ==========
    { 
        path: 'auth', 
        loadChildren: () => import('./app/pages/auth/auth.routes'),
        title: 'Autenticación - SAKAI'
    },
    
    // ========== REDIRECCIÓN POR DEFECTO ==========
    { 
        path: '**', 
        redirectTo: '/dashboard' 
    }
];
