import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectModule } from 'primeng/select';

interface ChangeControl {
  version: string;
  fecha: string;
  descripcion: string;
  autor: string;
  aprobo: string;
}

interface Project {
  nombre: string;
  clave: string;
  responsable: string;
  fechaInicio: string;
  fechaFin: string;
}

interface RiskStats {
  totalRiesgos: number;
  criticos: number;
  mitigados: number;
  cambiosRecientes: number;
}

@Component({
  standalone: true,
  selector: 'app-risk-matrix-widget',
  imports: [ButtonModule, MenuModule, CommonModule, FormsModule, SelectModule],
  template: `
    <div class="risk-matrix-container">
      
      <div class="header-section">
        <div class="qk-badge">Q&K</div>
        <div class="title-section">
          <h1>MATRIZ DE RIESGOS Y CONTROL DE CAMBIOS</h1>
          <div class="subtitle">IDENTIFICACIÓN Y ANÁLISIS DE RIESGOS</div>
        </div>
        <div class="action-buttons">
          <button class="btn btn-save" (click)="saveData()">
            <i class="pi pi-save"></i> Guardar
          </button>
          <button class="btn btn-excel" (click)="exportExcel()">
            <i class="pi pi-file-excel"></i> Exportar Excel
          </button>
          <button class="btn btn-pdf" (click)="exportPDF()">
            <i class="pi pi-file-pdf"></i> Exportar PDF
          </button>
          <button class="btn btn-zip" (click)="goToUploadZip()">
            <i class="pi pi-upload"></i> Subir ZIP
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card stat-total">
          <div class="stat-header">
            <div class="stat-title">Total de Riesgos</div>
            <div class="stat-subtitle">Total identificados</div>
          </div>
          <div class="stat-value">{{ stats.totalRiesgos }}</div>
        </div>

        

        

        
      </div>

      <!-- Project Form -->
      <div class="project-form">
        <div class="form-row">
          <div class="form-group form-proyecto">
            <label class="form-label">Nombre del Proyecto/Aplicativo:</label>
            <input 
              type="text" 
              class="form-control" 
              [(ngModel)]="project.nombre"
              placeholder="Nombre del Proyecto"
            />
          </div>
          <div class="form-group form-clave">
            <label class="form-label">Clave del Proyecto (si aplica):</label>
            <input 
              type="text" 
              class="form-control" 
              [(ngModel)]="project.clave"
              placeholder="PRJ-001"
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group form-responsable">
            <label class="form-label">Última actualización:</label>
            <input 
              type="date" 
              class="form-control" 
              [(ngModel)]="project.responsable"
            />
          </div>
          <div class="form-group form-fechas">
            <label class="form-label">Fecha de creación:</label>
            <div class="date-range">
              <input 
                type="date" 
                class="form-control" 
                [(ngModel)]="project.fechaInicio"
              />
              <span class="date-separator">-</span>
              <input 
                type="date" 
                class="form-control" 
                [(ngModel)]="project.fechaFin"
              />
            </div>
          </div>
          
        </div>
        
        <!-- Botón Guardar y State -->
        <div class="form-actions">
          <div class="flex flex-wrap gap-2 w-full">
            <label for="state">State</label>
            <p-select id="state" [(ngModel)]="dropdownItem" [options]="dropdownItems" optionLabel="name" placeholder="Select One" class="w-full"></p-select>
          </div>
          <button class="btn btn-save" (click)="guardarProyecto()">
            <i class="pi pi-save"></i> Guardar
          </button>
        </div>
      </div>

      <!-- Change Control Table -->
      <div class="change-control-section">
        <div class="section-header">
          <h2>Control de Cambios</h2>
          <button class="btn btn-add" (click)="addNewChange()">
            <i class="pi pi-plus"></i> Agregar Fila
          </button>
        </div>

        <div class="table-container">
          <table class="change-table">
            <thead>
              <tr>
                <th>Versión</th>
                <th>Fecha</th>
                <th>Descripción</th>
                <th>Autor</th>
                <th>Aprobó</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let change of changes; let i = index">
                <td>
                  <input 
                    type="text" 
                    class="table-input" 
                    [(ngModel)]="change.version"
                    placeholder="1.0"
                  />
                </td>
                <td>
                  <input 
                    type="date" 
                    class="table-input" 
                    [(ngModel)]="change.fecha"
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    class="table-input table-input-wide" 
                    [(ngModel)]="change.descripcion"
                    placeholder="Descripción del cambio"
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    class="table-input" 
                    [(ngModel)]="change.autor"
                    placeholder="Nombre Autor"
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    class="table-input" 
                    [(ngModel)]="change.aprobo"
                    placeholder="Nombre Aprobador"
                  />
                </td>
                <td class="actions-cell">
                  <button class="action-btn btn-save" (click)="saveChange(change)" title="Guardar en State">
                    <i class="pi pi-save"></i>
                  </button>
                  <button class="action-btn btn-edit" (click)="editChange(i)" title="Editar">
                    <i class="pi pi-pencil"></i>
                  </button>
                  <button class="action-btn btn-delete" (click)="deleteChange(i)" title="Eliminar">
                    <i class="pi pi-trash"></i>
                  </button>
                </td>
              </tr>
              <tr *ngIf="changes.length === 0">
                <td colspan="6" class="no-data">No hay cambios registrados</td>
              </tr>
              
            </tbody>
          </table>
        </div>

        <!-- Dropdown Section at Bottom -->
        <div class="flex flex-wrap gap-2 w-full">
          <label for="state">State</label>
          <p-select id="state" [(ngModel)]="dropdownItem" [options]="dropdownItems" optionLabel="name" placeholder="Select One" class="w-full"></p-select>
        </div>
        
      </div>
    </div>
  `,
  styles: [`
    .risk-matrix-container {
      padding: 1.5rem;
      background: var(--surface-ground);
      min-height: 100vh;
    }

    /* ===== HEADER SECTION ===== */
    .header-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .qk-badge {
      background: #4F46E5;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      font-size: 1.25rem;
      font-weight: 700;
      min-width: 80px;
      text-align: center;
    }

    .title-section {
      flex: 1;
      text-align: center;
    }

    .title-section h1 {
      color: #1E293B;
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
    }

    .subtitle {
      background: #FCD34D;
      color: #78350F;
      padding: 0.5rem 1.5rem;
      border-radius: 4px;
      display: inline-block;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .action-buttons {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .btn {
      padding: 0.65rem 1.25rem;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      font-size: 0.875rem;
    }

    .btn i {
      font-size: 1rem;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .btn-save {
      background: #10B981;
      color: white;
    }

    .btn-save:hover {
      background: #059669;
    }

    .btn-excel {
      background: #10B981;
      color: white;
    }

    .btn-excel:hover {
      background: #059669;
    }

    .btn-pdf {
      background: #EF4444;
      color: white;
    }

    .btn-pdf:hover {
      background: #DC2626;
    }

    .btn-zip {
      background: #8B5CF6;
      color: white;
    }

    .btn-zip:hover {
      background: #7C3AED;
    }

    /* ===== STATS GRID ===== */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      border-left: 4px solid;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
    }

    .stat-header {
      margin-bottom: 1rem;
    }

    .stat-title {
      font-weight: 600;
      color: #475569;
      font-size: 0.875rem;
      margin-bottom: 0.25rem;
    }

    .stat-subtitle {
      color: #94A3B8;
      font-size: 0.75rem;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: 700;
      line-height: 1;
    }

    .stat-total {
      border-left-color: #3B82F6;
    }

    .stat-total .stat-value {
      color: #3B82F6;
    }

    .stat-critical {
      border-left-color: #EF4444;
    }

    .stat-critical .stat-value {
      color: #EF4444;
    }

    .stat-mitigated {
      border-left-color: #10B981;
    }

    .stat-mitigated .stat-value {
      color: #10B981;
    }

    .stat-changes {
      border-left-color: #06B6D4;
    }

    .stat-changes .stat-value {
      color: #06B6D4;
    }

    /* ===== PROJECT FORM ===== */
    .project-form {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      margin-bottom: 2rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1rem;
    }

    .form-row:last-child {
      margin-bottom: 0;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-label {
      background: #4F46E5;
      color: white;
      padding: 0.65rem 1rem;
      font-weight: 600;
      border-radius: 4px 4px 0 0;
      font-size: 0.875rem;
    }

    .form-control {
      padding: 0.75rem 1rem;
      border: 1px solid #E2E8F0;
      border-radius: 0 0 4px 4px;
      font-size: 0.875rem;
      transition: border-color 0.3s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: #4F46E5;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }

    .form-control::placeholder {
      color: #CBD5E1;
    }

    .date-range {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: white;
      padding: 0.75rem 1rem;
      border: 1px solid #E2E8F0;
      border-radius: 0 0 4px 4px;
    }

    .date-range input[type="date"] {
      border: none;
      padding: 0;
      flex: 1;
      font-size: 0.875rem;
    }

    .date-range input[type="date"]:focus {
      outline: none;
    }

    .date-separator {
      color: #94A3B8;
      font-weight: 600;
    }

    /* ===== CHANGE CONTROL SECTION ===== */
    .change-control-section {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #E2E8F0;
    }

    .section-header h2 {
      background: #4F46E5;
      color: white;
      padding: 0.65rem 1.5rem;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 600;
      margin: 0;
    }

    .btn-add {
      background: #10B981;
      color: white;
    }

    .btn-add:hover {
      background: #059669;
    }

    /* Botón Guardar */
    .form-actions {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 20px;
      flex-wrap: wrap;
    }

    .form-actions > div {
      flex: 1;
      min-width: 200px;
    }

    .form-actions label {
      display: block;
      font-weight: 600;
      color: #4F46E5;
      margin-bottom: 8px;
      font-size: 14px;
    }

    .btn-save {
      background: #3B82F6;
      color: white;
      padding: 10px 24px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
    }

    .btn-save:hover {
      background: #2563EB;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
    }

    .btn-save:active {
      transform: translateY(0);
    }

    /* ===== DROPDOWN SECTION ===== */
    .flex {
      display: flex;
    }

    .flex-wrap {
      flex-wrap: wrap;
    }

    .gap-2 {
      gap: 0.5rem;
    }

    .w-full {
      width: 100%;
    }

    .flex.flex-wrap.gap-2.w-full {
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 8px;
    }

    .flex.flex-wrap.gap-2.w-full label {
      display: block;
      font-weight: 600;
      color: #475569;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
      width: 100%;
    }

    ::ng-deep .w-full .p-select {
      width: 100%;
    }

    ::ng-deep .p-select {
      width: 100%;
    }

    ::ng-deep .p-select .p-select-label {
      padding: 0.75rem 1rem;
    }

    /* ===== TABLE ===== */
    .table-container {
      overflow-x: auto;
    }

    .change-table {
      width: 100%;
      border-collapse: collapse;
    }

    .change-table thead {
      background: #4F46E5;
    }

    .change-table thead th {
      color: white;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      font-size: 0.875rem;
      white-space: nowrap;
    }

    .change-table thead th:first-child {
      border-radius: 8px 0 0 0;
    }

    .change-table thead th:last-child {
      border-radius: 0 8px 0 0;
    }

    .change-table tbody tr {
      border-bottom: 1px solid #E2E8F0;
      transition: background-color 0.2s ease;
    }

    .change-table tbody tr:hover {
      background-color: #F8FAFC;
    }

    .change-table tbody tr:last-child {
      border-bottom: none;
    }

    .change-table tbody td {
      padding: 0.75rem;
    }

    .table-input {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid #E2E8F0;
      border-radius: 4px;
      font-size: 0.875rem;
      transition: border-color 0.3s ease;
    }

    .table-input:focus {
      outline: none;
      border-color: #4F46E5;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }

    .table-input::placeholder {
      color: #CBD5E1;
    }

    .table-input-wide {
      min-width: 200px;
    }

    .actions-cell {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
    }

    .action-btn {
      padding: 0.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      width: 36px;
      height: 36px;
    }

    .action-btn i {
      font-size: 1rem;
    }

    .action-btn:hover {
      transform: scale(1.1);
    }

    .btn-edit {
      background: #3B82F6;
      color: white;
    }

    .btn-edit:hover {
      background: #2563EB;
    }

    .btn-save {
      background: #10B981;
      color: white;
    }

    .btn-save:hover {
      background: #059669;
    }

    .btn-delete {
      background: #EF4444;
      color: white;
    }

    .btn-delete:hover {
      background: #DC2626;
    }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 768px) {
      .header-section {
        flex-direction: column;
        text-align: center;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .action-buttons {
        width: 100%;
        justify-content: center;
      }

      .section-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .section-header h2,
      .section-header .btn-add {
        width: 100%;
        text-align: center;
        justify-content: center;
      }

      .table-container {
        overflow-x: scroll;
      }

      .change-table {
        min-width: 800px;
      }
    }
  `]
})
export class RiskMatrixWidget {
  // Estadísticas del dashboard
  stats: RiskStats = {
    totalRiesgos: 0,
    criticos: 8,
    mitigados: 120,
    cambiosRecientes: 4
  };

  // Dropdown data
  dropdownItem: any = null;
  dropdownItems = [
    { name: 'Option 1', code: 'Option 1' },
    { name: 'Option 2', code: 'Option 2' },
    { name: 'Option 3', code: 'Option 3' }
  ];

  // Datos del proyecto
  project: Project = {
    nombre: 'Nombre del Proyecto',
    clave: 'PRJ-001',
    responsable: 'Juan Pérez',
    fechaInicio: '2025-11-12',
    fechaFin: '2025-11-12'
  };

  // Control de cambios
  changes: ChangeControl[] = [
    {
      version: '1.0',
      fecha: '2025-11-12',
      descripcion: 'Descripción del cambio',
      autor: 'Nombre Autor',
      aprobo: 'Nombre Aprobador'
    },
    {
      version: '1.0',
      fecha: '2025-11-12',
      descripcion: 'Descripción del cambio',
      autor: 'Nombre Autor',
      aprobo: 'Nombre Aprobador'
    },
    {
      version: '1.0',
      fecha: '2025-11-12',
      descripcion: 'Descripción del cambio',
      autor: 'Nombre Autor',
      aprobo: 'Nombre Aprobador'
    },
    {
      version: '1.0',
      fecha: '2025-11-12',
      descripcion: 'Descripción del cambio',
      autor: 'Nombre Autor',
      aprobo: 'Nombre Aprobador'
    }
  ];

  constructor(private router: Router) {}

  // Método para agregar nueva fila
  addNewChange() {
    this.changes.push({
      version: '1.0',
      fecha: new Date().toISOString().split('T')[0],
      descripcion: 'Descripción del cambio',
      autor: 'Nombre Autor',
      aprobo: 'Nombre Aprobador'
    });
    this.stats.cambiosRecientes = this.changes.length;
  }

  // Método para eliminar fila
  deleteChange(index: number) {
    this.changes.splice(index, 1);
    this.stats.cambiosRecientes = this.changes.length;
  }

  // Método para editar fila
  editChange(index: number) {
    console.log('Editando cambio:', this.changes[index]);
  }

  // Método para guardar cambio en el dropdown de State
  saveChange(change: ChangeControl) {
    // Validar que el cambio tenga una descripción válida
    if (!change.descripcion || change.descripcion.trim() === '' || change.descripcion === 'Descripción del cambio') {
      alert('Por favor, ingresa una descripción válida para el cambio');
      return;
    }

    // Crear un identificador único para el cambio (versión + descripción corta)
    const changeId = `v${change.version} - ${change.descripcion.substring(0, 30)}`;
    
    // Crear un nuevo item para el dropdown
    const nuevoItem = {
      name: changeId,
      code: `CHANGE-${change.version}-${Date.now()}`
    };

    // Verificar si el cambio ya existe en la lista
    const existeCambio = this.dropdownItems.some(item => 
      item.name === nuevoItem.name
    );

    if (!existeCambio) {
      // Agregar el cambio a las opciones del dropdown
      this.dropdownItems.push(nuevoItem);
      alert('Cambio guardado exitosamente y agregado a la lista de estados');
    } else {
      alert('Este cambio ya existe en la lista');
    }
  }

  // Método para guardar el proyecto
  guardarProyecto() {
    console.log('Guardando proyecto:', this.project);
    
    // Validar que el proyecto tenga un nombre
    if (!this.project.nombre || this.project.nombre.trim() === '' || this.project.nombre === 'Nombre del Proyecto') {
      alert('Por favor, ingresa un nombre válido para el proyecto');
      return;
    }

    // Crear un nuevo item para el dropdown con el nombre del proyecto
    const nuevoProyecto = {
      name: this.project.nombre,
      code: this.project.clave || this.project.nombre
    };

    // Verificar si el proyecto ya existe en la lista
    const existeProyecto = this.dropdownItems.some(item => 
      item.code === nuevoProyecto.code || item.name === nuevoProyecto.name
    );

    if (!existeProyecto) {
      // Agregar el nuevo proyecto a las opciones del dropdown
      this.dropdownItems.push(nuevoProyecto);
      
      // Incrementar el contador de Total de Riesgos
      this.stats.totalRiesgos++;
      
      alert('Proyecto guardado exitosamente y agregado a la lista de estados');
    } else {
      alert('El proyecto ya existe en la lista');
    }
    
    // Aquí puedes agregar la lógica para guardar en una API
  }

  // Métodos de exportación
  exportExcel() {
    // Datos del proyecto
    const projectData = [
      { 'Nombre del Proyecto/Aplicativo': this.project.nombre },
      { 'Clave del Proyecto': this.project.clave },
      { 'Responsable': this.project.responsable },
      { 'Fecha de Inicio': this.project.fechaInicio },
      { 'Fecha de Fin': this.project.fechaFin }
    ];
    // Datos de la tabla de cambios
    const changesData = this.changes.map(change => ({
      'Versión': change.version,
      'Fecha': change.fecha,
      'Descripción': change.descripcion,
      'Autor': change.autor,
      'Aprobó': change.aprobo
    }));
    // Crear hoja Excel
    const wsProject = XLSX.utils.json_to_sheet(projectData, { skipHeader: false });
    const wsChanges = XLSX.utils.json_to_sheet(changesData, { skipHeader: false });
    const wb: XLSX.WorkBook = { Sheets: { 'Proyecto': wsProject, 'Cambios': wsChanges }, SheetNames: ['Proyecto', 'Cambios'] };
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'matriz-riesgos.xlsx');
  }

  exportPDF() {
    const doc = new jsPDF();
    // Proyecto info
    doc.setFontSize(14);
    doc.text('Matriz de Riesgos - Proyecto', 14, 15);
    doc.setFontSize(11);
    let y = 25;
    doc.text(`Nombre del Proyecto/Aplicativo: ${this.project.nombre || ''}`, 14, y);
    y += 7;
    doc.text(`Clave del Proyecto: ${this.project.clave || ''}`, 14, y);
    y += 7;
    doc.text(`Responsable: ${this.project.responsable || ''}`, 14, y);
    y += 7;
    doc.text(`Fecha de Inicio: ${this.project.fechaInicio || ''}`, 14, y);
    y += 7;
    doc.text(`Fecha de Fin: ${this.project.fechaFin || ''}`, 14, y);
    y += 10;
    // Tabla de cambios
    autoTable(doc, {
      startY: y,
      head: [['Versión', 'Fecha', 'Descripción', 'Autor', 'Aprobó']],
      body: this.changes.map(c => [c.version, c.fecha, c.descripcion, c.autor, c.aprobo]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [79, 70, 229] },
      margin: { left: 14, right: 14 }
    });
    doc.save('matriz-riesgos.pdf');
  }

  saveData() {
    console.log('Guardando datos...');
    console.log('Proyecto:', this.project);
    console.log('Cambios:', this.changes);
    alert('Datos guardados correctamente');
  }

  goToUploadZip() {
    this.router.navigate(['/zip']);
  }
}