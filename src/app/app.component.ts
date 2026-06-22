import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FutbolService } from './services/futbol.service';
import { Match } from './models/futbol.model';
import { debounceTime, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements OnInit {
  formularioFiltro: FormGroup;
  todosLosPartidos: Match[] = [];
  partidosFiltrados: Match[] = [];
  ligasAgrupadas: { [key: string]: { nombre: string; area: string; logo: string; partidos: Match[] } } = {};
  clavesLigas: string[] = [];
  
  vistaActual: 'TODOS' | 'VIVO' = 'TODOS';
  cargando = true;
  errorApi = false;

  constructor(private fb: FormBuilder, private futbolService: FutbolService) {
    this.formularioFiltro = this.fb.group({
      busquedaClub: [''],
      paisSeleccionado: ['todos']
    });
  }

  ngOnInit(): void {
    this.futbolService.obtenerPartidosDelDia().subscribe({
      next: (data) => {
        this.todosLosPartidos = data.matches || [];
        this.partidosFiltrados = this.todosLosPartidos;
        this.agruparPartidosPorLiga();
        this.cargando = false;
        this.escucharFiltros();
      },
      error: (err) => {
        console.error('Error al consumir la API real:', err);
        this.cargando = false;
        this.errorApi = true;
      }
    });
  }

  cambiarVista(tipo: 'TODOS' | 'VIVO') {
    this.vistaActual = tipo;
    this.filtrarYAgrupar();
  }

  escucharFiltros() {
    this.formularioFiltro.valueChanges
      .pipe(debounceTime(200))
      .subscribe(() => {
        this.filtrarYAgrupar();
      });
  }

  filtrarYAgrupar() {
    const { busquedaClub, paisSeleccionado } = this.formularioFiltro.value;

    this.partidosFiltrados = this.todosLosPartidos.filter(partido => {
      // Filtro de Todos / En Vivo
      const cumpleEstado = this.vistaActual === 'TODOS' || 
                           partido.status === 'IN_PLAY' || 
                           partido.status === 'LIVE';

      // Filtro de búsqueda por club
      const cumpleClub = partido.homeTeam.name.toLowerCase().includes(busquedaClub.toLowerCase()) ||
                          partido.awayTeam.name.toLowerCase().includes(busquedaClub.toLowerCase());

      // Filtro por continente/país de la competición
      const cumplePais = paisSeleccionado === 'todos' || 
                         partido.competition.area.name.toLowerCase() === paisSeleccionado.toLowerCase();

      return cumpleEstado && cumpleClub && cumplePais;
    });

    this.agruparPartidosPorLiga();
  }

  agruparPartidosPorLiga() {
    const agrupado: { [key: string]: { nombre: string; area: string; logo: string; partidos: Match[] } } = {};

    this.partidosFiltrados.forEach(partido => {
      const ligaId = partido.competition.id.toString();
      if (!agrupado[ligaId]) {
        agrupado[ligaId] = {
          nombre: partido.competition.name,
          area: partido.competition.area.name,
          logo: partido.competition.emblem || '',
          partidos: []
        };
      }
      agrupado[ligaId].partidos.push(partido);
    });

    this.ligasAgrupadas = agrupado;
    this.clavesLigas = Object.keys(agrupado);
  }

  transformarEstado(status: string, fechaUtc: string): string {
    if (status === 'FINISHED') return 'Final';
    if (status === 'IN_PLAY' || status === 'LIVE') return 'Vivo';
    // Si no empezó, extrae la hora local del partido
    const fecha = new Date(fechaUtc);
    return fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}