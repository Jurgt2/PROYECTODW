import { Routes } from '@angular/router';
import { ReportesYAnalisisWidget } from './reportes-y-analisis/components/reportes-y-analisis-widget.component';
import { PanelDeControlPrincipalWidget } from './panel-de-control-principal/components/panel-de-control-principal-widget';
import { RegistroDeRiesgosWidget } from './registro-de-riesgos/components/registro-de-riesgos-widget';
import { GestionDeProyectosWidget } from './gestion-de-proyectos/components/gestion-de-proyectos-widget';
import { GestionDeUsuariosWidget } from './gestion-de-usuarios/components/gestion-de-usuarios-widget';
import { ConfiguracionDelSistemaWidget } from './configuracion-del-sistema/components/configuracion-del-sistema-widget';
import { roleGuard } from '../guards/role.guard';

export default [
    { path: 'panel-de-control-principal', component: PanelDeControlPrincipalWidget, canActivate: [roleGuard], data: { roles: ['ADMIN'] } },
    { path: 'registro-de-riesgos', component: RegistroDeRiesgosWidget, canActivate: [roleGuard], data: { roles: ['ADMIN'] } },
    { path: 'gestion-de-proyectos', component: GestionDeProyectosWidget, canActivate: [roleGuard], data: { roles: ['ADMIN'] } },
    { path: 'gestion-de-usuarios', component: GestionDeUsuariosWidget, canActivate: [roleGuard], data: { roles: ['ADMIN'] } },
    { path: 'configuracion-del-sistema', component: ConfiguracionDelSistemaWidget, canActivate: [roleGuard], data: { roles: ['ADMIN'] } },
    { path: 'reportes-y-analisis', component: ReportesYAnalisisWidget, canActivate: [roleGuard], data: { roles: ['ADMIN'] } },
    { path: '**', redirectTo: '/dashboard' }
] as Routes;
