import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FutbolService {
  private http = inject(HttpClient);
  private proxyCors = 'https://cors-anywhere.herokuapp.com/';
  private urlBase = 'https://v3.football.api-sports.io';
  private apiKey = '782aabf766ed92451f004c19beb3bdf0'; 

  obtenerPartidosDeHoy(): Observable<any> {
    const headers = new HttpHeaders({
      'x-rapidapi-host': 'v3.football.api-sports.io',
      'x-rapidapi-key': this.apiKey
    });

    const fechaLocal = new Date();
    if (fechaLocal.getHours() >= 21) {
      fechaLocal.setDate(fechaLocal.getDate() + 1);
    }

    const anio = fechaLocal.getFullYear();
    const mes = String(fechaLocal.getMonth() + 1).padStart(2, '0');
    const dia = String(fechaLocal.getDate()).padStart(2, '0');
    const hoyFormateado = `${anio}-${mes}-${dia}`;
    
    const urlDestino = `${this.urlBase}/fixtures?date=${hoyFormateado}`;
    return this.http.get<any>(`${this.proxyCors}${urlDestino}`, { headers });
  }
}