import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FutbolService } from './services/futbol.service';
import { Competicion } from './models/futbol.model';
import { debounceTime, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements OnInit {
  formularioBusqueda: FormGroup;
  ligas: Competicion[] = [];
  ligasFiltradas: Competicion[] = [];
  ligaSeleccionada: Competicion | null = null;
  cargando = true;

  constructor(private fb: FormBuilder, private futbolService: FutbolService) {
    this.formularioBusqueda = this.fb.group({
      busqueda: [''],
      paisSeleccionado: ['todos'],
      tipoSeleccionado: ['todos']
    });
  }

  ngOnInit(): void {
    this.futbolService.obtenerLigas().subscribe({
      next: (datos) => {
        this.ligas = datos;
        this.ligasFiltradas = datos;
        // Seleccionamos la primera por defecto estilo Promiedos
        if (datos.length > 0) {
          this.ligaSeleccionada = datos[0];
        }
        this.cargando = false;
        this.configurarFiltros();
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  configurarFiltros(): void {
    this.formularioBusqueda.valueChanges
      .pipe(
        startWith({ busqueda: '', paisSeleccionado: 'todos', tipoSeleccionado: 'todos' }),
        debounceTime(150)
      )
      .subscribe(({ busqueda, paisSeleccionado, tipoSeleccionado }) => {
        this.ligasFiltradas = this.ligas.filter(liga => {
          const coincideBusqueda = liga.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                                   liga.codigo.toLowerCase().includes(busqueda.toLowerCase());
          
          const coincidePais = paisSeleccionado === 'todos' || 
                               liga.pais.toLowerCase() === paisSeleccionado.toLowerCase();
          
          const coincideTipo = tipoSeleccionado === 'todos' || 
                               liga.tipo.toLowerCase() === tipoSeleccionado.toLowerCase();

          return coincideBusqueda && coincidePais && coincideTipo;
        });

        // Si la liga que estaba seleccionada ya no está en el filtro, limpiamos la vista o ponemos la primera disponible
        if (this.ligaSeleccionada && !this.ligasFiltradas.includes(this.ligaSeleccionada)) {
          this.ligaSeleccionada = this.ligasFiltradas.length > 0 ? this.ligasFiltradas[0] : null;
        }
      });
  }

  seleccionarLiga(liga: Competicion): void {
    this.ligaSeleccionada = liga;
  }
}