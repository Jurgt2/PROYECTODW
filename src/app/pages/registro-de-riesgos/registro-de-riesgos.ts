import { Component } from '@angular/core';
import { RegistroDeRiesgosWidget } from './components/registro-de-riesgos-widget';

@Component({
    selector: 'app-registro-de-riesgos',
    standalone: true,
    imports: [RegistroDeRiesgosWidget],
    template: `
        <div class="p-6">
            <app-registro-de-riesgos-widget></app-registro-de-riesgos-widget>
        </div>
    `
})
export class RegistroDeRiesgos {}
