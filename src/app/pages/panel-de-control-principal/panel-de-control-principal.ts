import { Component } from '@angular/core';
import { PanelDeControlPrincipalWidget } from './components/panel-de-control-principal-widget';

@Component({
    selector: 'app-panel-de-control-principal',
    standalone: true,
    imports: [PanelDeControlPrincipalWidget],
    template: `
        <div class="p-6">
            <app-panel-de-control-principal-widget></app-panel-de-control-principal-widget>
        </div>
    `
})
export class PanelDeControlPrincipal {}