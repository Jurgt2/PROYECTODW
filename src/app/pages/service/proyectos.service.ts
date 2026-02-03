import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Proyecto {
  id: string;
  nombre: string;
  clave: string;
  descripcion: string;
  responsable: string;
  estado: 'En Progreso' | 'Completado' | 'Pendiente' | 'Atrasado' | 'Cancelado';
  prioridad: 'Alta' | 'Media' | 'Baja';
  fechaInicio: string;
  fechaFin: string;
  progreso: number;
  presupuesto: number;
  presupuestoUtilizado: number;
  riesgosAsociados: number;
  miembrosEquipo: string[];
  departamento: string;
  notas: string;
  historial: HistorialProyecto[];
}

export interface HistorialProyecto {
  fecha: string;
  accion: string;
  usuario: string;
  detalle: string;
}

export interface EstadisticasProyectos {
  total: number;
  activos: number;
  completados: number;
  pendientes: number;
  atrasados: number;
  cancelados: number;
  totalMiembros: number;
  presupuestoTotal: number;
  presupuestoUtilizado: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {
  private proyectosSubject = new BehaviorSubject<Proyecto[]>(this.getProyectosMock());
  public proyectos$: Observable<Proyecto[]> = this.proyectosSubject.asObservable();

  constructor() { }

  // Obtener todos los proyectos
  getProyectos(): Proyecto[] {
    return this.proyectosSubject.value;
  }

  // Agregar nuevo proyecto
  agregarProyecto(proyecto: Proyecto): void {
    const proyectos = [...this.proyectosSubject.value, proyecto];
    this.proyectosSubject.next(proyectos);
  }

  // Actualizar proyecto existente
  actualizarProyecto(proyectoActualizado: Proyecto): void {
    const proyectos = this.proyectosSubject.value.map(p =>
      p.id === proyectoActualizado.id ? proyectoActualizado : p
    );
    this.proyectosSubject.next(proyectos);
  }

  // Eliminar proyecto
  eliminarProyecto(id: string): void {
    const proyectos = this.proyectosSubject.value.filter(p => p.id !== id);
    this.proyectosSubject.next(proyectos);
  }

  // Obtener proyecto por ID
  getProyectoPorId(id: string): Proyecto | undefined {
    return this.proyectosSubject.value.find(p => p.id === id);
  }

  // Actualizar progreso de proyecto
  actualizarProgreso(id: string, progreso: number): void {
    const proyectos = this.proyectosSubject.value.map(p => {
      if (p.id === id) {
        return {
          ...p,
          progreso,
          historial: [
            ...p.historial,
            {
              fecha: new Date().toISOString(),
              accion: 'Actualización de Progreso',
              usuario: 'Admin',
              detalle: `Progreso actualizado a ${progreso}%`
            }
          ]
        };
      }
      return p;
    });
    this.proyectosSubject.next(proyectos);
  }

  // Cambiar estado del proyecto
  cambiarEstado(id: string, nuevoEstado: Proyecto['estado']): void {
    const proyectos = this.proyectosSubject.value.map(p => {
      if (p.id === id) {
        return {
          ...p,
          estado: nuevoEstado,
          historial: [
            ...p.historial,
            {
              fecha: new Date().toISOString(),
              accion: 'Cambio de Estado',
              usuario: 'Admin',
              detalle: `Estado cambiado a ${nuevoEstado}`
            }
          ]
        };
      }
      return p;
    });
    this.proyectosSubject.next(proyectos);
  }

  // Agregar nota al proyecto
  agregarNota(id: string, nota: string): void {
    const proyectos = this.proyectosSubject.value.map(p => {
      if (p.id === id) {
        return {
          ...p,
          notas: p.notas + '\n' + nota,
          historial: [
            ...p.historial,
            {
              fecha: new Date().toISOString(),
              accion: 'Nueva Nota',
              usuario: 'Admin',
              detalle: nota
            }
          ]
        };
      }
      return p;
    });
    this.proyectosSubject.next(proyectos);
  }

  // Obtener estadísticas
  getEstadisticas(): EstadisticasProyectos {
    const proyectos = this.proyectosSubject.value;
    
    return {
      total: proyectos.length,
      activos: proyectos.filter(p => p.estado === 'En Progreso').length,
      completados: proyectos.filter(p => p.estado === 'Completado').length,
      pendientes: proyectos.filter(p => p.estado === 'Pendiente').length,
      atrasados: proyectos.filter(p => p.estado === 'Atrasado').length,
      cancelados: proyectos.filter(p => p.estado === 'Cancelado').length,
      totalMiembros: [...new Set(proyectos.flatMap(p => p.miembrosEquipo))].length,
      presupuestoTotal: proyectos.reduce((sum, p) => sum + p.presupuesto, 0),
      presupuestoUtilizado: proyectos.reduce((sum, p) => sum + p.presupuestoUtilizado, 0)
    };
  }

  // Datos mock
  private getProyectosMock(): Proyecto[] {
    return [];
  }
}
