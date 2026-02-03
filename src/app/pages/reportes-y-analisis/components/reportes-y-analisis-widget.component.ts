
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ChartModule } from 'primeng/chart';
import { InputTextModule } from 'primeng/inputtext';
import { RiesgosService, Riesgo } from '../../service/riesgos.service';

interface EstadisticasRiesgos {
  total: number;
  criticos: number;
  altos: number;
  medios: number;
  bajos: number;
  mitigados: number;
  resueltos: number;
  activos: number;
}

@Component({
  selector: 'app-reportes-y-analisis-widget',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    TagModule,
    SelectModule,
    TooltipModule,
    DialogModule,
    ChartModule,
    InputTextModule
  ],
  templateUrl: './reportes-y-analisis-widget.component.html',
  styleUrls: ['./reportes-y-analisis-widget.component.css']
})
export class ReportesYAnalisisWidget implements OnInit {

  riesgos: Riesgo[] = [];
  riesgosFiltrados: Riesgo[] = [];
  editRowId: string | null = null;
  editedRiesgo: Partial<Riesgo> = {};
  
  statsRiesgos: EstadisticasRiesgos = {
    total: 0,
    criticos: 0,
    altos: 0,
    medios: 0,
    bajos: 0,
    mitigados: 0,
    resueltos: 0,
    activos: 0
  };

  // Filtros
  filtroProyecto: string = '';
  filtroNivel: string = '';
  filtroCategoria: string = '';
  filtroEstado: string = '';
  busquedaGlobal: string = '';

  // Opciones de filtros
  proyectosDisponibles = [
    { label: 'Todos los proyectos', value: '' },
    { label: 'Migración Cloud', value: 'Migración Cloud' },
    { label: 'App Móvil', value: 'App Móvil' },
    { label: 'Sistema CRM', value: 'Sistema CRM' },
    { label: 'Plataforma E-learning', value: 'Plataforma E-learning' },
    { label: 'Portal Web', value: 'Portal Web' }
  ];

  nivelesRiesgo = [
    { label: 'Todos los niveles', value: '' },
    { label: 'Crítico', value: 'Crítico' },
    { label: 'Alto', value: 'Alto' },
    { label: 'Medio', value: 'Medio' },
    { label: 'Bajo', value: 'Bajo' }
  ];

  categoriasRiesgo = [
    { label: 'Todas las categorías', value: '' },
    { label: 'Técnico', value: 'Técnico' },
    { label: 'Operacional', value: 'Operacional' },
    { label: 'Financiero', value: 'Financiero' },
    { label: 'Legal', value: 'Legal' },
    { label: 'Reputacional', value: 'Reputacional' },
    { label: 'Estratégico', value: 'Estratégico' }
  ];

  estadosRiesgo = [
    { label: 'Todos los estados', value: '' },
    { label: 'Activo', value: 'Activo' },
    { label: 'Mitigado', value: 'Mitigado' },
    { label: 'En Revisión', value: 'En Revisión' },
    { label: 'Cerrado', value: 'Cerrado' }
  ];

  // Gráficas
  chartDataNiveles: any;
  chartOptionsNiveles: any;
  chartDataCategorias: any;
  chartOptionsCategorias: any;
  chartDataEstados: any;
  chartOptionsEstados: any;
  chartDataTendencia: any;
  chartOptionsTendencia: any;

  // Diálogo
  mostrarDialogDetalle: boolean = false;
  riesgoSeleccionado: Riesgo | null = null;

  constructor(private riesgosService: RiesgosService) {}

  ngOnInit(): void {
    this.riesgosService.riesgos$.subscribe(riesgos => {
      this.riesgos = riesgos;
      this.aplicarFiltros();
      this.calcularEstadisticas();
      this.inicializarGraficas();
    });
  }

  aplicarFiltros(): void {
    this.riesgosFiltrados = this.riesgos.filter(riesgo => {
      const coincideProyecto = !this.filtroProyecto || riesgo.proyecto === this.filtroProyecto;
      const coincideNivel = !this.filtroNivel || riesgo.nivel === this.filtroNivel;
      const coincideCategoria = !this.filtroCategoria || riesgo.categoria === this.filtroCategoria;
      const coincideEstado = !this.filtroEstado || riesgo.estado === this.filtroEstado;
      
      return coincideProyecto && coincideNivel && coincideCategoria && coincideEstado;
    });

    this.calcularEstadisticas();
    this.inicializarGraficas();
  }

  aplicarBusquedaGlobal(event: any): void {
    const valor = event.target.value.toLowerCase();
    this.riesgosFiltrados = this.riesgos.filter(riesgo => 
      riesgo.id.toLowerCase().includes(valor) ||
      riesgo.descripcion.toLowerCase().includes(valor) ||
      riesgo.proyecto.toLowerCase().includes(valor) ||
      riesgo.categoria.toLowerCase().includes(valor) ||
      riesgo.responsable.toLowerCase().includes(valor)
    );
  }

  calcularEstadisticas(): void {
    this.statsRiesgos = {
      total: this.riesgosFiltrados.length,
      criticos: this.riesgosFiltrados.filter(r => r.nivel === 'Crítico').length,
      altos: this.riesgosFiltrados.filter(r => r.nivel === 'Alto').length,
      medios: this.riesgosFiltrados.filter(r => r.nivel === 'Medio').length,
      bajos: this.riesgosFiltrados.filter(r => r.nivel === 'Bajo').length,
      mitigados: this.riesgosFiltrados.filter(r => r.estado === 'Mitigado').length,
      resueltos: this.riesgosFiltrados.filter(r => r.estado === 'Cerrado').length,
      activos: this.riesgosFiltrados.filter(r => r.estado === 'Activo').length
    };
  }


  verDetalleRiesgo(riesgo: Riesgo): void {
    this.riesgoSeleccionado = { ...riesgo };
    this.mostrarDialogDetalle = true;
  }

  editarRiesgo(riesgo: Riesgo): void {
    this.editRowId = riesgo.id;
    this.editedRiesgo = { ...riesgo };
  }


  // Permite agregar una nueva fila editable al inicio de la tabla
  nuevoRiesgo(): void {
    const nuevoId = 'RISK-' + (Math.floor(Math.random() * 9000) + 1000);
    this.editedRiesgo = {
      id: nuevoId,
      proyecto: '',
      descripcion: '',
      categoria: undefined,
      probabilidad: undefined,
      impacto: undefined,
      nivel: undefined,
      estado: undefined,
      responsable: '',
    };
    this.editRowId = nuevoId;
    this.riesgosFiltrados = [
      { ...(this.editedRiesgo as any) },
      ...this.riesgosFiltrados
    ];
  }

  cancelarEdicion(): void {
    this.editRowId = null;
    this.editedRiesgo = {};
  }

  guardarEdicion(): void {
    if (this.editRowId) {
      // Actualizar nivel automáticamente si probabilidad o impacto cambian
      if (this.editedRiesgo.probabilidad && this.editedRiesgo.impacto) {
        this.editedRiesgo.nivel = this.riesgosService.calcularNivel(
          this.editedRiesgo.probabilidad as string,
          this.editedRiesgo.impacto as string
        );
      }
      this.riesgosService.actualizarRiesgo(this.editedRiesgo as Riesgo);
      this.editRowId = null;
      this.editedRiesgo = {};
    }
  }

  getPorcentajeMitigados(): number {
    if (this.statsRiesgos.total === 0) return 0;
    return Math.round((this.statsRiesgos.mitigados / this.statsRiesgos.total) * 100);
  }

  getCategoriaConMasRiesgos(): string {
    const categorias = this.riesgosFiltrados.reduce((acc, r) => {
      acc[r.categoria] = (acc[r.categoria] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    let maxCategoria = 'N/A';
    let maxCount = 0;
    Object.entries(categorias).forEach(([cat, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxCategoria = cat;
      }
    });

    return maxCategoria;
  }

  getSeverityCategoria(categoria: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    const severityMap: Record<string, any> = {
      'Técnico': 'info',
      'Operacional': 'warn',
      'Financiero': 'danger',
      'Legal': 'secondary',
      'Reputacional': 'contrast',
      'Estratégico': 'success'
    };
    return severityMap[categoria] || 'secondary';
  }

  getSeverityProbabilidad(probabilidad: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    switch (probabilidad) {
      case 'Muy Alta': return 'danger';
      case 'Alta': return 'warn';
      case 'Media': return 'info';
      case 'Baja': return 'success';
      default: return 'secondary';
    }
  }

  getSeverityImpacto(impacto: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    switch (impacto) {
      case 'Crítico': return 'danger';
      case 'Alto': return 'warn';
      case 'Medio': return 'info';
      case 'Bajo': return 'success';
      default: return 'secondary';
    }
  }

  getSeverityNivel(nivel: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    switch (nivel) {
      case 'Crítico': return 'danger';
      case 'Alto': return 'warn';
      case 'Medio': return 'info';
      case 'Bajo': return 'success';
      default: return 'secondary';
    }
  }

  getSeverityEstado(estado: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    switch (estado) {
      case 'Cerrado': return 'success';
      case 'Mitigado': return 'info';
      case 'En Revisión': return 'warn';
      case 'Activo': return 'danger';
      default: return 'secondary';
    }
  }

  private inicializarGraficas(): void {
    // Gráfica de Niveles de Riesgo
    this.chartDataNiveles = {
      labels: ['Crítico', 'Alto', 'Medio', 'Bajo'],
      datasets: [{
        data: [
          this.statsRiesgos.criticos,
          this.statsRiesgos.altos,
          this.statsRiesgos.medios,
          this.statsRiesgos.bajos
        ],
        backgroundColor: ['#EF4444', '#F59E0B', '#3B82F6', '#10B981'],
        hoverBackgroundColor: ['#DC2626', '#D97706', '#2563EB', '#059669']
      }]
    };

    this.chartOptionsNiveles = {
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
      cutout: '60%'
    };

    // Gráfica de Categorías
    const categorias = this.riesgosFiltrados.reduce((acc, r) => {
      acc[r.categoria] = (acc[r.categoria] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.chartDataCategorias = {
      labels: Object.keys(categorias),
      datasets: [{
        label: 'Cantidad de Riesgos',
        data: Object.values(categorias),
        backgroundColor: '#3B82F6',
        borderColor: '#2563EB',
        borderWidth: 1
      }]
    };

    this.chartOptionsCategorias = {
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
            stepSize: 1
          }
        }
      }
    };

    // Gráfica de Estados
    const estados = this.riesgosFiltrados.reduce((acc, r) => {
      acc[r.estado] = (acc[r.estado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.chartDataEstados = {
      labels: Object.keys(estados),
      datasets: [{
        data: Object.values(estados),
        backgroundColor: ['#EF4444', '#F59E0B', '#3B82F6', '#10B981', '#8B5CF6'],
        hoverBackgroundColor: ['#DC2626', '#D97706', '#2563EB', '#059669', '#7C3AED']
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
      }
    };

    // Gráfica de Tendencia (simulada)
    this.chartDataTendencia = {
      labels: ['Ago 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dic 2025', 'Ene 2026'],
      datasets: [
        {
          label: 'Riesgos Identificados',
          data: [12, 15, 18, 20, 22, 25],
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Riesgos Mitigados',
          data: [5, 8, 10, 12, 15, 18],
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    };

    this.chartOptionsTendencia = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#64748B',
            font: { size: 12 },
            padding: 15,
            usePointStyle: true
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
  }
}
