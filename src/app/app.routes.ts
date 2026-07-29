import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { FavoritosComponent } from './favoritos/favoritos';
import { PartidosComponent } from './partidos/partidos';
import { authGuard } from './auth-guard';

export const routes: Routes = [
  { path: 'partidos', component: PartidosComponent },
  { path: 'login', component: LoginComponent },
  { path: 'favoritos', component: FavoritosComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'partidos', pathMatch: 'full' },
  { path: '**', redirectTo: 'partidos' }
];