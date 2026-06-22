import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RespuestaPublica } from '../models/futbol.model';

@Injectable({
  providedIn: 'root'
})
export class FutbolService {
  // Consumo directo de la API libre recomendada en el examen
  private urlPublica = 'https://api.freepublicapis.com/football/matches-today';

  constructor(private http: HttpClient) {}

  obtenerPartidosDeHoy(): Observable<RespuestaPublica> {
    // Petición GET directa y asíncrona sin restricciones de origen de navegador
    return this.http.get<RespuestaPublica>(this.urlPublica);
  }
}