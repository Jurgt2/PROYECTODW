import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UsuariosService, Usuario } from '../../service/usuarios.service';

@Component({
  standalone: true,
  selector: 'app-gestion-de-usuarios-widget',
  imports: [
    CommonModule, 
    ButtonModule, 
    TableModule, 
    InputTextModule, 
    TagModule,
    DialogModule,
    FormsModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './gestion-de-usuarios-widget.component.html',
  styleUrls: ['./gestion-de-usuarios-widget.component.css']
})
export class GestionDeUsuariosWidget implements OnInit {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  busqueda: string = '';
  mostrarDialogo: boolean = false;
  esEdicion: boolean = false;
  usuarioSeleccionado: Usuario = this.getUsuarioVacio();

  constructor(
    private messageService: MessageService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit() {
    this.usuariosService.usuarios$.subscribe(usuarios => {
      this.usuarios = usuarios;
      this.filtrarUsuarios();
    });
  }

  getUsuariosActivos(): number {
    return this.usuarios.filter((u: Usuario) => u.estado === 'activo').length;
  }

  getUsuariosInactivos(): number {
    return this.usuarios.filter((u: Usuario) => u.estado === 'inactivo').length;
  }

  filtrarUsuarios() {
    if (!this.busqueda) {
      this.usuariosFiltrados = [...this.usuarios];
      return;
    }

    const termino = this.busqueda.toLowerCase();
    this.usuariosFiltrados = this.usuarios.filter((u: Usuario) =>
      u.nombre.toLowerCase().includes(termino) ||
      u.email.toLowerCase().includes(termino) ||
      u.rol.toLowerCase().includes(termino)
    );
  }

  getRolClass(rol: string): string {
    switch(rol.toLowerCase()) {
      case 'administrador':
        return 'rol-admin';
      default:
        return 'rol-usuario';
    }
  }

  abrirDialogoNuevo() {
    this.esEdicion = false;
    this.usuarioSeleccionado = this.getUsuarioVacio();
    this.mostrarDialogo = true;
  }

  editarUsuario(usuario: Usuario) {
    this.esEdicion = true;
    this.usuarioSeleccionado = { ...usuario };
    this.mostrarDialogo = true;
  }

  eliminarUsuario(usuario: Usuario) {
    this.usuariosService.eliminarUsuario(usuario.id);
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Usuario eliminado correctamente'
    });
  }

  guardarUsuario() {
    // Validaciones
    if (!this.usuarioSeleccionado.nombre || !this.usuarioSeleccionado.email || !this.usuarioSeleccionado.departamento) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor completa todos los campos requeridos'
      });
      return;
    }

    if (!this.esEdicion && (!this.usuarioSeleccionado.password || this.usuarioSeleccionado.password.length < 6)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'La contraseña debe tener al menos 6 caracteres'
      });
      return;
    }

    // Validar email único
    const emailExiste = this.usuarios.some(u => 
      u.email === this.usuarioSeleccionado.email && u.id !== this.usuarioSeleccionado.id
    );
    
    if (emailExiste) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Ya existe un usuario con ese email'
      });
      return;
    }

    if (this.esEdicion) {
      this.usuariosService.actualizarUsuario(this.usuarioSeleccionado);
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Usuario actualizado correctamente'
      });
    } else {
      const nuevoId = Math.max(...this.usuarios.map((u: Usuario) => u.id), 0) + 1;
      this.usuarioSeleccionado.id = nuevoId;
      this.usuarioSeleccionado.fechaRegistro = new Date().toISOString().split('T')[0];
      this.usuariosService.agregarUsuario(this.usuarioSeleccionado);
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Usuario creado correctamente. Puede iniciar sesión con su email y contraseña.'
      });
    }
    this.cerrarDialogo();
  }

  cerrarDialogo() {
    this.mostrarDialogo = false;
    this.usuarioSeleccionado = this.getUsuarioVacio();
  }

  getUsuarioVacio(): Usuario {
    return {
      id: 0,
      nombre: '',
      email: '',
      password: '',
      rol: 'Usuario',
      estado: 'activo',
      fechaRegistro: '',
      departamento: '',
      proyectosAsignados: [],
      permisos: ['ver']
    };
  }
}
