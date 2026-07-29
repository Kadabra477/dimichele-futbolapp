import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Favorito {
  id?: string;
  nombre: string;
  tipo: string; // 'Equipo' o 'Liga'
}

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  private firestore = inject(Firestore);
  private favoritosCollection = collection(this.firestore, 'favoritos');

  getFavoritos(): Observable<Favorito[]> {
    return collectionData(this.favoritosCollection, { idField: 'id' }) as Observable<Favorito[]>;
  }

  addFavorito(favorito: Favorito) {
    return addDoc(this.favoritosCollection, favorito);
  }

  updateFavorito(id: string, data: any) {
    const docRef = doc(this.firestore, `favoritos/${id}`);
    return updateDoc(docRef, data);
  }

  deleteFavorito(id: string) {
    const docRef = doc(this.firestore, `favoritos/${id}`);
    return deleteDoc(docRef);
  }
}