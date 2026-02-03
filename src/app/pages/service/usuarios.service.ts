import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password?: string; // Contraseña para login (opcional para compatibilidad)
  rol: 'Administrador' | 'Usuario';
  estado: 'activo' | 'inactivo';
  fechaRegistro: string;
  avatar?: string;
  departamento: string;
  telefono?: string;
  ultimoAcceso?: string;
  proyectosAsignados: string[];
  permisos: string[];
}

export interface EstadisticasUsuarios {
  total: number;
  activos: number;
  inactivos: number;
  administradores: number;
  gestores: number;
  analistas: number;
  supervisores: number;
  usuariosBasicos: number;
  nuevosEsteMes: number;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private usuariosSubject = new BehaviorSubject<Usuario[]>(this.getUsuariosMock());
  public usuarios$: Observable<Usuario[]> = this.usuariosSubject.asObservable();

  constructor() { }

  // Obtener todos los usuarios
  getUsuarios(): Usuario[] {
    return this.usuariosSubject.value;
  }

  // Agregar nuevo usuario
  agregarUsuario(usuario: Usuario): void {
    const usuarios = [...this.usuariosSubject.value, usuario];
    this.usuariosSubject.next(usuarios);
  }

  // Actualizar usuario existente
  actualizarUsuario(usuarioActualizado: Usuario): void {
    const usuarios = this.usuariosSubject.value.map(u =>
      u.id === usuarioActualizado.id ? usuarioActualizado : u
    );
    this.usuariosSubject.next(usuarios);
  }

  // Eliminar usuario
  eliminarUsuario(id: number): void {
    const usuarios = this.usuariosSubject.value.filter(u => u.id !== id);
    this.usuariosSubject.next(usuarios);
  }

  // Obtener usuario por ID
  getUsuarioPorId(id: number): Usuario | undefined {
    return this.usuariosSubject.value.find(u => u.id === id);
  }

  // Cambiar estado del usuario
  cambiarEstado(id: number, nuevoEstado: 'activo' | 'inactivo'): void {
    const usuarios = this.usuariosSubject.value.map(u => {
      if (u.id === id) {
        return { ...u, estado: nuevoEstado };
      }
      return u;
    });
    this.usuariosSubject.next(usuarios);
  }

  // Actualizar último acceso
  actualizarUltimoAcceso(id: number): void {
    const usuarios = this.usuariosSubject.value.map(u => {
      if (u.id === id) {
        return { ...u, ultimoAcceso: new Date().toISOString() };
      }
      return u;
    });
    this.usuariosSubject.next(usuarios);
  }

  // Obtener estadísticas
  getEstadisticas(): EstadisticasUsuarios {
    const usuarios = this.usuariosSubject.value;
    const haceUnMes = new Date();
    haceUnMes.setMonth(haceUnMes.getMonth() - 1);

    return {
      total: usuarios.length,
      activos: usuarios.filter(u => u.estado === 'activo').length,
      inactivos: usuarios.filter(u => u.estado === 'inactivo').length,
      administradores: usuarios.filter(u => u.rol === 'Administrador').length,
      gestores: 0,
      analistas: 0,
      supervisores: 0,
      usuariosBasicos: usuarios.filter(u => u.rol === 'Usuario').length,
      nuevosEsteMes: usuarios.filter(u => {
        const fechaRegistro = new Date(u.fechaRegistro);
        return fechaRegistro >= haceUnMes;
      }).length
    };
  }

  // Buscar usuario por email (para login)
  getUsuarioPorEmail(email: string): Usuario | undefined {
    return this.usuariosSubject.value.find(u => u.email === email);
  }

  // Validar credenciales de usuario
  validarCredenciales(email: string, password: string): Usuario | null {
    const usuario = this.usuariosSubject.value.find(
      u => u.email === email && u.password === password && u.estado === 'activo'
    );
    return usuario || null;
  }

  // Datos mock
  private getUsuariosMock(): Usuario[] {
    return [
      {
        id: 1,
        nombre: 'Administrador del Sistema',
        email: 'admin',
        password: 'admin123',
        rol: 'Administrador',
        estado: 'activo',
        fechaRegistro: '2024-01-15',
        avatar: 'https://ui-avatars.com/api/?name=Admin&background=667eea&color=fff',
        departamento: 'Administración',
        telefono: '+1 234 567 8900',
        ultimoAcceso: new Date().toISOString(),
        proyectosAsignados: ['Todos'],
        permisos: ['Acceso Total', 'Gestión de Usuarios', 'Gestión de Proyectos', 'Reportes']
      },
      {
        id: 2,
        nombre: 'Usuario de Prueba',
        email: 'usuario',
        password: 'user123',
        rol: 'Usuario',
        estado: 'activo',
        fechaRegistro: '2024-02-01',
        avatar: 'https://ui-avatars.com/api/?name=Usuario&background=10b981&color=fff',
        departamento: 'Operaciones',
        telefono: '+1 234 567 8901',
        ultimoAcceso: new Date().toISOString(),
        proyectosAsignados: ['Proyecto Alpha', 'Proyecto Beta'],
        permisos: ['Ver Proyectos', 'Registrar Riesgos']
      },
      {
        id: 3,
        nombre: 'María García',
        email: 'maria@example.com',
        password: 'maria123',
        rol: 'Usuario',
        estado: 'activo',
        fechaRegistro: '2024-01-20',
        avatar: 'https://ui-avatars.com/api/?name=Maria+Garcia&background=f59e0b&color=fff',
        departamento: 'Calidad',
        telefono: '+1 234 567 8902',
        ultimoAcceso: '2024-01-30T10:30:00Z',
        proyectosAsignados: ['Proyecto Alpha'],
        permisos: ['Ver Proyectos', 'Registrar Riesgos', 'Ver Reportes']
      },
      {
        id: 4,
        nombre: 'Carlos Rodríguez',
        email: 'carlos@example.com',
        password: 'carlos123',
        rol: 'Administrador',
        estado: 'activo',
        fechaRegistro: '2024-01-18',
        avatar: 'https://ui-avatars.com/api/?name=Carlos+Rodriguez&background=3b82f6&color=fff',
        departamento: 'IT',
        telefono: '+1 234 567 8903',
        ultimoAcceso: '2024-02-01T14:20:00Z',
        proyectosAsignados: ['Proyecto Gamma', 'Proyecto Delta'],
        permisos: ['Acceso Total', 'Gestión de Usuarios', 'Gestión de Proyectos']
      },
      {
        id: 5,
        nombre: 'Ana Martínez',
        email: 'ana@example.com',
        password: 'ana123',
        rol: 'Usuario',
        estado: 'inactivo',
        fechaRegistro: '2023-12-10',
        avatar: 'https://ui-avatars.com/api/?name=Ana+Martinez&background=8b5cf6&color=fff',
        departamento: 'Recursos Humanos',
        telefono: '+1 234 567 8904',
        ultimoAcceso: '2023-12-28T09:15:00Z',
        proyectosAsignados: [],
        permisos: ['Ver Proyectos']
      },
      {
        id: 6,
        nombre: 'Esmeralda Santamaria',
        email: 'Esmeralda',
        password: 'Esmeralda',
        rol: 'Usuario',
        estado: 'activo',
        fechaRegistro: '2024-02-02',
        avatar: 'https://ui-avatars.com/api/?name=Esmeralda+Santamaria&background=10b981&color=fff',
        departamento: 'Operaciones',
        telefono: '+1 234 567 8905',
        ultimoAcceso: new Date().toISOString(),
        proyectosAsignados: ['Proyecto Alpha', 'Proyecto Beta'],
        permisos: ['Ver Proyectos', 'Registrar Riesgos']
      },
      {
        id: 7,
        nombre: 'Esmeralda Santamaria',
        email: 'EsmeraldaS@gmail.com',
        password: 'Esmeralda',
        rol: 'Usuario',
        estado: 'activo',
        fechaRegistro: '2024-02-02',
        avatar: 'https://ui-avatars.com/api/?name=Esmeralda+Santamaria&background=10b981&color=fff',
        departamento: 'Operaciones',
        telefono: '+1 234 567 8905',
        ultimoAcceso: new Date().toISOString(),
        proyectosAsignados: ['Proyecto Alpha', 'Proyecto Beta'],
        permisos: ['Ver Proyectos', 'Registrar Riesgos']
      }
    ];
  }
}
