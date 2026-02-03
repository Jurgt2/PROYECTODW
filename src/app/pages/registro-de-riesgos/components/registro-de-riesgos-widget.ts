import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { RiesgosService, Riesgo } from '../../service/riesgos.service';

@Component({
  standalone: true,
  selector: 'app-registro-de-riesgos-widget',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule, 
    TableModule, 
    TagModule, 
    InputTextModule, 
    SelectModule,
    ProgressBarModule,
    TooltipModule,
    DialogModule,
    DatePickerModule,
    InputNumberModule,
    TextareaModule
  ],
  template: `
    <div class="dashboard-container">
      <!-- Header -->
      <div class="header-section">
        <div>
          <h1>📋 Registro de Riesgos</h1>
          <p class="subtitle">Catálogo completo de riesgos identificados y su seguimiento</p>
        </div>
        <div class="header-actions">
          <button pButton icon="pi pi-plus" label="Nuevo Riesgo" class="p-button-success" (click)="crearNuevoRiesgo()"></button>
          <button pButton icon="pi pi-download" label="Exportar" class="p-button-outlined"></button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card stat-total">
          <div class="stat-icon"><i class="pi pi-list"></i></div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.total }}</div>
            <div class="stat-label">Total de Riesgos</div>
          </div>
        </div>
        
        <div class="stat-card stat-critical">
          <div class="stat-icon"><i class="pi pi-exclamation-circle"></i></div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.criticos }}</div>
            <div class="stat-label">Críticos</div>
          </div>
        </div>
        
        <div class="stat-card stat-high">
          <div class="stat-icon"><i class="pi pi-exclamation-triangle"></i></div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.altos }}</div>
            <div class="stat-label">Altos</div>
          </div>
        </div>
        
        <div class="stat-card stat-mitigated">
          <div class="stat-icon"><i class="pi pi-check-circle"></i></div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.mitigados }}</div>
            <div class="stat-label">Mitigados</div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <span class="p-input-icon-left">
          <i class="pi pi-search"></i>
          <input pInputText type="text" [(ngModel)]="filtroTexto" placeholder="Buscar riesgos..." 
                 (input)="aplicarFiltros()" class="search-input" />
        </span>
        
        <p-select [options]="opcionesNivel" [(ngModel)]="filtroNivel" placeholder="Todos los niveles"
                    (onChange)="aplicarFiltros()" [showClear]="true"></p-select>
        
        <p-select [options]="opcionesEstado" [(ngModel)]="filtroEstado" placeholder="Todos los estados"
                    (onChange)="aplicarFiltros()" [showClear]="true"></p-select>
        
        <p-select [options]="opcionesCategoria" [(ngModel)]="filtroCategoria" placeholder="Todas las categorías"
                    (onChange)="aplicarFiltros()" [showClear]="true"></p-select>
      </div>

      <!-- Table -->
      <div class="table-container">
        <p-table [value]="riesgosFiltrados" [paginator]="true" [rows]="10" 
                 [rowsPerPageOptions]="[10, 25, 50]" [tableStyle]="{ 'min-width': '100%' }"
                 styleClass="p-datatable-gridlines" dataKey="id">
          <ng-template pTemplate="header">
            <tr>
              <th style="width: 80px">ID</th>
              <th style="width: 100px">Tipo</th>
              <th style="width: 120px">ID Proyecto</th>
              <th style="width: 130px">Categoría</th>
              <th style="width: 300px">Descripción</th>
              <th style="width: 300px">Consecuencia</th>
              <th style="width: 150px">Identificado por</th>
              <th style="width: 140px">Fecha Registro</th>
              <th style="width: 130px">Nivel Impacto</th>
              <th style="width: 120px">Prob. %</th>
              <th style="width: 130px">Estrategia</th>
              <th style="width: 150px">Responsable</th>
              <th style="width: 140px">Fecha Límite</th>
              <th style="width: 120px">Estatus</th>
              <th style="width: 140px">Sig. Verificación</th>
              <th style="width: 150px">Acciones</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-riesgo let-ri="rowIndex">
            <tr>
              <!-- ID (No editable) -->
              <td><strong>{{ riesgo.id }}</strong></td>
              
              <!-- Tipo -->
              <td>
                <p-select *ngIf="isEditing(riesgo)" [(ngModel)]="riesgo.tipo" [options]="opcionesTipo" 
                          placeholder="Tipo" class="w-full"></p-select>
                <p-tag *ngIf="!isEditing(riesgo)" [value]="riesgo.tipo" [severity]="riesgo.tipo === 'Riesgo' ? 'danger' : 'success'"></p-tag>
              </td>
              
              <!-- ID Proyecto -->
              <td>
                <input *ngIf="isEditing(riesgo)" pInputText [(ngModel)]="riesgo.idProyecto" class="w-full" />
                <span *ngIf="!isEditing(riesgo)">{{ riesgo.idProyecto }}</span>
              </td>
              
              <!-- Categoría -->
              <td>
                <p-select *ngIf="isEditing(riesgo)" [(ngModel)]="riesgo.categoria" [options]="opcionesCategoria" 
                          placeholder="Categoría" class="w-full"></p-select>
                <p-tag *ngIf="!isEditing(riesgo)" [value]="riesgo.categoria" [severity]="getSeverityCategoria(riesgo.categoria)"></p-tag>
              </td>
              
              <!-- Descripción -->
              <td>
                <textarea *ngIf="isEditing(riesgo)" pTextarea [(ngModel)]="riesgo.descripcion" rows="2" class="w-full"></textarea>
                <div *ngIf="!isEditing(riesgo)" class="descripcion-cell" [pTooltip]="riesgo.descripcion" tooltipPosition="top">
                  {{ riesgo.descripcion | slice:0:40 }}{{ riesgo.descripcion.length > 40 ? '...' : '' }}
                </div>
              </td>
              
              <!-- Consecuencia -->
              <td>
                <textarea *ngIf="isEditing(riesgo)" pTextarea [(ngModel)]="riesgo.consecuencia" rows="2" class="w-full"></textarea>
                <div *ngIf="!isEditing(riesgo)" class="descripcion-cell" [pTooltip]="riesgo.consecuencia" tooltipPosition="top">
                  {{ riesgo.consecuencia | slice:0:35 }}{{ riesgo.consecuencia.length > 35 ? '...' : '' }}
                </div>
              </td>
              
              <!-- Identificado por -->
              <td>
                <input *ngIf="isEditing(riesgo)" pInputText [(ngModel)]="riesgo.identificadoPor" class="w-full" />
                <span *ngIf="!isEditing(riesgo)">{{ riesgo.identificadoPor }}</span>
              </td>
              
              <!-- Fecha Registro -->
              <td>
                <p-datepicker *ngIf="isEditing(riesgo)" [(ngModel)]="riesgo.fechaRegistro" dateFormat="dd/mm/yy" 
                              [showIcon]="true" class="w-full"></p-datepicker>
                <span *ngIf="!isEditing(riesgo)">{{ riesgo.fechaRegistro | date:'dd/MM/yyyy' }}</span>
              </td>
              
              <!-- Nivel Impacto -->
              <td>
                <p-select *ngIf="isEditing(riesgo)" [(ngModel)]="riesgo.nivelImpacto" [options]="opcionesImpacto" 
                          placeholder="Impacto" class="w-full"></p-select>
                <p-tag *ngIf="!isEditing(riesgo)" [value]="riesgo.nivelImpacto" [severity]="getSeverityImpacto(riesgo.nivelImpacto)"></p-tag>
              </td>
              
              <!-- Probabilidad % -->
              <td>
                <p-inputnumber *ngIf="isEditing(riesgo)" [(ngModel)]="riesgo.probabilidadOcurrencia" [min]="0" [max]="100" 
                               suffix="%" class="w-full"></p-inputnumber>
                <strong *ngIf="!isEditing(riesgo)">{{ riesgo.probabilidadOcurrencia }}%</strong>
              </td>
              
              <!-- Estrategia -->
              <td>
                <p-select *ngIf="isEditing(riesgo)" [(ngModel)]="riesgo.estrategiaRiesgo" [options]="opcionesEstrategia" 
                          placeholder="Estrategia" class="w-full"></p-select>
                <p-tag *ngIf="!isEditing(riesgo)" [value]="riesgo.estrategiaRiesgo" [severity]="getSeverityEstrategia(riesgo.estrategiaRiesgo)"></p-tag>
              </td>
              
              <!-- Responsable -->
              <td>
                <input *ngIf="isEditing(riesgo)" pInputText [(ngModel)]="riesgo.responsable" class="w-full" />
                <span *ngIf="!isEditing(riesgo)">{{ riesgo.responsable }}</span>
              </td>
              
              <!-- Fecha Límite -->
              <td>
                <p-datepicker *ngIf="isEditing(riesgo)" [(ngModel)]="riesgo.fechaLimite" dateFormat="dd/mm/yy" 
                              [showIcon]="true" class="w-full"></p-datepicker>
                <span *ngIf="!isEditing(riesgo)">{{ riesgo.fechaLimite | date:'dd/MM/yyyy' }}</span>
              </td>
              
              <!-- Estatus -->
              <td>
                <p-select *ngIf="isEditing(riesgo)" [(ngModel)]="riesgo.estatus" [options]="opcionesEstatus" 
                          placeholder="Estatus" class="w-full"></p-select>
                <p-tag *ngIf="!isEditing(riesgo)" [value]="riesgo.estatus" [severity]="getSeverityEstatus(riesgo.estatus)"></p-tag>
              </td>
              
              <!-- Siguiente Verificación -->
              <td>
                <p-datepicker *ngIf="isEditing(riesgo)" [(ngModel)]="riesgo.siguienteVerificacion" dateFormat="dd/mm/yy" 
                              [showIcon]="true" class="w-full"></p-datepicker>
                <span *ngIf="!isEditing(riesgo)">{{ riesgo.siguienteVerificacion | date:'dd/MM/yyyy' }}</span>
              </td>
              
              <!-- Acciones -->
              <td>
                <div class="action-buttons" *ngIf="!isEditing(riesgo)">
                  <button pButton icon="pi pi-pencil" class="p-button-text p-button-rounded p-button-warning" 
                          (click)="onRowEditInit(riesgo)" pTooltip="Editar"></button>
                  <button pButton icon="pi pi-eye" class="p-button-text p-button-rounded p-button-info" 
                          (click)="verDetalle(riesgo)" pTooltip="Ver detalle"></button>
                  <button pButton icon="pi pi-trash" class="p-button-text p-button-rounded p-button-danger" 
                          (click)="eliminarRiesgo(riesgo.id)" pTooltip="Eliminar"></button>
                </div>
                <div class="action-buttons" *ngIf="isEditing(riesgo)">
                  <button pButton icon="pi pi-check" class="p-button-text p-button-rounded p-button-success" 
                          (click)="onRowEditSave(riesgo)" pTooltip="Guardar"></button>
                  <button pButton icon="pi pi-times" class="p-button-text p-button-rounded p-button-danger" 
                          (click)="onRowEditCancel(riesgo, ri)" pTooltip="Cancelar"></button>
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="10" class="text-center">No se encontraron riesgos</td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <!-- Dialog Detalle -->
      <p-dialog [(visible)]="mostrarDetalle" [modal]="true" [style]="{width: '900px'}" 
                header="Detalle del Riesgo" [closable]="true">
        <div class="detalle-container" *ngIf="riesgoSeleccionado">
          
          <!-- Sección: Identificación -->
          <h3 class="seccion-titulo">📋 Identificación y Análisis</h3>
          <div class="detalle-grid">
            <div class="detalle-item">
              <label>ID:</label>
              <span>{{ riesgoSeleccionado.id }}</span>
            </div>
            <div class="detalle-item">
              <label>Tipo:</label>
              <p-tag [value]="riesgoSeleccionado.tipo" [severity]="riesgoSeleccionado.tipo === 'Riesgo' ? 'danger' : 'success'"></p-tag>
            </div>
            <div class="detalle-item">
              <label>ID de Proyecto:</label>
              <span>{{ riesgoSeleccionado.idProyecto }}</span>
            </div>
            <div class="detalle-item">
              <label>Categoría:</label>
              <p-tag [value]="riesgoSeleccionado.categoria" [severity]="getSeverityCategoria(riesgoSeleccionado.categoria)"></p-tag>
            </div>
            <div class="detalle-item full-width">
              <label>Descripción del Riesgo:</label>
              <span>{{ riesgoSeleccionado.descripcion }}</span>
            </div>
            <div class="detalle-item full-width">
              <label>Consecuencia:</label>
              <span>{{ riesgoSeleccionado.consecuencia }}</span>
            </div>
            <div class="detalle-item">
              <label>Identificado por:</label>
              <span>{{ riesgoSeleccionado.identificadoPor }}</span>
            </div>
            <div class="detalle-item">
              <label>Fecha de Registro:</label>
              <span>{{ riesgoSeleccionado.fechaRegistro | date:'dd/MM/yyyy' }}</span>
            </div>
            <div class="detalle-item">
              <label>Nivel de Impacto:</label>
              <p-tag [value]="riesgoSeleccionado.nivelImpacto" [severity]="getSeverityImpacto(riesgoSeleccionado.nivelImpacto)"></p-tag>
            </div>
            <div class="detalle-item">
              <label>Probabilidad de Ocurrencia:</label>
              <span><strong>{{ riesgoSeleccionado.probabilidadOcurrencia }}%</strong></span>
            </div>
            <div class="detalle-item full-width">
              <label>Evaluación de Riesgo:</label>
              <span>{{ riesgoSeleccionado.evaluacionRiesgo }}</span>
            </div>
          </div>

          <!-- Sección: Análisis Cualitativo -->
          <h3 class="seccion-titulo">🎯 Análisis Cualitativo</h3>
          <div class="detalle-grid">
            <div class="detalle-item">
              <label>Estrategia del Riesgo:</label>
              <p-tag [value]="riesgoSeleccionado.estrategiaRiesgo" [severity]="getSeverityEstrategia(riesgoSeleccionado.estrategiaRiesgo)"></p-tag>
            </div>
            <div class="detalle-item">
              <label>Nivel (Calculado):</label>
              <p-tag [value]="riesgoSeleccionado.nivel" [severity]="getSeverityNivel(riesgoSeleccionado.nivel)"></p-tag>
            </div>
          </div>

          <!-- Sección: Monitoreo -->
          <h3 class="seccion-titulo">📊 Monitoreo de Riesgos</h3>
          <div class="detalle-grid">
            <div class="detalle-item full-width">
              <label>Respuesta al Riesgo:</label>
              <span>{{ riesgoSeleccionado.respuestaRiesgo }}</span>
            </div>
            <div class="detalle-item">
              <label>Responsable:</label>
              <span>{{ riesgoSeleccionado.responsable }}</span>
            </div>
            <div class="detalle-item">
              <label>Fecha Límite:</label>
              <span>{{ riesgoSeleccionado.fechaLimite | date:'dd/MM/yyyy' }}</span>
            </div>
            <div class="detalle-item">
              <label>Estatus:</label>
              <p-tag [value]="riesgoSeleccionado.estatus" [severity]="getSeverityEstatus(riesgoSeleccionado.estatus)"></p-tag>
            </div>
            <div class="detalle-item">
              <label>Siguiente Verificación:</label>
              <span>{{ riesgoSeleccionado.siguienteVerificacion | date:'dd/MM/yyyy' }}</span>
            </div>
            <div class="detalle-item">
              <label>Progreso:</label>
              <div class="progreso-detalle">
                <p-progressBar [value]="riesgoSeleccionado.progreso" [showValue]="true"></p-progressBar>
              </div>
            </div>
          </div>

          <!-- Sección: Historial -->
          <div class="historial-section">
            <h3>📜 Historial de Cambios</h3>
            <div class="historial-timeline">
              <div *ngFor="let evento of riesgoSeleccionado.historial" class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <div class="timeline-date">{{ evento.fecha | date:'dd/MM/yyyy HH:mm' }}</div>
                  <div class="timeline-text">{{ evento.accion }}</div>
                  <div class="timeline-user">{{ evento.usuario }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </p-dialog>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      background: #f8fafc;
      min-height: 100vh;
    }

    /* Header */
    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }

    .subtitle {
      color: #64748b;
      margin: 0.5rem 0 0 0;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    /* Stats */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 1.5rem;
      border-left: 4px solid;
    }

    .stat-total { border-left-color: #3b82f6; }
    .stat-critical { border-left-color: #ef4444; }
    .stat-high { border-left-color: #f59e0b; }
    .stat-mitigated { border-left-color: #10b981; }

    .stat-icon {
      font-size: 2.5rem;
      opacity: 0.3;
    }

    .stat-total .stat-icon { color: #3b82f6; }
    .stat-critical .stat-icon { color: #ef4444; }
    .stat-high .stat-icon { color: #f59e0b; }
    .stat-mitigated .stat-icon { color: #10b981; }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
    }

    .stat-label {
      color: #64748b;
      font-size: 0.875rem;
    }

    /* Filters */
    .filters-section {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      margin-bottom: 1.5rem;
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .search-input {
      width: 300px;
    }

    /* Table */
    .table-container {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .descripcion-cell {
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .progreso-cell {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .progreso-text {
      font-size: 0.875rem;
      color: #64748b;
      min-width: 40px;
    }

    .action-buttons {
      display: flex;
      gap: 0.25rem;
    }

    /* Dialog */
    .detalle-container {
      padding: 1rem;
    }

    .detalle-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .detalle-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .detalle-item.full-width {
      grid-column: 1 / -1;
    }

    .detalle-item label {
      font-weight: 600;
      color: #64748b;
      font-size: 0.875rem;
    }

    .detalle-item span {
      color: #1e293b;
    }

    /* Historial */
    .historial-section {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e5e7eb;
    }

    .historial-section h3 {
      margin: 0 0 1.5rem 0;
      color: #1e293b;
    }

    .historial-timeline {
      position: relative;
      padding-left: 2rem;
    }

    .timeline-item {
      position: relative;
      padding-bottom: 1.5rem;
      border-left: 2px solid #e5e7eb;
      padding-left: 1.5rem;
    }

    .timeline-item:last-child {
      border-left-color: transparent;
    }

    .timeline-marker {
      position: absolute;
      left: -6px;
      top: 0;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #3b82f6;
      border: 2px solid white;
    }

    .timeline-date {
      font-size: 0.75rem;
      color: #64748b;
      margin-bottom: 0.25rem;
    }

    .timeline-text {
      color: #1e293b;
      margin-bottom: 0.25rem;
    }

    .timeline-user {
      font-size: 0.875rem;
      color: #3b82f6;
    }
  `]
})
export class RegistroDeRiesgosWidget implements OnInit {
  riesgos: Riesgo[] = [];
  riesgosFiltrados: Riesgo[] = [];
  stats: any = {};
  
  filtroTexto: string = '';
  filtroNivel: string = '';
  filtroEstado: string = '';
  filtroCategoria: string = '';

  mostrarDetalle: boolean = false;
  riesgoSeleccionado: Riesgo | null = null;

  editingRows: { [key: string]: boolean } = {};
  clonedRiesgos: { [key: string]: Riesgo } = {};

  opcionesNivel = [
    { label: 'Crítico', value: 'Crítico' },
    { label: 'Alto', value: 'Alto' },
    { label: 'Medio', value: 'Medio' },
    { label: 'Bajo', value: 'Bajo' }
  ];

  opcionesEstado = [
    { label: 'Activo', value: 'Activo' },
    { label: 'Mitigado', value: 'Mitigado' },
    { label: 'En Revisión', value: 'En Revisión' },
    { label: 'Cerrado', value: 'Cerrado' }
  ];

  opcionesCategoria = [
    { label: 'Alcance', value: 'Alcance' },
    { label: 'Aplicaciones', value: 'Aplicaciones' },
    { label: 'Arquitectura', value: 'Arquitectura' },
    { label: 'Infraestructura', value: 'Infraestructura' },
    { label: 'Proveedores', value: 'Proveedores' },
    { label: 'Redes', value: 'Redes' },
    { label: 'Restricciones regulatorias', value: 'Restricciones regulatorias' },
    { label: 'Tiempo', value: 'Tiempo' },
    { label: 'Usuarios', value: 'Usuarios' }
  ];

  opcionesTipo = [
    { label: 'Riesgo', value: 'Riesgo' },
    { label: 'Oportunidad', value: 'Oportunidad' }
  ];

  opcionesImpacto = [
    { label: 'Muy Alto', value: 'Muy Alto' },
    { label: 'Alto', value: 'Alto' },
    { label: 'Medio', value: 'Medio' },
    { label: 'Bajo', value: 'Bajo' },
    { label: 'Muy Bajo', value: 'Muy Bajo' }
  ];

  opcionesEstrategia = [
    { label: 'Mitigar', value: 'Mitigar' },
    { label: 'Transferir', value: 'Transferir' },
    { label: 'Evitar', value: 'Evitar' },
    { label: 'Aceptar', value: 'Aceptar' }
  ];

  opcionesEstatus = [
    { label: 'Abierto', value: 'Abierto' },
    { label: 'En Proceso', value: 'En Proceso' },
    { label: 'Cerrado', value: 'Cerrado' },
    { label: 'Pendiente', value: 'Pendiente' }
  ];

  constructor(private riesgosService: RiesgosService) {}

  ngOnInit() {
    this.riesgosService.riesgos$.subscribe(riesgos => {
      this.riesgos = riesgos;
      this.aplicarFiltros();
      this.stats = this.riesgosService.getEstadisticas();
    });
  }

  aplicarFiltros() {
    this.riesgosFiltrados = this.riesgos.filter(riesgo => {
      const cumpleTexto = !this.filtroTexto || 
        riesgo.descripcion.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
        riesgo.id.toLowerCase().includes(this.filtroTexto.toLowerCase());
      
      const cumpleNivel = !this.filtroNivel || riesgo.nivel === this.filtroNivel;
      const cumpleEstado = !this.filtroEstado || riesgo.estado === this.filtroEstado;
      const cumpleCategoria = !this.filtroCategoria || riesgo.categoria === this.filtroCategoria;

      return cumpleTexto && cumpleNivel && cumpleEstado && cumpleCategoria;
    });
  }

  verDetalle(riesgo: Riesgo) {
    this.riesgoSeleccionado = riesgo;
    this.mostrarDetalle = true;
  }

  getSeverityNivel(nivel: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    const severities: any = {
      'Crítico': 'danger',
      'Alto': 'warn',
      'Medio': 'info',
      'Bajo': 'success'
    };
    return severities[nivel] || 'info';
  }

  getSeverityEstado(estado: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    const severities: any = {
      'Activo': 'warn',
      'Mitigado': 'success',
      'En Revisión': 'info',
      'Cerrado': 'secondary'
    };
    return severities[estado] || 'info';
  }

  getSeverityCategoria(categoria: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    const severities: any = {
      'Alcance': 'info',
      'Aplicaciones': 'contrast',
      'Arquitectura': 'secondary',
      'Infraestructura': 'warn',
      'Proveedores': 'success',
      'Redes': 'danger',
      'Restricciones regulatorias': 'warn',
      'Tiempo': 'info',
      'Usuarios': 'secondary'
    };
    return severities[categoria] || 'info';
  }

  getSeverityImpacto(impacto: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    const severities: any = {
      'Muy Alto': 'danger',
      'Alto': 'warn',
      'Medio': 'info',
      'Bajo': 'success',
      'Muy Bajo': 'secondary'
    };
    return severities[impacto] || 'info';
  }

  getSeverityEstrategia(estrategia: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    const severities: any = {
      'Mitigar': 'info',
      'Transferir': 'warn',
      'Evitar': 'danger',
      'Aceptar': 'success'
    };
    return severities[estrategia] || 'info';
  }

  getSeverityEstatus(estatus: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    const severities: any = {
      'Abierto': 'danger',
      'En Proceso': 'info',
      'Cerrado': 'success',
      'Pendiente': 'warn'
    };
    return severities[estatus] || 'info';
  }

  isEditing(riesgo: Riesgo): boolean {
    return this.editingRows[riesgo.id] === true;
  }

  onRowEditInit(riesgo: Riesgo) {
    this.clonedRiesgos[riesgo.id] = { ...riesgo };
    this.editingRows[riesgo.id] = true;
  }

  onRowEditSave(riesgo: Riesgo) {
    delete this.clonedRiesgos[riesgo.id];
    delete this.editingRows[riesgo.id];
    this.riesgosService.actualizarRiesgo(riesgo);
  }

  onRowEditCancel(riesgo: Riesgo, index: number) {
    const original = this.clonedRiesgos[riesgo.id];
    if (original) {
      this.riesgosFiltrados[index] = original;
      delete this.clonedRiesgos[riesgo.id];
      delete this.editingRows[riesgo.id];
    }
  }

  eliminarRiesgo(id: string) {
    if (confirm('¿Está seguro de que desea eliminar este riesgo?')) {
      this.riesgosService.eliminarRiesgo(id);
    }
  }

  crearNuevoRiesgo() {
    const nuevoId = `RISK-${String(this.riesgos.length + 1).padStart(3, '0')}`;
    const nuevoRiesgo: Riesgo = {
      id: nuevoId,
      tipo: 'Riesgo',
      idProyecto: 'PROJ-001',
      categoria: 'Alcance',
      descripcion: 'Nueva descripción del riesgo',
      consecuencia: 'Consecuencia del riesgo',
      identificadoPor: 'Usuario',
      fechaRegistro: new Date(),
      nivelImpacto: 'Medio',
      probabilidadOcurrencia: 50,
      evaluacionRiesgo: 'Evaluación pendiente',
      estrategiaRiesgo: 'Mitigar',
      respuestaRiesgo: 'Respuesta pendiente',
      responsable: 'Responsable',
  fechaLimite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      estatus: 'Abierto',
  siguienteVerificacion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      probabilidad: 'Media',
      impacto: 'Medio',
      nivel: 'Medio',
      estado: 'Activo',
      fechaIdentificacion: new Date(),
      proyecto: 'Proyecto Nuevo',
      accionesMitigacion: 'Acciones pendientes',
      progreso: 0,
      comentarios: [],
      historial: [{
        fecha: new Date(),
        accion: 'Riesgo creado',
        usuario: 'Usuario'
      }]
    };

    this.riesgos.unshift(nuevoRiesgo);
    this.aplicarFiltros();
    this.editingRows[nuevoRiesgo.id] = true;
    this.clonedRiesgos[nuevoRiesgo.id] = { ...nuevoRiesgo };
  }
}
