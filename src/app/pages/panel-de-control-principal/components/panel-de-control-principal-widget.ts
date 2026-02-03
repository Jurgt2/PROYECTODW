import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { RiesgosService, Riesgo } from '../../service/riesgos.service';
import { ProyectosService } from '../../service/proyectos.service';
import { UsuariosService } from '../../service/usuarios.service';

@Component({
  standalone: true,
  selector: 'app-panel-de-control-principal-widget',
  imports: [CommonModule, ChartModule],
  templateUrl: './panel-de-control-principal-widget.component.html',
  styleUrls: ['./panel-de-control-principal-widget.component.css']
})
export class PanelDeControlPrincipalWidget implements OnInit {
  
  exportarExcel() {
    const data = [
      { 'Total de Riesgos': this.totalRiesgos },
      { 'Riesgos Críticos': this.riesgosCriticos },
      { 'Riesgos Mitigados': this.riesgosMitigados },
      { 'Cambios Recientes': this.cambiosRecientes },
      { 'Proyectos Activos': this.proyectosActivos },
      { 'Usuarios Activos': this.usuariosActivos },
      { 'Total Usuarios': this.totalUsuarios }
    ];
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'Métricas': worksheet }, SheetNames: ['Métricas'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'metricas-panel-control.xlsx');
  }

  // ========== PROPIEDADES ==========
  fechaActual = new Date();
  
  // Estadísticas dinámicas desde el servicio
  totalRiesgos = 0;
  riesgosCriticos = 0;
  riesgosMitigados = 0;
  cambiosRecientes = 0;
  proyectosActivos = 0;
  totalUsuarios = 0;
  usuariosActivos = 0;
  
  // ========== PROPIEDADES PARA LAS GRÁFICAS ==========
  
  // Gráfica de Distribución (Dona)
  chartDataDistribucion: any;
  chartOptionsDistribucion: any;
  
  // Gráfica de Tendencia (Línea)
  chartDataTendencia: any;
  chartOptionsTendencia: any;

  constructor(
    private riesgosService: RiesgosService,
    private proyectosService: ProyectosService,
    private usuariosService: UsuariosService
  ) { }

  ngOnInit(): void {
    // Cargar datos iniciales
    this.actualizarEstadisticas();
    this.inicializarGraficaDistribucion();
    this.inicializarGraficaTendencia();
    
    // Suscribirse a cambios en riesgos para actualizar en tiempo real
    this.riesgosService.riesgos$.subscribe(() => {
      this.actualizarEstadisticas();
      this.inicializarGraficaDistribucion();
      this.inicializarGraficaTendencia();
    });
  }

  actualizarEstadisticas() {
    // Obtener riesgos del servicio
    this.riesgosService.getRiesgos().subscribe((riesgos: Riesgo[]) => {
      this.totalRiesgos = riesgos.length;
      
      // Riesgos Críticos: nivel de impacto "Muy Alto" que NO están mitigados
      this.riesgosCriticos = riesgos.filter((r: Riesgo) => 
        r.nivelImpacto === 'Muy Alto' && r.estado !== 'Mitigado' && r.estado !== 'Cerrado'
      ).length;
      
      // Riesgos Mitigados
      this.riesgosMitigados = riesgos.filter((r: Riesgo) => r.estado === 'Mitigado').length;
      
      // Calcular cambios recientes (últimos 7 días)
      const hace7Dias = new Date();
      hace7Dias.setDate(hace7Dias.getDate() - 7);
      
      this.cambiosRecientes = riesgos.filter((r: Riesgo) => {
        const fechaIdentificacion = new Date(r.fechaIdentificacion);
        return fechaIdentificacion >= hace7Dias;
      }).length;
    });
  }

  // ========== MÉTODO PARA GRÁFICA DE DISTRIBUCIÓN (DONA) ==========
  inicializarGraficaDistribucion() {
    this.riesgosService.getRiesgos().subscribe((riesgos: Riesgo[]) => {
      // Contar riesgos por nivel
      const criticos = riesgos.filter((r: Riesgo) => r.nivel === 'Critico' || r.nivel === 'Muy Alto').length;
      const altos = riesgos.filter((r: Riesgo) => r.nivel === 'Alto').length;
      const medios = riesgos.filter((r: Riesgo) => r.nivel === 'Medio').length;
      const bajos = riesgos.filter((r: Riesgo) => r.nivel === 'Bajo').length;
      
      // Configuración de los datos
      this.chartDataDistribucion = {
        labels: ['Críticos', 'Altos', 'Medios', 'Bajos'],
        datasets: [
          {
            data: [criticos, altos, medios, bajos],
            backgroundColor: [
              '#EF4444', // Rojo para Críticos
              '#F97316', // Naranja para Altos
              '#EAB308', // Amarillo para Medios
              '#22C55E'  // Verde para Bajos
            ],
            hoverBackgroundColor: [
              '#DC2626', 
              '#EA580C', 
              '#CA8A04', 
              '#16A34A'
            ]
          }
        ]
      };

      // Configuración de opciones
      this.chartOptionsDistribucion = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#64748B',
              font: {
                size: 13,
                weight: '500'
              },
              padding: 15,
              usePointStyle: true
            }
          },
          tooltip: {
            backgroundColor: '#1E293B',
            titleColor: '#F1F5F9',
            bodyColor: '#F1F5F9',
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function(context: any) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        },
        cutout: '65%'
      };
    });
  }

  // ========== MÉTODO PARA GRÁFICA DE TENDENCIA (LÍNEA) ==========
  inicializarGraficaTendencia() {
    this.riesgosService.getRiesgos().subscribe((riesgos: Riesgo[]) => {
      // Obtener los últimos 6 meses
      const fechaActual = new Date();
      const ultimos6Meses = [];
      
      for (let i = 5; i >= 0; i--) {
        const fecha = new Date(fechaActual);
        fecha.setMonth(fecha.getMonth() - i);
        ultimos6Meses.push({
          mes: fecha.toLocaleString('es-ES', { month: 'long' }),
          mesNumero: fecha.getMonth(),
          año: fecha.getFullYear()
        });
      }
      
      // Calcular riesgos por mes
      const riesgosPorMes = ultimos6Meses.map(periodo => {
        return riesgos.filter((r: Riesgo) => {
          const fechaRiesgo = new Date(r.fechaIdentificacion);
          return fechaRiesgo.getMonth() === periodo.mesNumero && 
                 fechaRiesgo.getFullYear() === periodo.año;
        }).length;
      });
      
      const mitigadosPorMes = ultimos6Meses.map(periodo => {
        return riesgos.filter((r: Riesgo) => {
          if (r.estado !== 'Mitigado') return false;
          const fechaRiesgo = new Date(r.fechaIdentificacion);
          return fechaRiesgo.getMonth() === periodo.mesNumero && 
                 fechaRiesgo.getFullYear() === periodo.año;
        }).length;
      });
      
      // Configuración de los datos
      this.chartDataTendencia = {
        labels: ultimos6Meses.map(m => m.mes.charAt(0).toUpperCase() + m.mes.slice(1)),
        datasets: [
          {
            label: 'Riesgos Identificados',
            data: riesgosPorMes,
            fill: false,
            borderColor: '#EF4444',
            tension: 0.4,
            backgroundColor: '#EF4444',
            pointBackgroundColor: '#EF4444',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#EF4444',
            pointRadius: 4,
            pointHoverRadius: 6
          },
          {
            label: 'Riesgos Mitigados',
            data: mitigadosPorMes,
            fill: false,
            borderColor: '#22C55E',
            tension: 0.4,
            backgroundColor: '#22C55E',
            pointBackgroundColor: '#22C55E',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#22C55E',
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      };

      // Opciones de la gráfica
      this.chartOptionsTendencia = {
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              color: '#495057',
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#495057',
              stepSize: 5
            },
            grid: {
              color: '#ebedef',
              drawBorder: false
            }
          },
          x: {
            ticks: {
              color: '#495057'
            },
            grid: {
              color: '#ebedef',
              drawBorder: false
            }
          }
        },
        responsive: true,
        maintainAspectRatio: true,
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        }
      };
    });
  }
}