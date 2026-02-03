import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ConfiguracionService } from '@/app/services/configuracion.service';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';

// ==================== INTERFACES ====================

interface ConfiguracionPersonalizacion {
    colorPrincipal: string;
    logoEmpresa: string;
    tema: 'claro' | 'oscuro' | 'automatico';
}

interface Permiso {
    nombre: string;
    activo: boolean;
}

interface Rol {
    nombre: string;
    cantidadUsuarios: number;
    permisos: Permiso[];
}

interface ConfiguracionNotificaciones {
    emailActivo: boolean;
    notificarRiesgosCriticos: boolean;
    notificarCambiosProyectos: boolean;
    frecuenciaResumen: 'diario' | 'semanal' | 'mensual' | 'nunca';
}

// ...existing code...

// ==================== COMPONENTE ====================

@Component({
    selector: 'app-configuracion-del-sistema-widget',
    standalone: true,
    imports: [
        CommonModule, 
        FormsModule, 
        ButtonModule, 
        InputTextModule, 
        CardModule, 
        ToastModule,
        SelectModule,
        TableModule,
        DialogModule,
        TagModule
    ],
    providers: [MessageService],
    templateUrl: './configuracion-del-sistema-widget.component.html',
    styleUrls: ['./configuracion-del-sistema-widget.component.css']
})
export class ConfiguracionDelSistemaWidget implements OnInit {
    actualizarNombreSistema(nombre: string) {
        this.nombreSistema = nombre;
        this.configuracionService.setNombreSistema(nombre);
    }
    
    // ==================== CONFIGURACIÓN GENERAL ====================
    nombreSistema: string = 'SAKAI';
    emailAdmin: string = 'admin@sistema.com';
    urlBase: string = 'https://misistema.com';

    // ==================== PERSONALIZACIÓN ====================
    personalizacion: ConfiguracionPersonalizacion = {
        colorPrincipal: '#3b82f6',
        logoEmpresa: '',
        tema: 'claro'
    };

    opcionesTema = [
        { label: 'Claro', value: 'claro' },
        { label: 'Oscuro', value: 'oscuro' },
        { label: 'Automático', value: 'automatico' }
    ];

    // ==================== ROLES Y PERMISOS ====================
    roles: Rol[] = [
        {
            nombre: 'Admin',
            cantidadUsuarios: 5,
            permisos: [
                { nombre: 'Crear proyectos', activo: true },
                { nombre: 'Editar proyectos', activo: true },
                { nombre: 'Eliminar proyectos', activo: true },
                { nombre: 'Crear riesgos', activo: true },
                { nombre: 'Editar riesgos', activo: true },
                { nombre: 'Eliminar riesgos', activo: true },
                { nombre: 'Ver reportes', activo: true },
                { nombre: 'Gestionar usuarios', activo: true },
                { nombre: 'Acceso a configuración', activo: true }
            ]
        },
        {
            nombre: 'Gerente',
            cantidadUsuarios: 12,
            permisos: [
                { nombre: 'Crear proyectos', activo: true },
                { nombre: 'Editar proyectos', activo: true },
                { nombre: 'Eliminar proyectos', activo: false },
                { nombre: 'Crear riesgos', activo: true },
                { nombre: 'Editar riesgos', activo: true },
                { nombre: 'Eliminar riesgos', activo: false },
                { nombre: 'Ver reportes', activo: true },
                { nombre: 'Gestionar usuarios', activo: false },
                { nombre: 'Acceso a configuración', activo: false }
            ]
        },
        {
            nombre: 'Usuario',
            cantidadUsuarios: 45,
            permisos: [
                { nombre: 'Crear proyectos', activo: true },
                { nombre: 'Editar proyectos', activo: true },
                { nombre: 'Eliminar proyectos', activo: false },
                { nombre: 'Crear riesgos', activo: true },
                { nombre: 'Editar riesgos', activo: true },
                { nombre: 'Eliminar riesgos', activo: false },
                { nombre: 'Ver reportes', activo: true },
                { nombre: 'Gestionar usuarios', activo: false },
                { nombre: 'Acceso a configuración', activo: false }
            ]
        },
        {
            nombre: 'Solo Lectura',
            cantidadUsuarios: 23,
            permisos: [
                { nombre: 'Crear proyectos', activo: false },
                { nombre: 'Editar proyectos', activo: false },
                { nombre: 'Eliminar proyectos', activo: false },
                { nombre: 'Crear riesgos', activo: false },
                { nombre: 'Editar riesgos', activo: false },
                { nombre: 'Eliminar riesgos', activo: false },
                { nombre: 'Ver reportes', activo: true },
                { nombre: 'Gestionar usuarios', activo: false },
                { nombre: 'Acceso a configuración', activo: false }
            ]
        }
    ];

    mostrarDialogPermisos: boolean = false;
    rolSeleccionado: Rol | null = null;

    // ==================== NOTIFICACIONES ====================
    notificaciones: ConfiguracionNotificaciones = {
        emailActivo: true,
        notificarRiesgosCriticos: false,
        notificarCambiosProyectos: false,
        frecuenciaResumen: 'semanal'
    };

    opcionesFrecuencia = [
        { label: 'Diario', value: 'diario' },
        { label: 'Semanal', value: 'semanal' },
        { label: 'Mensual', value: 'mensual' },
        { label: 'Nunca', value: 'nunca' }
    ];

    // ...existing code...

    // ==================== CONSTRUCTOR ====================
    constructor(private messageService: MessageService, private configuracionService: ConfiguracionService) {}

    ngOnInit() {
        // Cargar configuraciones guardadas del backend
    }

    // ==================== MÉTODOS CONFIGURACIÓN GENERAL ====================
    
    guardar() {
        // Actualiza el nombre del sistema en el servicio global
        this.configuracionService.setNombreSistema(this.nombreSistema);
        this.messageService.add({
            severity: 'info',
            summary: 'Guardando',
            detail: 'Guardando configuración general...'
        });

        setTimeout(() => {
            this.messageService.add({
                severity: 'success',
                summary: 'Guardado',
                detail: 'Configuración general guardada exitosamente'
            });
        }, 1000);
    }

    // ==================== MÉTODOS PERSONALIZACIÓN ====================
    
    onLogoUpload(event: any) {
        const file = event.target.files[0];
        
        // Validar tipo de archivo
        if (!file.type.match(/image\/(png|jpg|jpeg)/)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'El archivo debe ser una imagen PNG, JPG o JPEG'
            });
            return;
        }

        // Validar tamaño (2MB máximo)
        if (file.size > 2 * 1024 * 1024) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'El archivo no debe superar los 2MB'
            });
            return;
        }

        // Simular guardado de logo
        const reader = new FileReader();
        reader.onload = (e: any) => {
            this.personalizacion.logoEmpresa = e.target.result;
            this.configuracionService.setLogo(e.target.result);
            this.messageService.add({
                severity: 'success',
                summary: 'Logo Cargado',
                detail: 'El logo se ha cargado correctamente'
            });
        };
        reader.readAsDataURL(file);
    }

    guardarPersonalizacion() {
        // Validar color principal
        const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        if (!hexColorRegex.test(this.personalizacion.colorPrincipal)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'El color principal debe ser un código hexadecimal válido'
            });
            return;
        }

            // Guardar el color principal en el servicio global y aplicarlo
            this.configuracionService.setColorPrincipal(this.personalizacion.colorPrincipal);

            this.messageService.add({
                severity: 'success',
                summary: 'Guardado',
                detail: 'Color principal actualizado exitosamente'
            });
    }

    // ==================== MÉTODOS ROLES Y PERMISOS ====================
    
    editarPermisos(rol: Rol) {
        this.rolSeleccionado = { ...rol, permisos: [...rol.permisos] };
        this.mostrarDialogPermisos = true;
    }

    guardarPermisos() {
        if (!this.rolSeleccionado) return;

        this.messageService.add({
            severity: 'info',
            summary: 'Guardando',
            detail: 'Guardando permisos del rol...'
        });

        setTimeout(() => {
            // Actualizar el rol en la lista
            const index = this.roles.findIndex(r => r.nombre === this.rolSeleccionado!.nombre);
            if (index !== -1) {
                this.roles[index] = this.rolSeleccionado!;
            }

            this.messageService.add({
                severity: 'success',
                summary: 'Guardado',
                detail: `Permisos del rol ${this.rolSeleccionado!.nombre} guardados exitosamente`
            });

            this.mostrarDialogPermisos = false;
            this.rolSeleccionado = null;
        }, 1000);
    }

    // ==================== MÉTODOS NOTIFICACIONES ====================
    
    guardarNotificaciones() {
        this.messageService.add({
            severity: 'info',
            summary: 'Guardando',
            detail: 'Guardando configuración de notificaciones...'
        });

        setTimeout(() => {
            this.messageService.add({
                severity: 'success',
                summary: 'Guardado',
                detail: 'Configuración de notificaciones guardada exitosamente'
            });
        }, 1000);
    }

    // ...existing code...
}
