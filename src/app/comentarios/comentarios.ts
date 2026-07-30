import { Component, Input, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComentariosService, Comentario } from '../services/comentarios.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Botón discreto para abrir los comentarios de este partido -->
    <button (click)="abrirModal()" class="text-xs bg-[#1f2937] hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded transition-colors flex items-center gap-1 border border-slate-700">
      💬 Reseñas ({{ comentariosPartido.length }})
    </button>

    <!-- Modal Flotante (Popup) -->
    @if (modalAbierto) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div class="bg-[#111827] border border-slate-700 rounded-xl w-full max-w-md p-5 shadow-2xl text-white">
          
          <!-- Cabecera del Modal -->
          <div class="flex justify-between items-center pb-3 border-b border-slate-700 mb-4">
            <h3 class="font-bold text-sm text-slate-200">💬 Opiniones del Partido</h3>
            <button (click)="cerrarModal()" class="text-slate-400 hover:text-white font-bold text-lg px-2">✕</button>
          </div>

          <!-- Mensaje de error/aviso si ya comentó -->
          @if (mensajeError) {
            <div class="bg-red-500/20 border border-red-500/50 text-red-300 text-xs p-2 rounded mb-3">
              {{ mensajeError }}
            </div>
          }

          <!-- Lista de Comentarios -->
          <div class="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
            @for (c of comentariosPartido; track c.id) {
              <div class="bg-[#1f2937] p-3 rounded-lg border border-slate-700">
                <div class="flex justify-between items-center mb-1">
                  <span class="font-bold text-slate-200 text-xs">{{ c.usuario }}</span>
                  <span class="text-yellow-400 text-xs">⭐ {{ c.calificacion }}/5</span>
                </div>
                <p class="text-slate-300 text-xs">{{ c.texto }}</p>
              </div>
            } @empty {
              <p class="text-slate-500 text-xs italic text-center py-4">No hay comentarios aún. ¡Sé el primero en opinar!</p>
            }
          </div>

          <!-- Formulario para agregar -->
          <form (submit)="enviarComentario(); $event.preventDefault()" class="space-y-3 pt-2 border-t border-slate-700">
            <div class="flex gap-2">
              <input type="text" [(ngModel)]="nuevoUsuario" name="usuario" placeholder="Tu nombre" 
                     class="bg-[#1f2937] text-white text-xs px-3 py-1.5 rounded border border-slate-600 flex-1 focus:outline-none" required>
              
              <select [(ngModel)]="nuevaCalificacion" name="calificacion" 
                      class="bg-[#1f2937] text-white text-xs px-2 py-1.5 rounded border border-slate-600 focus:outline-none">
                <option [value]="5">⭐⭐⭐⭐⭐ (5)</option>
                <option [value]="4">⭐⭐⭐⭐ (4)</option>
                <option [value]="3">⭐⭐⭐ (3)</option>
                <option [value]="2">⭐⭐ (2)</option>
                <option [value]="1">⭐ (1)</option>
              </select>
            </div>
            
            <div class="flex gap-2">
              <input type="text" [(ngModel)]="nuevoTexto" name="texto" placeholder="Escribe tu reseña..." 
                     class="bg-[#1f2937] text-white text-xs px-3 py-1.5 rounded border border-slate-600 flex-1 focus:outline-none" required>
              <button type="submit" [disabled]="cargandoEnvio" 
                      class="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs px-4 py-1.5 rounded font-semibold transition-colors">
                {{ cargandoEnvio ? 'Enviando...' : 'Enviar' }}
              </button>
            </div>
          </form>

        </div>
      </div>
    }
  `
})
export class ComentariosComponent implements OnInit {
  @Input() partidoId!: number | string;
  private comentariosService = inject(ComentariosService);
  private cdr = inject(ChangeDetectorRef); // Inyección para forzar la actualización de la vista

  comentariosPartido: Comentario[] = [];
  modalAbierto = false;
  nuevoUsuario = '';
  nuevoTexto = '';
  nuevaCalificacion = 5;

  cargandoEnvio = false;
  mensajeError = '';

  ngOnInit() {
    this.comentariosService.getComentariosPorPartido(this.partidoId).pipe(
      map(lista => lista.filter(c => String(c.partidoId) === String(this.partidoId)))
    ).subscribe(res => {
      this.comentariosPartido = res;
      this.cdr.detectChanges(); // Refresca cambios de datos en tiempo real
    });
  }

  abrirModal() { 
    this.modalAbierto = true; 
    this.mensajeError = '';
  }
  
  cerrarModal() { 
    this.modalAbierto = false; 
    this.mensajeError = '';
  }

  enviarComentario() {
    if (!this.nuevoUsuario.trim() || !this.nuevoTexto.trim() || this.cargandoEnvio) return;

    this.mensajeError = '';
    const nombreClean = this.nuevoUsuario.trim().toLowerCase();

    const yaComento = this.comentariosPartido.some(
      c => c.usuario.toLowerCase().trim() === nombreClean
    );

    if (yaComento) {
      this.mensajeError = 'Ya has enviado una reseña para este partido. No se permite más de una por persona.';
      this.cdr.detectChanges();
      return;
    }

    this.cargandoEnvio = true;
    this.cdr.detectChanges(); // Muestra "Enviando..." instantáneamente

    const nuevo: Comentario = {
      partidoId: this.partidoId,
      usuario: this.nuevoUsuario.trim(),
      texto: this.nuevoTexto.trim(),
      calificacion: Number(this.nuevaCalificacion),
      fecha: Date.now()
    };

    this.comentariosService.agregarComentario(nuevo)
      .then(() => {
        this.nuevoTexto = '';
        this.cargandoEnvio = false;
        this.cdr.detectChanges(); // Quita el estado de carga al terminar
      })
      .catch(err => {
        console.error('Error al guardar comentario:', err);
        this.cargandoEnvio = false;
        this.mensajeError = 'Ocurrió un error al enviar el comentario. Inténtalo de nuevo.';
        this.cdr.detectChanges(); // Muestra el error de inmediato en pantalla
      });
  }
}