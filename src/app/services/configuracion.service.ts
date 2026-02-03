import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfiguracionService {
  private colorPrincipalSubject = new BehaviorSubject<string>('#3b82f6');
  colorPrincipal$ = this.colorPrincipalSubject.asObservable();

  setColorPrincipal(color: string) {
    this.colorPrincipalSubject.next(color);
    // Actualiza la variable CSS global
    document.documentElement.style.setProperty('--color-principal', color);
  }

  getColorPrincipal(): string {
    return this.colorPrincipalSubject.value;
  }
  private nombreSistemaSubject = new BehaviorSubject<string>('Quality & Knowledge');
  nombreSistema$ = this.nombreSistemaSubject.asObservable();

  private logoSubject = new BehaviorSubject<string | null>(null);
  logo$ = this.logoSubject.asObservable();

  setNombreSistema(nombre: string) {
    this.nombreSistemaSubject.next(nombre);
  }

  getNombreSistema(): string {
    return this.nombreSistemaSubject.value;
  }

  setLogo(logoBase64: string) {
    this.logoSubject.next(logoBase64);
  }

  getLogo(): string | null {
    return this.logoSubject.value;
  }
}
