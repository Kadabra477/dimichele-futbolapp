import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CompetenciaDestacada } from '../models/futbol.model';

@Injectable({
  providedIn: 'root'
})
export class FutbolService {
  private datosPromiedos: CompetenciaDestacada[] = [
    {
      id: 'mundial',
      nombre: 'MUNDIAL',
      categoria: 'DESTACADO',
      partidos: [
        { id: 1, local: 'Túnez', visitante: 'Japón', golesLocal: 0, golesVisitante: 4, estado: 'Final', detallesVisitante: "4' Kamada; 31' Ueda; 69' Ito; 83' Ueda" },
        { id: 2, local: 'España', visitante: 'Arabia Saudita', golesLocal: 4, golesVisitante: 0, estado: 'Final', detallesLocal: "10' Yamal; 21' Oyarzabal; 24' Oyarzabal; 49' Al Tambakti (E.C)" },
        { id: 3, local: 'Bélgica', visitante: 'Irán', golesLocal: 0, golesVisitante: 0, estado: 'Final' },
        { id: 4, local: 'Uruguay', visitante: 'Cabo Verde', golesLocal: 2, golesVisitante: 2, estado: 'Final', detallesLocal: "44' Araújo; 45'+6 Canobbio", detallesVisitante: "21' Lenini; 61' Varela" },
        { id: 5, local: 'Nueva Zelanda', visitante: 'Egipto', golesLocal: null, golesVisitante: null, estado: '22:00' }
      ]
    },
    {
      id: 'lpf',
      nombre: 'Liga Profesional',
      categoria: 'DESTACADO',
      partidos: []
    },
    {
      id: 'primera_b',
      nombre: 'Primera Nacional',
      categoria: 'DESTACADO',
      partidos: []
    }
  ];

  obtenerFixture(): Observable<CompetenciaDestacada[]> {
    return of(this.datosPromiedos);
  }
}