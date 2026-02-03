import { Component } from '@angular/core';
import { GestionDeUsuariosWidget } from './components/gestion-de-usuarios-widget';

@Component({
    selector: 'app-gestion-de-usuarios',
    standalone: true,
    imports: [GestionDeUsuariosWidget],
    template: `
        <div class="p-6">
            <app-gestion-de-usuarios-widget></app-gestion-de-usuarios-widget>
        </div>
    `
})
export class GestionDeUsuarios {}
