import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FutbolService {
  private urlApi = 'https://v3.football.api-sports.io/fixtures';
  
  // 🔥 METER ACÁ TU KEY DEL DASHBOARD DE API-SPORTS:
  private apiKey = '782aabf766ed92451f004c19beb3bdf0'; 

  constructor(private http: HttpClient) {}

  obtenerPartidosDeHoy(): Observable<any> {
    const headers = new HttpHeaders({
      'x-rapidapi-host': 'v3.football.api-sports.io',
      'x-rapidapi-key': this.apiKey
    });

    // Obtenemos de forma dinámica la fecha del día de hoy en formato YYYY-MM-DD
    const hoy = new Date().toISOString().split('T')[0];

    return this.http.get<any>(`${this.urlApi}?date=${hoy}`, { headers });
  }
}