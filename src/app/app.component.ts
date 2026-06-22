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
  
  paisSeleccionado: string = 'TODOS';
  cargando = true;

  constructor(private fb: FormBuilder, private futbolService: FutbolService) {
    this.formularioFiltro = this.fb.group({
      buscarClub: ['']
    });
  }

  ngOnInit(): void {
    this.futbolService.obtenerPartidosDeHoy().subscribe({
      next: (res) => {
        const listaRaw = res.response || [];
        
        // Mapeamos los objetos anidados de la API a nuestra estructura plana
        this.partidosGlobales = listaRaw.map((item: any) => ({
          id: item.fixture.id,
          local: item.teams.home.name,
          visitante: item.teams.away.name,
          escudo_local: item.teams.home.logo,
          escudo_visitante: item.teams.away.logo,
          goles_local: item.goals.home,
          goles_visitante: item.goals.away,
          estado: item.fixture.status.short === 'FT' ? 'Final' : (item.fixture.status.elapsed ? `${item.fixture.status.elapsed}'` : 'Hoy'),
          liga: item.league.name,
          pais: item.league.country
        }));

        this.partidosFiltrados = this.partidosGlobales;
        this.agruparPartidosPorLiga();
        this.cargando = false;
        this.escucharBuscadorReactivo();
      },
      error: (err) => {
        console.error('Error de red al conectar con API-Sports:', err);
        this.cargando = false;
      }
    });
  }

  escucharBuscadorReactivo(): void {
    this.formularioFiltro.valueChanges
      .pipe(
        startWith({ buscarClub: '' }),
        debounceTime(150)
      )
      .subscribe(({ buscarClub }) => {
        const texto = buscarClub || '';
        this.filtrarTodo(texto);
      });
  }

  filtrarPorPais(pais: string): void {
    this.paisSeleccionado = pais;
    const textoActual = this.formularioFiltro.get('buscarClub')?.value || '';
    this.filtrarTodo(textoActual);
  }

  filtrarTodo(buscarClub: string): void {
    this.partidosFiltrados = this.partidosGlobales.filter(p => {
      const coincideClub = p.local.toLowerCase().includes(buscarClub.toLowerCase()) || 
                           p.visitante.toLowerCase().includes(buscarClub.toLowerCase());
      
      let coincidePais = false;
      const paisLower = p.pais.toLowerCase();

      if (this.paisSeleccionado === 'TODOS') {
        coincidePais = true;
      } else if (this.paisSeleccionado === 'Argentina') {
        coincidePais = paisLower === 'argentina';
      } else if (this.paisSeleccionado === 'England') {
        coincidePais = paisLower === 'england';
      } else if (this.paisSeleccionado === 'Spain') {
        coincidePais = paisLower === 'spain';
      } else if (this.paisSeleccionado === 'Sudamerica') {
        coincidePais = ['brazil', 'colombia', 'chile', 'ecuador', 'uruguay', 'paraguay', 'venezuela', 'peru', 'bolivia'].includes(paisLower);
      }

      return coincideClub && coincidePais;
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