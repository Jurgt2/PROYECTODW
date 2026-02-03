import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, RouterModule, AppMenuitem],
    template: `<ul class="layout-menu">
        @for (item of model; track item.label) {
            <li app-menuitem [item]="item" [root]="true"></li>
        }
    </ul>`
})
export class AppMenuComponent implements OnInit, OnDestroy {
    model: MenuItem[] = [];
    private subscription: Subscription | undefined;

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.generateMenu();
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    private generateMenu(): void {
        const menuItems: MenuItem[] = [];
        const usuario = this.authService.getUsuario();

        menuItems.push({
            label: 'Dashboard',
            icon: 'pi pi-fw pi-home',
            routerLink: ['/dashboard']
        });

        if (usuario && usuario.rol === 'ADMIN') {
            menuItems.push({
                label: 'Administración',
                items: [
                    {
                        label: 'Panel de Control Principal',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/panel-de-control-principal']
                    },
                    {
                        label: 'Matriz de Riesgos',
                        icon: 'pi pi-fw pi-table',
                        routerLink: ['/matriz-de-riesgos']
                    },
                    {
                        label: 'Registro de Riesgos',
                        icon: 'pi pi-fw pi-list',
                        routerLink: ['/registro-de-riesgos'],
                        badge: 'ADMIN',
                        badgeClass: 'p-badge-danger'
                    },
                    {
                        label: 'Gestión de Proyectos',
                        icon: 'pi pi-fw pi-briefcase',
                        routerLink: ['/gestion-de-proyectos']
                    },
                    {
                        label: 'Gestión de Usuarios',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/gestion-de-usuarios'],
                        badge: 'ADMIN',
                        badgeClass: 'p-badge-danger'
                    },
                    {
                        label: 'Reportes y Análisis',
                        icon: 'pi pi-fw pi-chart-line',
                        routerLink: ['/reportes-y-analisis'],
                        badge: 'ADMIN',
                        badgeClass: 'p-badge-danger'
                    },
                    {
                        label: 'Configuración del Sistema',
                        icon: 'pi pi-fw pi-cog',
                        routerLink: ['/configuracion-del-sistema'],
                        badge: 'ADMIN',
                        badgeClass: 'p-badge-danger'
                    }
                ]
            });
        } else {
            menuItems.push({
                label: 'Mi Espacio',
                items: [
                    {
                        label: 'Gestión de Proyectos',
                        icon: 'pi pi-fw pi-briefcase',
                        routerLink: ['/gestion-de-proyectos'],
                        badge: 'Vista',
                        badgeClass: 'p-badge-info'
                    },
                    {
                        label: 'Subir Archivos',
                        icon: 'pi pi-fw pi-upload',
                        routerLink: ['/subir-archivos']
                    }
                ]
            });
        }

        menuItems.push({ separator: true });
        menuItems.push({
            label: 'Herramientas',
            items: [
                {
                    label: 'Subir Archivos',
                    icon: 'pi pi-fw pi-upload',
                    routerLink: ['/subir-archivos']
                }
            ]
        });

        if (usuario) {
            menuItems.push({ separator: true });
            menuItems.push({
                label: 'Usuario',
                items: [
                    {
                        label: 'Cerrar Sesión',
                        icon: 'pi pi-fw pi-sign-out',
                        command: () => this.authService.logout()
                    }
                ]
            });
        }

        this.model = menuItems;
    }

    public refreshMenu(): void {
        this.generateMenu();
    }
}
