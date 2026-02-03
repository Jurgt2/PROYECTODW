/**
 * CÓDIGO DE EJEMPLO PARA ACTUALIZAR EL TOPBAR
 * 
 * Este archivo contiene el código necesario para actualizar el topbar
 * y mostrar la información del usuario logueado.
 * 
 * OPCIÓN 1: TOPBAR CON AVATAR Y MENÚ (Avanzado)
 * OPCIÓN 2: TOPBAR SIMPLE CON NOMBRE Y BOTÓN (Recomendado)
 */

// ===========================================================================
// OPCIÓN 1: TOPBAR AVANZADO CON AVATAR Y MENÚ DESPLEGABLE
// ===========================================================================

/*
PASO 1: Actualizar imports en app.topbar.ts

import { Component, inject, OnInit } from '@angular/core';
import { AuthService, Usuario } from '../../services/auth.service';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { MenuModule } from 'primeng/menu';

PASO 2: Agregar imports en el decorador @Component

imports: [
    RouterModule, 
    CommonModule, 
    StyleClassModule, 
    AppConfigurator,
    AvatarModule,
    BadgeModule,
    MenuModule
],

PASO 3: Agregar propiedades en la clase

export class AppTopbar implements OnInit {
    items!: MenuItem[];
    userMenuItems!: MenuItem[];
    usuario: Usuario | null = null;

    layoutService = inject(LayoutService);
    authService = inject(AuthService);

    ngOnInit(): void {
        this.usuario = this.authService.getUsuario();
        this.setupUserMenu();
    }

    private setupUserMenu(): void {
        this.userMenuItems = [
            {
                label: 'Mi Cuenta',
                items: [
                    {
                        label: 'Ver Perfil',
                        icon: 'pi pi-user',
                        command: () => console.log('Ir a perfil')
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
                        command: () => this.authService.logout()
                    }
                ]
            }
        ];
    }

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

PASO 4: Actualizar el template

Dentro de <div class="layout-topbar-menu-content">, reemplazar con:

@if (usuario) {
    <div style="display: flex; align-items: center; gap: 1rem;">
        <p-avatar 
            [label]="getIniciales()" 
            size="large"
            [style]="{'background-color': usuario.rol === 'ADMIN' ? '#ef4444' : '#3b82f6', 'color': '#ffffff'}"
        ></p-avatar>
        
        <div style="display: flex; flex-direction: column;">
            <span style="font-weight: 600;">{{ usuario.nombre }} {{ usuario.apellido }}</span>
            <span style="font-size: 0.85rem; color: var(--text-color-secondary);">{{ usuario.rol }}</span>
        </div>

        <button type="button" class="layout-topbar-action" (click)="authService.logout()">
            <i class="pi pi-sign-out"></i>
        </button>
    </div>
} @else {
    <button type="button" class="layout-topbar-action" routerLink="/auth/login">
        <i class="pi pi-sign-in"></i>
        <span>Login</span>
    </button>
}
*/

// ===========================================================================
// OPCIÓN 2: TOPBAR SIMPLE (MÁS FÁCIL Y RÁPIDO) ⭐ RECOMENDADO
// ===========================================================================

/*
PASO 1: Actualizar imports en app.topbar.ts

import { Component, inject, OnInit } from '@angular/core';
import { AuthService, Usuario } from '../../services/auth.service';

PASO 2: Agregar propiedad en la clase

export class AppTopbar implements OnInit {
    items!: MenuItem[];
    usuario: Usuario | null = null;

    layoutService = inject(LayoutService);
    authService = inject(AuthService);

    ngOnInit(): void {
        this.usuario = this.authService.getUsuario();
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme
        }));
    }
}

PASO 3: Actualizar el template

Dentro de <div class="layout-topbar-menu-content">, reemplazar con:

@if (usuario) {
    <button type="button" class="layout-topbar-action">
        <i class="pi pi-user"></i>
        <span>{{ usuario.nombre }}</span>
        <span class="ml-2 text-xs" 
              [style.color]="usuario.rol === 'ADMIN' ? '#ef4444' : '#3b82f6'">
            ({{ usuario.rol }})
        </span>
    </button>
    <button type="button" class="layout-topbar-action" (click)="authService.logout()">
        <i class="pi pi-sign-out"></i>
        <span>Salir</span>
    </button>
} @else {
    <button type="button" class="layout-topbar-action" routerLink="/auth/login">
        <i class="pi pi-sign-in"></i>
        <span>Login</span>
    </button>
}
*/

// ===========================================================================
// OPCIÓN 3: SIN MODIFICAR TOPBAR (MÁS SIMPLE)
// ===========================================================================

/*
Si no quieres modificar el topbar, NO HAGAS NADA.

El sistema ya funciona perfectamente porque:
- El menú lateral YA tiene la información del usuario
- El menú lateral YA tiene el botón "Cerrar Sesión"
- Todo el sistema de autenticación funciona

Solo tendrás el botón de logout en el menú lateral, no en el topbar.
Esto es completamente válido y funcional.
*/

// ===========================================================================
// SOLUCIÓN DE PROBLEMAS
// ===========================================================================

/*
PROBLEMA: Error al compilar después de modificar topbar

SOLUCIÓN 1: Restaurar archivo original
```bash
git checkout src/app/layout/component/app.topbar.ts
```

SOLUCIÓN 2: Usar OPCIÓN 3 (sin modificar topbar)
El sistema funciona perfectamente sin modificar el topbar.

SOLUCIÓN 3: Verificar imports
Asegúrate de que todos los imports estén correctos.
Si hay error con '@/app', usa '../' en su lugar.
*/

// ===========================================================================
// EJEMPLO DE CÓDIGO COMPLETO PARA TOPBAR SIMPLE
// ===========================================================================

/*
// app.topbar.ts (VERSIÓN SIMPLE COMPLETA)

import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '@/app/layout/service/layout.service';
import { AuthService, Usuario } from '../../services/auth.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator],
    template: `
        <div class="layout-topbar">
            <!-- Logo y botón de menú (mantener igual) -->
            <div class="layout-topbar-logo-container">
                <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                    <i class="pi pi-bars"></i>
                </button>
                <a class="layout-topbar-logo" routerLink="/">
                    <!-- SVG del logo (mantener igual) -->
                    <span>SAKAI</span>
                </a>
            </div>

            <!-- Acciones del topbar -->
            <div class="layout-topbar-actions">
                <!-- Botones de configuración (mantener igual) -->
                <div class="layout-config-menu">
                    <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                        <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                    </button>
                    <div class="relative">
                        <button class="layout-topbar-action layout-topbar-action-highlight" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                            <i class="pi pi-palette"></i>
                        </button>
                        <app-configurator />
                    </div>
                </div>

                <!-- Botón del menú mobile -->
                <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                    <i class="pi pi-ellipsis-v"></i>
                </button>

                <!-- AQUÍ ES DONDE MODIFICAS (MENÚ DE USUARIO) -->
                <div class="layout-topbar-menu hidden lg:block">
                    <div class="layout-topbar-menu-content">
                        @if (usuario) {
                            <button type="button" class="layout-topbar-action">
                                <i class="pi pi-user"></i>
                                <span>{{ usuario.nombre }}</span>
                                <span class="ml-2 text-xs" [style.color]="usuario.rol === 'ADMIN' ? '#ef4444' : '#3b82f6'">
                                    ({{ usuario.rol }})
                                </span>
                            </button>
                            <button type="button" class="layout-topbar-action" (click)="authService.logout()">
                                <i class="pi pi-sign-out"></i>
                                <span>Salir</span>
                            </button>
                        } @else {
                            <button type="button" class="layout-topbar-action" routerLink="/auth/login">
                                <i class="pi pi-sign-in"></i>
                                <span>Login</span>
                            </button>
                        }
                    </div>
                </div>
            </div>
        </div>
    `
})
export class AppTopbar implements OnInit {
    items!: MenuItem[];
    usuario: Usuario | null = null;

    layoutService = inject(LayoutService);
    authService = inject(AuthService);

    ngOnInit(): void {
        this.usuario = this.authService.getUsuario();
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme
        }));
    }
}
*/

export {}; // Hacer este archivo un módulo válido de TypeScript
