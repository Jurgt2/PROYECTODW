import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ChartModule } from 'primeng/chart';
import { ProyectosService, Proyecto, EstadisticasProyectos } from '../../service/proyectos.service';
import { RiesgosService } from '../../service/riesgos.service';
import { ProyectoService } from '../../../services/proyecto';

@Component({
  standalone: true,
  selector: 'app-gestion-de-proyectos-widget',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    TagModule,
    InputTextModule,
    SelectModule,
    ProgressBarModule,
    TooltipModule,
    DialogModule,
    ChartModule
  ],
  templateUrl: './gestion-de-proyectos-widget.component.html',
  styleUrls: ['./gestion-de-proyectos-widget.component.css']
})
export class GestionDeProyectosWidget implements OnInit {

  // Datos
  proyectos: Proyecto[] = [];
  proyectosFiltrados: Proyecto[] = [];
  stats: EstadisticasProyectos = {
    total: 0,
    activos: 0,
    completados: 0,
    pendientes: 0,
    atrasados: 0,
    cancelados: 0,
    totalMiembros: 0,
    presupuestoTotal: 0,
    presupuestoUtilizado: 0
  };

  // Filtros
  filtroTexto: string = '';
  filtroEstado: string = '';
  filtroPrioridad: string = '';
  filtroDepartamento: string = '';

  // Opciones de filtros
  opcionesEstado = [
    { label: 'Todos', value: '' },
    { label: 'En Progreso', value: 'En Progreso' },
    { label: 'Completado', value: 'Completado' },
    { label: 'Pendiente', value: 'Pendiente' },
    { label: 'Atrasado', value: 'Atrasado' },
    { label: 'Cancelado', value: 'Cancelado' }
  ];

  opcionesPrioridad = [
    { label: 'Todas', value: '' },
    { label: 'Alta', value: 'Alta' },
    { label: 'Media', value: 'Media' },
    { label: 'Baja', value: 'Baja' }
  ];

  opcionesDepartamento = [
    { label: 'Todos', value: '' },
    { label: 'TI', value: 'TI' },
    { label: 'Desarrollo', value: 'Desarrollo' },
    { label: 'Infraestructura', value: 'Infraestructura' },
    { label: 'Análisis', value: 'Análisis' },
    { label: 'Seguridad', value: 'Seguridad' },
    { label: 'Operaciones', value: 'Operaciones' }
  ];

  // Diálogo de detalles
  mostrarDialogDetalles: boolean = false;
  proyectoSeleccionado: Proyecto | null = null;

  // Diálogo de nuevo proyecto
  mostrarDialogNuevo: boolean = false;
  nuevoProyecto: Proyecto = this.crearProyectoVacio();

  // Gráficas
  chartDataEstados: any;
  chartOptionsEstados: any;
  chartDataPresupuesto: any;
  chartOptionsPresupuesto: any;

  constructor(
    private proyectosService: ProyectosService,
    private riesgosService: RiesgosService,
    private proyectoService: ProyectoService
  ) {
    console.log('🏗️ CONSTRUCTOR ejecutado - Componente creado');
  }

  ngOnInit(): void {
    console.log('🚀 ngOnInit EJECUTADO - Componente inicializado');
    console.log('📍 ProyectoService inyectado:', this.proyectoService);
    
    // PRUEBA DE CONEXIÓN CON EL BACKEND
    this.probarConexionBackend();

    // Suscribirse a cambios en proyectos
    this.proyectosService.proyectos$.subscribe(proyectos => {
      console.log('📦 Proyectos recibidos del servicio local:', proyectos);
      this.proyectos = proyectos;
      this.aplicarFiltros();
      this.stats = this.proyectosService.getEstadisticas();
      this.inicializarGraficas();
    });
  }

  // MÉTODO PARA PROBAR LA CONEXIÓN
  probarConexionBackend(): void {
    console.log('🔄 Intentando conectar con el backend en http://localhost:8080/api/proyectos...');
    
    this.proyectoService.getProyectos().subscribe({
      next: (data) => {
        console.log('✅ ¡CONEXIÓN EXITOSA! Datos recibidos del backend:', data);
        console.log('📊 Cantidad de proyectos:', data.length);
      },
      error: (error) => {
        console.error('❌ ERROR DE CONEXIÓN CON EL BACKEND:', error);
        console.error('Detalles del error:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url
        });
        
        if (error.status === 0) {
          console.error('💡 Posibles causas:');
          console.error('   - El backend no está corriendo en localhost:8080');
          console.error('   - Hay un problema de CORS');
          console.error('   - El firewall está bloqueando la conexión');
        }
      }
    });
  }

  aplicarFiltros() {
    this.proyectosFiltrados = this.proyectos.filter(proyecto => {
      const coincideTexto = !this.filtroTexto ||
        proyecto.nombre.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
        proyecto.clave.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
        proyecto.responsable.toLowerCase().includes(this.filtroTexto.toLowerCase());

      const coincideEstado = !this.filtroEstado || proyecto.estado === this.filtroEstado;
      const coincidePrioridad = !this.filtroPrioridad || proyecto.prioridad === this.filtroPrioridad;
      const coincideDepartamento = !this.filtroDepartamento || proyecto.departamento === this.filtroDepartamento;

      return coincideTexto && coincideEstado && coincidePrioridad && coincideDepartamento;
    });
  }

  verDetalle(proyecto: Proyecto) {
    this.proyectoSeleccionado = { ...proyecto };
    this.mostrarDialogDetalles = true;
  }

  abrirDialogNuevo() {
    this.nuevoProyecto = this.crearProyectoVacio();
    this.mostrarDialogNuevo = true;
  }

  guardarNuevoProyecto() {
    // Generar ID único
    const maxId = Math.max(...this.proyectos.map(p => parseInt(p.id.split('-')[1])), 0);
    this.nuevoProyecto.id = `PROJ-${String(maxId + 1).padStart(3, '0')}`;
    this.nuevoProyecto.historial = [{
      fecha: new Date().toISOString(),
      accion: 'Creación de Proyecto',
      usuario: 'Admin',
      detalle: 'Proyecto creado en el sistema'
    }];

    this.proyectosService.agregarProyecto(this.nuevoProyecto);
    this.mostrarDialogNuevo = false;
  }

  eliminarProyecto(id: string) {
    if (confirm('¿Estás seguro de eliminar este proyecto?')) {
      this.proyectosService.eliminarProyecto(id);
    }
  }

  editarProyecto(proyecto: Proyecto) {
    this.nuevoProyecto = { ...proyecto };
    this.mostrarDialogNuevo = true;
  }

  actualizarProyecto() {
    this.proyectosService.actualizarProyecto(this.nuevoProyecto);
    this.mostrarDialogNuevo = false;
  }

  getSeverityEstado(estado: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    switch (estado) {
      case 'Completado': return 'success';
      case 'En Progreso': return 'info';
      case 'Pendiente': return 'warn';
      case 'Atrasado': return 'danger';
      case 'Cancelado': return 'secondary';
      default: return 'contrast';
    }
  }

  getSeverityPrioridad(prioridad: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    switch (prioridad) {
      case 'Alta': return 'danger';
      case 'Media': return 'warn';
      case 'Baja': return 'info';
      default: return 'secondary';
    }
  }

  getColorProgreso(progreso: number): string {
    if (progreso >= 80) return '#22C55E'; // Verde
    if (progreso >= 50) return '#3B82F6'; // Azul
    if (progreso >= 30) return '#EAB308'; // Amarillo
    return '#EF4444'; // Rojo
  }

  verRiesgos(proyecto: Proyecto) {
    // Aquí podrías navegar a la matriz de riesgos filtrando por proyecto
    console.log('Ver riesgos del proyecto:', proyecto.nombre);
  }

  private crearProyectoVacio(): Proyecto {
    return {
      id: '',
      nombre: '',
      clave: '',
      descripcion: '',
      responsable: '',
      estado: 'Pendiente',
      prioridad: 'Media',
      fechaInicio: new Date().toISOString().split('T')[0],
      fechaFin: new Date().toISOString().split('T')[0],
      progreso: 0,
      presupuesto: 0,
      presupuestoUtilizado: 0,
      riesgosAsociados: 0,
      miembrosEquipo: [],
      departamento: '',
      notas: '',
      historial: []
    };
  }

  private inicializarGraficas() {
    // Gráfica de estados
    this.chartDataEstados = {
      labels: ['En Progreso', 'Completados', 'Pendientes', 'Atrasados'],
      datasets: [{
        data: [
          this.stats.activos,
          this.stats.completados,
          this.stats.pendientes,
          this.stats.atrasados
        ],
        backgroundColor: ['#3B82F6', '#22C55E', '#EAB308', '#EF4444'],
        hoverBackgroundColor: ['#2563EB', '#16A34A', '#CA8A04', '#DC2626']
      }]
    };

    this.chartOptionsEstados = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#64748B',
            font: { size: 12 },
            padding: 15,
            usePointStyle: true
          }
        }
      },
      cutout: '65%'
    };

    // Gráfica de presupuesto
    this.chartDataPresupuesto = {
      labels: ['Presupuesto Total', 'Presupuesto Utilizado'],
      datasets: [{
        label: 'Presupuesto',
        data: [this.stats.presupuestoTotal, this.stats.presupuestoUtilizado],
        backgroundColor: ['#3B82F6', '#22C55E'],
        borderColor: ['#2563EB', '#16A34A'],
        borderWidth: 2
      }]
    };

    this.chartOptionsPresupuesto = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value: any) {
              return '$' + value.toLocaleString();
            }
          }
        }
      }
    };
  }
}