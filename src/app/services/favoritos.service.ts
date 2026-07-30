import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, deleteDoc, updateDoc, query, where } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';

export interface Favorito {
  id?: string;
  nombre: string;
  tipo: string; // 'Equipo' o 'Liga'
  userId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  getFavoritos(): Observable<Favorito[]> {
    const user = this.auth.currentUser;
    if (!user) {
      return of([]); // Si no hay sesión, retorna vacío
    }
    const favoritosCollection = collection(this.firestore, 'favoritos');
    // Filtramos para que cada usuario vea únicamente sus propios favoritos
    const q = query(favoritosCollection, where('userId', '==', user.uid));
    return collectionData(q, { idField: 'id' }) as Observable<Favorito[]>;
  }

  addFavorito(favorito: Favorito) {
    const user = this.auth.currentUser;
    const favoritosCollection = collection(this.firestore, 'favoritos');
    return addDoc(favoritosCollection, {
      ...favorito,
      userId: user ? user.uid : 'anonimo'
    });
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