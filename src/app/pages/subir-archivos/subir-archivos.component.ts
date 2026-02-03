import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';

interface ArchivoSubido {
  nombre: string;
  tamano: string;
  fecha: string;
  estado: string;
}

@Component({
  selector: 'app-subir-archivos',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, FileUploadModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-4">Subir Archivos ZIP</h1>
      
      <!-- Uploader -->
      <p-fileUpload 
        name="demo[]" 
        accept=".zip"
        maxFileSize="10000000"
        (onUpload)="onUpload($event)"
        [auto]="true"
        chooseLabel="Seleccionar ZIP">
      </p-fileUpload>

      <!-- Tabla -->
      <div class="mt-6">
        <p-table [value]="archivos" [tableStyle]="{ 'min-width': '50rem' }">
          <ng-template pTemplate="header">
            <tr>
              <th>Nombre</th>
              <th>Tamaño</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-archivo>
            <tr>
              <td>{{ archivo.nombre }}</td>
              <td>{{ archivo.tamano }}</td>
              <td>{{ archivo.fecha }}</td>
              <td>{{ archivo.estado }}</td>
              <td>
                <p-button icon="pi pi-trash" severity="danger" (click)="eliminar(archivo)"></p-button>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `
})
export class SubirArchivosComponent {
  archivos: ArchivoSubido[] = [
    { nombre: 'proyecto.zip', tamano: '2.5 MB', fecha: '01/02/2026', estado: 'Completo' },
    { nombre: 'backup.zip', tamano: '5.1 MB', fecha: '31/01/2026', estado: 'Completo' }
  ];

  onUpload(event: any) {
    console.log('Archivo subido:', event);
    // Aquí agregarías el archivo a la tabla
  }

  eliminar(archivo: ArchivoSubido) {
    this.archivos = this.archivos.filter(a => a !== archivo);
  }
}