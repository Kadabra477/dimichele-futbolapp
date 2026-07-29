import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

// Importaciones de Firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAfSQWQa4ZSRvbSESUxn1qmBuRC3HUTboM",
  authDomain: "dimichele-futbolapp.firebaseapp.com",
  projectId: "dimichele-futbolapp",
  storageBucket: "dimichele-futbolapp.firebasestorage.app",
  messagingSenderId: "285494485620",
  appId: "1:285494485620:web:aa0ebd01de6b99e8d4a721"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), // <-- Restauramos tu configuración original
    provideRouter(routes),
    provideHttpClient(),
    // Inicialización de Firebase
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};