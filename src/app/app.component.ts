import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FutbolService } from './services/futbol.service'; // <-- Asegurate de que tenga el './'
import { Competicion } from './models/futbol.model';       // <-- Asegurate de que tenga el './'
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
  competiciones: Competicion[] = [];
  competicionesFiltradas: Competicion[] = [];
  cargando = true;

  constructor(private fb: FormBuilder, private futbolService: FutbolService) {
    this.formularioBusqueda = this.fb.group({
      busqueda: [''],
      regionSeleccionada: ['todas']
    });
  }

  ngOnInit(): void {
    this.futbolService.obtenerCompeticiones().subscribe({
      next: (datos) => {
        this.competiciones = datos.competiciones;
        this.competicionesFiltradas = datos.competiciones;
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
        startWith({ busqueda: '', regionSeleccionada: 'todas' }),
        debounceTime(200)
      )
      .subscribe(({ busqueda, regionSeleccionada }) => {
        this.competicionesFiltradas = this.competiciones.filter(comp => {
          const coincideBusqueda = comp.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                                   comp.codigo.toLowerCase().includes(busqueda.toLowerCase());
          const coincideRegion = regionSeleccionada === 'todas' || 
                                 comp.region.nombre.toLowerCase() === regionSeleccionada.toLowerCase();
          return coincideBusqueda && coincideRegion;
        });
      });
  }
}