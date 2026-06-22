import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FutbolService } from './services/futbol.service';
import { PartidoReal } from './models/futbol.model';
import { debounceTime, startWith } from 'rxjs/operators';

interface LigaAgrupada {
  nombre: string;
  pais: string;
  logo: string;
  partidos: PartidoReal[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements OnInit {
  formularioBusqueda: FormGroup;
  listaPartidosGlobal: PartidoReal[] = [];
  partidosFiltrados: PartidoReal[] = [];
  
  // Diccionario para armar las cajas estilo Promiedos
  bloquesLigas: { [key: string]: LigaAgrupada } = {};
  clavesLigas: string[] = [];
  
  categoriaSeleccionada: string = 'TODOS';
  estadoSeleccionado: 'TODOS' | 'VIVO' = 'TODOS';
  cargando = true;

  constructor(private fb: FormBuilder, private futbolService: FutbolService) {
    this.formularioBusqueda = this.fb.group({
      filtroClub: ['']
    });
  }

  ngOnInit(): void {
    this.futbolService.obtenerPartidosDeHoy().subscribe({
      next: (data) => {
        // Leemos la data real que viene del servidor externo de hoy
        this.listaPartidosGlobal = data.partidos || [];
        this.partidosFiltrados = this.listaPartidosGlobal;
        
        this.procesarYAgruparBloques();
        this.cargando = false;
        this.inicializarEscuchaReactiva();
      },
      error: (err) => {
        console.error('Error al mapear la API pública de fútbol:', err);
        this.cargando = false;
      }
    });
  }

  inicializarEscuchaReactiva(): void {
    this.formularioBusqueda.valueChanges
      .pipe(
        startWith({ filtroClub: '' }),
        debounceTime(150)
      )
      .subscribe(() => {
        this.filtrarResultados();
      });
  }

  cambiarPaisFiltro(pais: string): void {
    this.categoriaSeleccionada = pais;
    this.filtrarResultados();
  }

  cambiarEstadoFiltro(estado: 'TODOS' | 'VIVO'): void {
    this.estadoSeleccionado = estado;
    this.filtrarResultados();
  }

  filtrarResultados(): void {
    const { filtroClub } = this.formularioBusqueda.value;

    this.partidosFiltrados = this.listaPartidosGlobal.filter(p => {
      const coincideClub = p.local.toLowerCase().includes(filtroClub.toLowerCase()) || 
                           p.visitante.toLowerCase().includes(filtroClub.toLowerCase());
      
      const coincidePais = this.categoriaSeleccionada === 'TODOS' || 
                           p.pais.toLowerCase() === this.categoriaSeleccionada.toLowerCase();
      
      const coincideEstado = this.estadoSeleccionado === 'TODOS' || 
                             p.estado.toLowerCase() === 'vivo';

      return coincideClub && coincidePais && coincideEstado;
    });

    this.procesarYAgruparBloques();
  }

  procesarYAgruparBloques(): void {
    const mapas: { [key: string]: LigaAgrupada } = {};

    this.partidosFiltrados.forEach(p => {
      // Agrupamos bajo una clave única combinando país y liga para precisión absoluta
      const idLiga = `${p.pais}_${p.liga}`.replace(/\s+/g, '_').toLowerCase();
      
      if (!mapas[idLiga]) {
        mapas[idLiga] = {
          nombre: p.liga,
          pais: p.pais,
          logo: p.logo_liga || '',
          partidos: []
        };
      }
      mapas[idLiga].partidos.push(p);
    });

    this.bloquesLigas = mapas;
    this.clavesLigas = Object.keys(mapas);
  }
}