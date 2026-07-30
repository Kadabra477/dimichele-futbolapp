import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, deleteDoc, updateDoc, query, where } from '@angular/fire/firestore';
import { Auth, user } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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
  
  // Observable reactivo que escucha el estado de la sesión en tiempo real
  private user$ = user(this.auth);

  getFavoritos(): Observable<Favorito[]> {
    return this.user$.pipe(
      switchMap(currentUser => {
        if (!currentUser) {
          return of([]); // Si no hay sesión iniciada, retorna un arreglo vacío al instante
        }
        const favoritosCollection = collection(this.firestore, 'favoritos');
        // Filtra estrictamente por el UID del usuario activo
        const q = query(favoritosCollection, where('userId', '==', currentUser.uid));
        return collectionData(q, { idField: 'id' }) as Observable<Favorito[]>;
      })
    );
  }

  addFavorito(favorito: Favorito) {
    const currentUser = this.auth.currentUser;
    const favoritosCollection = collection(this.firestore, 'favoritos');
    return addDoc(favoritosCollection, {
      ...favorito,
      userId: currentUser ? currentUser.uid : 'anonimo'
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