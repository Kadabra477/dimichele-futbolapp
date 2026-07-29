import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, query, where, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Comentario {
  id?: string;
  partidoId: number | string;
  usuario: string;
  texto: string;
  calificacion: number; // del 1 al 5
  fecha: number;
}

@Injectable({
  providedIn: 'root'
})
export class ComentariosService {
  private firestore = inject(Firestore);
  private comentariosCollection = collection(this.firestore, 'comentarios');

  // Obtener comentarios de un partido específico
  getComentariosPorPartido(partidoId: number | string): Observable<Comentario[]> {
    // Nota: Si prefieres traerlos ordenados, puedes usar query y where. 
    // Por simplicidad y evitar índices compuestos requeridos en Firestore, traemos todos y filtramos en código o directo si creamos la colección.
    return collectionData(this.comentariosCollection, { idField: 'id' }) as Observable<Comentario[]>;
  }

  // Agregar un nuevo comentario
  agregarComentario(comentario: Comentario) {
    return addDoc(this.comentariosCollection, comentario);
  }
}