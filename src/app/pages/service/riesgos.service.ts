import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Riesgo {
  id: string;
  tipo: 'Riesgo' | 'Oportunidad';
  idProyecto: string;
  categoria: string;
  descripcion: string;
  consecuencia: string;
  identificadoPor: string;
  fechaRegistro: Date;
  nivelImpacto: string;
  probabilidadOcurrencia: number;
  evaluacionRiesgo: string;
  estrategiaRiesgo: string;
  respuestaRiesgo: string;
  responsable: string;
  fechaLimite: Date;
  estatus: string;
  siguienteVerificacion: Date;
  probabilidad: string;
  impacto: string;
  nivel: string;
  estado: string;
  fechaIdentificacion: Date;
  proyecto: string;
  accionesMitigacion: string;
  progreso: number;
  comentarios: string[];
  historial: { fecha: Date; accion: string; usuario: string }[];
}

@Injectable({ 
  providedIn: 'root' 
})
export class RiesgosService {
  
  private apiUrl = `${environment.apiUrl}/riesgos`;
  private riesgosSubject = new BehaviorSubject<Riesgo[]>([]);
  public riesgos$: Observable<Riesgo[]> = this.riesgosSubject.asObservable();

  constructor(private http: HttpClient) {
    this.cargarRiesgos();
  }

  cargarRiesgos(): void {
    this.http.get<Riesgo[]>(this.apiUrl).subscribe(riesgos => {
      this.riesgosSubject.next(riesgos);
    });
  }

  getRiesgos(): Observable<Riesgo[]> {
    return this.http.get<Riesgo[]>(this.apiUrl);
  }

  agregarRiesgo(riesgo: Riesgo): Observable<Riesgo> {
    return this.http.post<Riesgo>(this.apiUrl, riesgo);
  }

  actualizarRiesgo(riesgo: Riesgo): Observable<Riesgo> {
    return this.http.put<Riesgo>(`${this.apiUrl}/${riesgo.id}`, riesgo);
  }

  eliminarRiesgo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getRiesgoPorId(id: string): Observable<Riesgo> {
    return this.http.get<Riesgo>(`${this.apiUrl}/${id}`);
  }

  // Obtener riesgos por proyecto
  getRiesgosPorProyecto(proyectoId: string): Observable<Riesgo[]> {
    return this.http.get<Riesgo[]>(`${this.apiUrl}/proyecto/${proyectoId}`);
  }

  // Obtener riesgos por nivel
  getRiesgosPorNivel(nivel: string): Observable<Riesgo[]> {
    return this.http.get<Riesgo[]>(`${this.apiUrl}/nivel/${nivel}`);
  }

  // Obtener riesgos por estado
  getRiesgosPorEstado(estado: string): Observable<Riesgo[]> {
    return this.http.get<Riesgo[]>(`${this.apiUrl}/estado/${estado}`);
  }

  // Calcular nivel de riesgo basado en probabilidad e impacto
  calcularNivel(probabilidad: string, impacto: string): string {
    const matriz: { [key: string]: { [key: string]: string } } = {
      'Baja': { 'Bajo': 'Bajo', 'Medio': 'Bajo', 'Alto': 'Medio', 'Critico': 'Alto' },
      'Media': { 'Bajo': 'Bajo', 'Medio': 'Medio', 'Alto': 'Alto', 'Critico': 'Critico' },
      'Alta': { 'Bajo': 'Medio', 'Medio': 'Alto', 'Alto': 'Critico', 'Critico': 'Critico' }
    };
    return matriz[probabilidad]?.[impacto] || 'Medio';
  }

  // Obtener estadísticas de riesgos
  getEstadisticas(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/estadisticas`);
  }
}