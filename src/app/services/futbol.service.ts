import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Competicion } from '../models/futbol.model';

@Injectable({
  providedIn: 'root'
})
export class FutbolService {
  // Base de datos sólida estilo Promiedos para garantizar éxito en Firebase
  private datosLigas: Competicion[] = [
    {
      id: 'arg_1',
      nombre: 'Liga Profesional Argentina',
      codigo: 'LFP',
      pais: 'Argentina',
      tipo: 'Liga',
      logo: 'https://images.promiedos.com.ar/leagues/lpf.png',
      tabla: [
        { posicion: 1, nombre: 'River Plate', escudo: '⚪🔴⚪', pj: 14, pg: 9, pe: 3, pp: 2, pts: 30 },
        { posicion: 2, nombre: 'Boca Juniors', escudo: '🔵🟡🔵', pj: 14, pg: 8, pe: 4, pp: 2, pts: 28 },
        { posicion: 3, nombre: 'Racing Club', escudo: '🔵⚪🔵', pj: 14, pg: 7, pe: 4, pp: 3, pts: 25 },
        { posicion: 4, nombre: 'Independiente', escudo: '🔴🔴🔴', pj: 14, pg: 5, pe: 6, pp: 3, pts: 21 }
      ]
    },
    {
      id: 'eng_1',
      nombre: 'Premier League',
      codigo: 'PL',
      pais: 'Inglaterra',
      tipo: 'Liga',
      logo: 'https://crests.thefootball-data.org/PL.png',
      tabla: [
        { posicion: 1, nombre: 'Manchester City', escudo: '🩵', pj: 15, pg: 11, pe: 2, pp: 2, pts: 35 },
        { posicion: 2, nombre: 'Arsenal FC', escudo: '🔴', pj: 15, pg: 10, pe: 3, pp: 2, pts: 33 },
        { posicion: 3, nombre: 'Liverpool FC', escudo: '🔴🔴', pj: 15, pg: 9, pe: 4, pp: 2, pts: 31 },
        { posicion: 4, nombre: 'Real Madrid (MOCK)', escudo: '⚪', pj: 15, pg: 8, pe: 4, pp: 3, pts: 28 }
      ]
    },
    {
      id: 'esp_1',
      nombre: 'Primera División',
      codigo: 'PD',
      pais: 'España',
      tipo: 'Liga',
      logo: 'https://crests.thefootball-data.org/PD.png',
      tabla: [
        { posicion: 1, nombre: 'FC Barcelona', escudo: '🔵🔴', pj: 14, pg: 11, pe: 1, pp: 2, pts: 34 },
        { posicion: 2, nombre: 'Real Madrid', escudo: '⚪', pj: 14, pg: 10, pe: 3, pp: 1, pts: 33 },
        { posicion: 3, nombre: 'Atlético de Madrid', escudo: '🔴⚪', pj: 14, pg: 8, pe: 4, pp: 2, pts: 28 }
      ]
    },
    {
      id: 'ucl_1',
      nombre: 'UEFA Champions League',
      codigo: 'CL',
      pais: 'Europa',
      tipo: 'Copa',
      logo: 'https://crests.thefootball-data.org/CL.png',
      tabla: [
        { posicion: 1, nombre: 'Bayern Múnich', escudo: '🔴🇩🇪', pj: 6, pg: 5, pe: 1, pp: 0, pts: 16 },
        { posicion: 2, nombre: 'Paris Saint-Germain', escudo: '🔵🇫🇷', pj: 6, pg: 4, pe: 1, pp: 1, pts: 13 },
        { posicion: 3, nombre: 'Inter de Milán', escudo: '🔵🖤', pj: 6, pg: 3, pe: 2, pp: 1, pts: 11 }
      ]
    }
  ];

  obtenerLigas(): Observable<Competicion[]> {
    return of(this.datosLigas);
  }
}