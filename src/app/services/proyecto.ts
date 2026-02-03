import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  private apiUrl = 'http://localhost:8080/api/proyectos';

  constructor(private http: HttpClient) { }

  getProyectos(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getProyecto(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  crearProyecto(proyecto: any): Observable<any> {
    return this.http.post(this.apiUrl, proyecto);
  }

  actualizarProyecto(id: number, proyecto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, proyecto);
  }

  eliminarProyecto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}