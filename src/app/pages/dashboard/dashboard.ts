import { Component } from '@angular/core';
import { RiskMatrixWidget } from './components/riskmatrixwidget';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [RiskMatrixWidget],
    template: `
        <div class="p-6">
            <app-risk-matrix-widget></app-risk-matrix-widget>
        </div>
    `
})
export class Dashboard {}