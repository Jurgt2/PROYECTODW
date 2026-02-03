import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '@/app/layout/service/layout.service';
import { AuthService, Usuario } from '../../services/auth.service';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { MenuModule } from 'primeng/menu';

/**
 * Componente del Topbar con información de usuario autenticado
 */
@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [
        RouterModule, 
        CommonModule, 
        StyleClassModule, 
        AppConfigurator,
        AvatarModule,
        BadgeModule,
        MenuModule
    ],
    templateUrl: './app.topbar.html',
    styleUrls: ['./app.topbar.css']
})
export class AppTopbar implements OnInit {
    items!: MenuItem[];
    userMenuItems!: MenuItem[];
    usuario: Usuario | null = null;

    layoutService = inject(LayoutService);
    authService = inject(AuthService);

    ngOnInit(): void {
        // Obtener usuario actual
        this.usuario = this.authService.getUsuario();
        
        // Configurar menú de usuario
        this.setupUserMenu();
    }

    /**
     * Configura el menú desplegable del usuario
     */
    private setupUserMenu(): void {
        this.userMenuItems = [
            {
                label: 'Mi Cuenta',
                items: [
                    {
                        label: 'Ver Perfil',
                        icon: 'pi pi-user',
                        command: () => {
                            console.log('Ir a perfil');
                        }
                    },
                    {
                        label: 'Configuración',
                        icon: 'pi pi-cog',
                        command: () => {
                            console.log('Ir a configuración');
                        }
                    }
                ]
            },
            {
                separator: true
            },
            {
                label: 'Sesión',
                items: [
                    {
                        label: 'Cerrar Sesión',
                        icon: 'pi pi-sign-out',
                        command: () => {
                            this.authService.logout();
                        }
                    }
                ]
            }
        ];
    }

    /**
     * Obtiene las iniciales del usuario
     */
    getIniciales(): string {
        return this.authService.getIniciales();
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme
        }));
    }
}
