import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FutbolService {
  private proxyCors = 'https://cors-anywhere.herokuapp.com/';
  private urlBase = 'https://v3.football.api-sports.io';
  private apiKey = '782aabf766ed92451f004c19beb3bdf0'; 

  constructor(private http: HttpClient) {}

  obtenerPartidosDeHoy(): Observable<any> {
    const headers = new HttpHeaders({
      'x-rapidapi-host': 'v3.football.api-sports.io',
      'x-rapidapi-key': this.apiKey
    });

    const fechaLocal = new Date();
    
    // 🛠️ DETECTOR DE HORA CRÍTICA: Si ya es tarde en Argentina, le pedimos a la API los partidos del día siguiente en UTC
    if (fechaLocal.getHours() >= 21) {
      fechaLocal.setDate(fechaLocal.getDate() + 1);
    }

    const anio = fechaLocal.getFullYear();
    const mes = String(fechaLocal.getMonth() + 1).padStart(2, '0');
    const dia = String(fechaLocal.getDate()).padStart(2, '0');
    
    const hoyFormateado = `${anio}-${mes}-${dia}`;
    console.log('--- Petición HTTP Real ---');
    console.log('Consultando API-Sports para la fecha:', hoyFormateado);

    const urlDestino = `${this.urlBase}/fixtures?date=${hoyFormateado}`;
    return this.http.get<any>(`${this.proxyCors}${urlDestino}`, { headers });
  }
}