import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RespuestaPartidos } from '../models/futbol.model';

@Injectable({
  providedIn: 'root'
})
export class FutbolService {
  // Conexión directa al endpoint global de partidos en vivo y programados
  private urlApi = 'https://api.football-data.org/v4/matches';
  
  // Colocá acá tu clave de API real para autenticar la petición asíncrona
  private apiToken = '90e2156b798d47e5b9b48c6699c6234c'; 

  constructor(private http: HttpClient) {}

  obtenerPartidosDelDia(): Observable<RespuestaPartidos> {
    const headers = new HttpHeaders({
      'X-Auth-Token': this.apiToken
    });

    // Realiza la petición asíncrona GET real hacia el servidor externo
    return this.http.get<RespuestaPartidos>(this.urlApi, { headers });
  }
}