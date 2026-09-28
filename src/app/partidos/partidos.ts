import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FutbolService } from '../services/futbol.service';
import { FavoritosService, Favorito } from '../services/favoritos.service';
import { PartidoFormateado, LigaAgrupada } from '../models/futbol.model';
import { ComentariosComponent } from '../comentarios/comentarios';
import { debounceTime, startWith } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Auth, user } from '@angular/fire/auth';

@Component({
  selector: 'app-partidos',
  standalone: true,
  imports: [ReactiveFormsModule, ComentariosComponent],
  templateUrl: './partidos.html',
  styles: []
})
export class PartidosComponent implements OnInit {
  private favoritosService = inject(FavoritosService);
  private auth = inject(Auth);
  
  usuarioLogueado: boolean = false;
  
  formularioFiltro: FormGroup;
  partidosGlobales: PartidoFormateado[] = [];
  partidosFiltrados: PartidoFormateado[] = [];
  
  clavesLigas: string[] = [];
  bloquesLigas: { [key: string]: LigaAgrupada } = {};
  
  continenteSeleccionado: string = 'TODOS';
  estadoSeleccionado: string = 'TODOS';
  cargando = true;
  
  nombresEquiposFavoritos: string[] = [];
  nombresLigasFavoritas: string[] = [];
  filtroSoloFavoritosActivo: boolean = false;

  private mapaContinentes: { [key: string]: string } = {
    'argentina': 'AMERICA', 'brazil': 'AMERICA', 'colombia': 'AMERICA', 'chile': 'AMERICA', 
    'peru': 'AMERICA', 'uruguay': 'AMERICA', 'ecuador': 'AMERICA', 'usa': 'AMERICA', 
    'mexico': 'AMERICA', 'paraguay': 'AMERICA', 'venezuela': 'AMERICA', 'bolivia': 'AMERICA',
    'canada': 'AMERICA', 'costa-rica': 'AMERICA', 'jamaica': 'AMERICA', 'honduras': 'AMERICA',
    'england': 'EUROPA', 'spain': 'EUROPA', 'italy': 'EUROPA', 'germany': 'EUROPA', 
    'france': 'EUROPA', 'portugal': 'EUROPA', 'netherlands': 'EUROPA', 'belgium': 'EUROPA',
    'scotland': 'EUROPA', 'turkey': 'EUROPA', 'greece': 'EUROPA', 'sweden': 'EUROPA',
    'switzerland': 'EUROPA', 'austria': 'EUROPA', 'denmark': 'EUROPA', 'croatia': 'EUROPA',
    'egypt': 'AFRICA', 'morocco': 'AFRICA', 'tunisia': 'AFRICA', 'senegal': 'AFRICA', 
    'nigeria': 'AFRICA', 'algeria': 'AFRICA', 'cameroon': 'AFRICA', 'ghana': 'AFRICA',
    'south-africa': 'AFRICA', 'ivory-coast': 'AFRICA', 'mali': 'AFRICA',
    'japan': 'ASIA', 'south-korea': 'ASIA', 'saudi-arabia': 'ASIA', 'china': 'ASIA',
    'australia': 'OCEANIA', 'new-zealand': 'OCEANIA', 'india': 'ASIA', 'qatar': 'ASIA',
    'iran': 'ASIA', 'iraq': 'ASIA', 'uae': 'ASIA'
  };

  constructor(private fb: FormBuilder, private futbolService: FutbolService) {
    this.formularioFiltro = this.fb.group({
      buscarClub: ['']
    });
  }

  ngOnInit(): void {
    // 1. Iniciamos el buscador reactivo
    this.escucharBuscador();

    // 2. Monitoreamos la sesión de usuario en paralelo
    user(this.auth).subscribe(firebaseUser => {
      this.usuarioLogueado = !!firebaseUser;
      
      if (this.usuarioLogueado) {
        this.favoritosService.getFavoritos().subscribe((favs: Favorito[]) => {
          this.nombresEquiposFavoritos = favs
            .filter(f => f.tipo.toLowerCase() === 'equipo')
            .map(f => f.nombre.toLowerCase().trim());

          this.nombresLigasFavoritas = favs
            .filter(f => f.tipo.toLowerCase() === 'liga')
            .map(f => f.nombre.toLowerCase().trim());

          // Si ya tenemos partidos cargados, refrescamos el filtrado con los favoritos
          if (this.partidosGlobales.length > 0) {
            this.filtrarTodo();
          }
        });
      } else {
        this.nombresEquiposFavoritos = [];
        this.nombresLigasFavoritas = [];
        if (this.continenteSeleccionado === 'FAVORITOS') {
          this.continenteSeleccionado = 'TODOS';
        }
        if (this.partidosGlobales.length > 0) {
          this.filtrarTodo();
        }
      }
    });

    // 3. Cargamos los partidos principales obligatoriamente al iniciar
    this.cargando = true;
    this.futbolService.obtenerPartidosDeHoy().subscribe({
      next: (res: any) => {
        const listaRaw = res.response || [];
        
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

        // Forzamos el pintado inmediato de los partidos en pantalla
        this.filtrarTodo();
        this.cargando = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al conectar con la API:', err);
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
      .subscribe(() => {
        this.filtroSoloFavoritosActivo = false;
        this.filtrarTodo();
      });
  }

  cambiarFiltroRegion(region: string): void {
    this.continenteSeleccionado = region;
    this.filtroSoloFavoritosActivo = false;
    this.filtrarTodo();
  }

  cambiarFiltroEstado(estado: string): void {
    this.estadoSeleccionado = estado;
    this.filtrarTodo();
  }

  verFavoritosGuardados(): void {
    if (!this.usuarioLogueado) return;
    this.continenteSeleccionado = 'FAVORITOS';
    this.filtroSoloFavoritosActivo = true;
    this.formularioFiltro.patchValue({ buscarClub: '' }, { emitEvent: false });
    this.filtrarTodo();
  }

  filtrarTodo(): void {
    const buscarClub = (this.formularioFiltro.get('buscarClub')?.value || '').toLowerCase().trim();

    this.partidosFiltrados = this.partidosGlobales.filter(p => {
      if (this.filtroSoloFavoritosActivo) {
        const esFavEquipo = this.nombresEquiposFavoritos.some(fav => 
          p.local.toLowerCase().includes(fav) || p.visitante.toLowerCase().includes(fav)
        );
        const esFavLiga = this.nombresLigasFavoritas.some(fav => 
          p.liga.toLowerCase().includes(fav)
        );
        if (!esFavEquipo && !esFavLiga) return false;
      }

      const localLower = p.local.toLowerCase();
      const visitanteLower = p.visitante.toLowerCase();

      const coincideClub = buscarClub === '' || localLower.includes(buscarClub) || visitanteLower.includes(buscarClub);
      if (!coincideClub) return false;

      if (this.continenteSeleccionado !== 'TODOS' && this.continenteSeleccionado !== 'FAVORITOS') {
        if (this.continenteSeleccionado === 'MUNDIAL') {
          if (p.tipo !== 'Mundial' && p.tipo !== 'Copa') return false;
        } else {
          const paisClean = p.pais.toLowerCase().trim();
          const continenteAsignado = this.mapaContinentes[paisClean];
          if (continenteAsignado !== this.continenteSeleccionado) return false;
        }
      }

      if (this.estadoSeleccionado === 'EN_VIVO') {
        const esEnVivo = p.estado.includes("'") || (p.estado !== 'Final' && p.estado !== 'Prox' && p.estado !== 'Hoy');
        if (!esEnVivo) return false;
      } else if (this.estadoSeleccionado === 'FINALIZADOS') {
        if (p.estado !== 'Final') return false;
      } else if (this.estadoSeleccionado === 'PROXIMOS') {
        if (p.estado !== 'Prox' && p.estado !== 'Hoy') return false;
      }

      return true;
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

  esEquipoFavorito(nombreEquipo: string): boolean {
    if (!this.usuarioLogueado) return false;
    const nombreClean = nombreEquipo.toLowerCase().trim();
    return this.nombresEquiposFavoritos.some(fav => nombreClean.includes(fav) || fav.includes(nombreClean));
  }

  esLigaFavorita(nombreLiga: string): boolean {
    if (!this.usuarioLogueado) return false;
    const nombreClean = nombreLiga.toLowerCase().trim();
    return this.nombresLigasFavoritas.some(fav => nombreClean.includes(fav) || fav.includes(nombreClean));
  }
}