import { Component } from '@angular/core';
import { ConfiguracionDelSistemaWidget } from './components/configuracion-del-sistema-widget';

@Component({
    selector: 'app-configuracion-del-sistema',
    standalone: true,
    imports: [ConfiguracionDelSistemaWidget],
    template: `
        <div class="p-6">
            <app-configuracion-del-sistema-widget></app-configuracion-del-sistema-widget>
        </div>
    `
})
export class ConfiguracionDelSistema {}
