import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FutbolService } from './services/futbol.service';
import { CompetenciaDestacada } from './models/futbol.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements OnInit {
  formularioFiltro: FormGroup;
  competencias: CompetenciaDestacada[] = [];
  vistaActual: 'TODOS' | 'VIVO' = 'TODOS';
  cargando = true;

  constructor(private fb: FormBuilder, private futbolService: FutbolService) {
    this.formularioFiltro = this.fb.group({
      busquedaClub: ['']
    });
  }

  ngOnInit(): void {
    this.futbolService.obtenerFixture().subscribe({
      next: (datos) => {
        this.competencias = datos;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  cambiarVista(tipo: 'TODOS' | 'VIVO') {
    this.vistaActual = tipo;
  }
}