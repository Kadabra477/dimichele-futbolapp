import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FutbolService } from './services/futbol.service';
import { PartidoFormateado, LigaAgrupada } from './models/futbol.model';
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
  partidosGlobales: PartidoFormateado[] = [];
  partidosFiltrados: PartidoFormateado[] = [];
  
  clavesLigas: string[] = [];
  bloquesLigas: { [key: string]: LigaAgrupada } = {};
  
  continenteSeleccionado: string = 'TODOS';
  cargando = true;

  private mapaContinentes: { [key: string]: string } = {
    'argentina': 'AMERICA', 'brazil': 'AMERICA', 'colombia': 'AMERICA', 'chile': 'AMERICA', 
    'peru': 'AMERICA', 'uruguay': 'AMERICA', 'ecuador': 'AMERICA', 'usa': 'AMERICA', 
    'mexico': 'AMERICA', 'paraguay': 'AMERICA', 'venezuela': 'AMERICA', 'bolivia': 'AMERICA',
    'england': 'EUROPA', 'spain': 'EUROPA', 'italy': 'EUROPA', 'germany': 'EUROPA', 
    'france': 'EUROPA', 'portugal': 'EUROPA', 'netherlands': 'EUROPA', 'belgium': 'EUROPA',
    'egypt': 'AFRICA', 'morocco': 'AFRICA', 'tunisia': 'AFRICA', 'senegal': 'AFRICA', 'nigeria': 'AFRICA',
    'australia': 'OCEANIA', 'new-zealand': 'OCEANIA',
    'japan': 'ASIA', 'south-korea': 'ASIA', 'saudi-arabia': 'ASIA', 'china': 'ASIA'
  };

  constructor(private fb: FormBuilder, private futbolService: FutbolService) {
    this.formularioFiltro = this.fb.group({
      buscarClub: ['']
    });
  }

  ngOnInit(): void {
    this.futbolService.obtenerPartidosDeHoy().subscribe({
      next: (res) => {
        // Obtenemos estrictamente lo que devuelve el servidor externo
        const listaRaw = res.response || [];
        console.log('--- DATA PURA DESDE LA API ---', listaRaw);
        
        this.partidosGlobales = listaRaw.map((item: any) => {
          const ligaNombre = item.league.name.toLowerCase();
          let tipoPartido: 'Copa' | 'Liga' | 'Mundial' = 'Liga';

          if (ligaNombre.includes('champions') || ligaNombre.includes('libertadores') || ligaNombre.includes('sudamericana') || ligaNombre.includes('europa league')) {
            tipoPartido = 'Copa';
          } else if (item.league.country.toLowerCase() === 'world') {
            tipoPartido = 'Mundial';
          }

          let estadoVisual = 'Hoy';
          if (item.fixture.status.short === 'FT') {
            estadoVisual = 'Final';
          } else if (item.fixture.status.short === 'NS') {
            estadoVisual = 'Prox';
          } else if (item.fixture.status.elapsed) {
            estadoVisual = `${item.fixture.status.elapsed}'`;
          } else {
            estadoVisual = item.fixture.status.short;
          }

          return {
            id: item.fixture.id,
            local: item.teams.home.name,
            visitante: item.teams.away.name,
            escudo_local: item.teams.home.logo,
            escudo_visitante: item.teams.away.logo,
            goles_local: item.goals.home,
            goles_visitante: item.goals.away,
            estado: estadoVisual,
            liga: item.league.name,
            pais: item.league.country,
            tipo: tipoPartido
          };
        });

        this.filtrarTodo();
        this.cargando = false;
        this.escucharBuscador();
      },
      error: (err) => {
        console.error('El servidor rechazó la conexión o falta activar el botón de CORS Anywhere:', err);
        this.cargando = false;
      }
    });
  }

  escucharBuscador(): void {
    this.formularioFiltro.valueChanges
      .pipe(
        startWith({ buscarClub: '' }),
        debounceTime(150)
      )
      .subscribe(() => this.filtrarTodo());
  }

  cambiarFiltroRegion(region: string): void {
    this.continenteSeleccionado = region;
    this.filtrarTodo();
  }

  filtrarTodo(): void {
    const buscarClub = (this.formularioFiltro.get('buscarClub')?.value || '').toLowerCase();

    this.partidosFiltrados = this.partidosGlobales.filter(p => {
      const coincideClub = p.local.toLowerCase().includes(buscarClub) || 
                           p.visitante.toLowerCase().includes(buscarClub);
      
      if (!coincideClub && buscarClub !== '') { // Mantenemos la lógica de consistencia
        if (!p.local.toLowerCase().includes(buscarClub) && !p.visitante.toLowerCase().includes(buscarClub)) {
          return false;
        }
      }

      if (this.continenteSeleccionado === 'TODOS') return true;

      if (this.continenteSeleccionado === 'MUNDIAL') {
        return p.tipo === 'Mundial' || p.tipo === 'Copa';
      }

      const paisClean = p.pais.toLowerCase().trim();
      const continenteAsignado = this.mapaContinentes[paisClean];

      if (!continenteAsignado) {
        return this.continenteSeleccionado === 'EUROPA'; 
      }
      
      return continenteAsignado === this.continenteSeleccionado;
    });

    this.agruparPartidosPorLiga();
  }

  agruparPartidosPorLiga(): void {
    const mapas: { [key: string]: LigaAgrupada } = {};

    this.partidosFiltrados.forEach(p => {
      const claveUnica = p.liga.replace(/\s+/g, '_').toLowerCase();
      if (!mapas[claveUnica]) {
        mapas[claveUnica] = {
          nombreLiga: p.liga,
          paisZona: p.pais,
          partidos: []
        };
      }
      mapas[claveUnica].partidos.push(p);
    });

    this.bloquesLigas = mapas;
    this.clavesLigas = Object.keys(mapas);
  }
}