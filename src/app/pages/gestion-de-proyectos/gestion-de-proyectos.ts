import { Component } from '@angular/core';
import { GestionDeProyectosWidget } from './components/gestion-de-proyectos-widget.component';

@Component({
    selector: 'app-gestion-de-proyectos',
    standalone: true,
    imports: [GestionDeProyectosWidget],
    template: `
        <app-gestion-de-proyectos-widget></app-gestion-de-proyectos-widget>
    `
})
export class GestionDeProyectos {}