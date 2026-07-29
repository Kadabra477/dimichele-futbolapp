import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <nav class="bg-[#111827] px-6 py-4 text-white shadow-sm flex justify-between items-center border-b border-slate-800">
      <div class="text-lg font-bold tracking-tight text-slate-100">PROMIEDOS</div>
      
      <div class="flex gap-6 items-center font-medium text-sm text-slate-300">
        <a routerLink="/partidos" class="hover:text-white transition-colors">Partidos</a>
        
        @if (authService.user$ | async; as user) {
          <a routerLink="/favoritos" class="hover:text-white transition-colors">Panel CRUD</a>
          <button (click)="cerrarSesion()" class="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded hover:bg-slate-700 transition-colors text-xs font-semibold text-slate-200">Cerrar sesión</button>
        } @else {
          <a routerLink="/login" class="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded hover:bg-slate-700 transition-colors text-xs font-semibold text-slate-200">Acceso</a>
        }
      </div>
    </nav>

    <main class="w-full min-h-[calc(100vh-65px)] bg-[#0f172a]">
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {
  authService = inject(AuthService);

  cerrarSesion() {
    this.authService.logout();
  }
}