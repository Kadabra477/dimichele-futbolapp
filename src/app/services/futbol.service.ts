import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RespuestaFutbol } from '../models/futbol.model';

@Injectable({
  providedIn: 'root'
})
export class FutbolService {
  private urlApi = 'https://api.football-data.org/v4/competitions/';

  private datosMock: RespuestaFutbol = {
    cantidad: 4,
    filtros: {},
    competiciones: [
      { id: 2001, region: { id: 2072, nombre: 'Europa', codigo: 'EUR', bandera: '🇪🇺' }, nombre: 'UEFA Champions League', codigo: 'CL', emblema: 'https://crests.thefootball-data.org/CL.png', plan: 'TIER_ONE', temporadasDisponibles: 23, ultimaActualizacion: '2026-06-01T00:00:00Z' },
      { id: 2014, region: { id: 2224, nombre: 'España', codigo: 'ESP', bandera: '🇪🇸' }, nombre: 'Primera División', codigo: 'PD', emblema: 'https://crests.thefootball-data.org/PD.png', plan: 'TIER_ONE', temporadasDisponibles: 32, ultimaActualizacion: '2026-06-15T00:00:00Z' },
      { id: 2021, region: { id: 2072, nombre: 'Inglaterra', codigo: 'ENG', bandera: '🇬🇧' }, nombre: 'Premier League', codigo: 'PL', emblema: 'https://crests.thefootball-data.org/PL.png', plan: 'TIER_ONE', temporadasDisponibles: 34, ultimaActualizacion: '2026-06-20T00:00:00Z' },
      { id: 2002, region: { id: 2088, nombre: 'Alemania', codigo: 'GER', bandera: '🇩🇪' }, nombre: 'Bundesliga', codigo: 'BL', emblema: 'https://crests.thefootball-data.org/BL.png', plan: 'TIER_ONE', temporadasDisponibles: 30, ultimaActualizacion: '2026-06-18T00:00:00Z' }
    ]
  };

  constructor(private http: HttpClient) {}

  obtenerCompeticiones(): Observable<RespuestaFutbol> {
    return this.http.get<any>(this.urlApi).pipe(
      map(res => {
        // Adaptamos la respuesta de la API original a nuestra estructura en español
        return {
          cantidad: res.count,
          filtros: res.filters,
          competiciones: res.competitions.map((c: any) => ({
            id: c.id,
            region: { id: c.area.id, nombre: c.area.name, codigo: c.area.code, bandera: null },
            nombre: c.name,
            codigo: c.code,
            emblema: c.emblem,
            plan: c.plan,
            temporadasDisponibles: c.numberOfAvailableSeasons,
            ultimaActualizacion: c.lastUpdated
          }))
        };
      }),
      catchError(() => {
        console.warn("Utilizando datos locales de contingencia en español.");
        return of(this.datosMock);
      })
    );
  }
}