import { Component, inject, computed } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '@/app/layout/service/layout.service';
import { AuthService } from '@/app/services/auth.service';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { ConfiguracionService } from '@/app/services/configuracion.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, AvatarModule, MenuModule, BadgeModule],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
                <svg viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <!-- ...SVG CODE... -->
                </svg>
                <img *ngIf="logo" [src]="logo" alt="Logo" style="height:40px;vertical-align:middle;margin-right:8px;border-radius:6px;" />
                <span>{{ nombreSistema }}</span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
                <div class="relative">
                    <button
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <app-configurator />
                </div>
            </div>

            <!-- Usuario Autenticado -->
            @if (usuario()) {
                <div class="relative">
                    <button
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                        type="button"
                    >
                        <p-avatar 
                            [label]="usuario()!.nombre.charAt(0) + usuario()!.apellido.charAt(0)" 
                            shape="circle" 
                            [style]="{'background-color': usuario()!.rol === 'ADMIN' ? '#ef4444' : '#3b82f6', 'color': '#ffffff', 'width': '2.5rem', 'height': '2.5rem'}"
                        />
                        <span class="ml-2 font-medium hidden lg:inline-block">{{ usuario()!.nombre }}</span>
                    </button>
                    <div class="hidden absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                        <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                            <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ usuario()!.nombre }} {{ usuario()!.apellido }}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">{{ usuario()!.email }}</p>
                            <span 
                                class="inline-block mt-1 px-2 py-1 text-xs font-medium rounded"
                                [class.bg-red-100]="usuario()!.rol === 'ADMIN'"
                                [class.text-red-800]="usuario()!.rol === 'ADMIN'"
                                [class.bg-blue-100]="usuario()!.rol === 'USUARIO'"
                                [class.text-blue-800]="usuario()!.rol === 'USUARIO'"
                            >
                                {{ usuario()!.rol === 'ADMIN' ? 'Administrador' : 'Usuario' }}
                            </span>
                        </div>
                        <div class="py-1">
                            @if (isAdmin()) {
                                <a 
                                    routerLink="/gestion-de-usuarios" 
                                    class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <i class="pi pi-user-edit mr-2"></i>
                                    Mi Perfil
                                </a>
                                <a 
                                    routerLink="/configuracion-del-sistema" 
                                    class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <i class="pi pi-cog mr-2"></i>
                                    Configuración
                                </a>
                            }
                            <button 
                                (click)="cerrarSesion()"
                                class="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <i class="pi pi-sign-out mr-2"></i>
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div>
    </div>`
})
export class AppTopbar {
    items!: MenuItem[];

    layoutService = inject(LayoutService);
    authService = inject(AuthService);
    router = inject(Router);
    nombreSistema: string = 'Quality & Knowledge';
    logo: string | null = null;
    constructor(private configuracionService: ConfiguracionService) {
        this.configuracionService.nombreSistema$.subscribe(nombre => {
            this.nombreSistema = nombre;
        });
        this.configuracionService.logo$.subscribe(logo => {
            this.logo = logo;
        });
        this.configuracionService.colorPrincipal$.subscribe(color => {
            document.documentElement.style.setProperty('--color-principal', color);
        });
    }

    // Computed signals para reactividad
    usuario = computed(() => this.authService.getUsuario());
    isAdmin = computed(() => this.authService.isAdmin());

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme
        }));
    }

    cerrarSesion() {
        this.authService.logout();
    }
}
