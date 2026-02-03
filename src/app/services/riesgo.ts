import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RiesgoService {
  private apiUrl = 'http://localhost:8080/api/riesgos';

  constructor(private http: HttpClient) { }

  getRiesgos(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getRiesgo(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  crearRiesgo(riesgo: any): Observable<any> {
    return this.http.post(this.apiUrl, riesgo);
  }

  actualizarRiesgo(id: number, riesgo: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, riesgo);
  }

  eliminarRiesgo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}