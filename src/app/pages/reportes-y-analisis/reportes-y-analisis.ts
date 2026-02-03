import { Component } from '@angular/core';
import { ReportesYAnalisisWidget } from './components/reportes-y-analisis-widget.component';

@Component({
    selector: 'app-reportes-y-analisis',
    standalone: true,
    imports: [ReportesYAnalisisWidget],
    template: `
        <app-reportes-y-analisis-widget></app-reportes-y-analisis-widget>
    `
})
export class ReportesYAnalisis {}