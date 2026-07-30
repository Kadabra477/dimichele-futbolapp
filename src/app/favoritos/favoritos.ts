import { Component, inject, OnInit } from '@angular/core';
import { FavoritosService, Favorito } from '../services/favoritos.service';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [FormsModule, AsyncPipe, CommonModule],
  templateUrl: './favoritos.html',
  styles: []
})
export class FavoritosComponent implements OnInit {
  private favoritosService = inject(FavoritosService);
  favoritos$!: Observable<Favorito[]>;
  private listaFavoritosActuales: Favorito[] = []; 
  
  nuevoNombre = ''; 
  nuevoTipo = 'Equipo'; 
  editandoId: string | null = null;

  ngOnInit() { 
    this.favoritos$ = this.favoritosService.getFavoritos();
    this.favoritos$.subscribe(favs => {
      this.listaFavoritosActuales = favs;
    });
  }

  // Getter para saber si hay elementos y controlar el estado del botón PDF
  get tieneFavoritos(): boolean {
    return this.listaFavoritosActuales.length > 0;
  }

  guardar() {
    if (!this.nuevoNombre.trim()) return;
    if (this.editandoId) {
      this.favoritosService.updateFavorito(this.editandoId, { nombre: this.nuevoNombre, tipo: this.nuevoTipo });
      this.editandoId = null;
    } else {
      this.favoritosService.addFavorito({ nombre: this.nuevoNombre, tipo: this.nuevoTipo });
    }
    this.nuevoNombre = ''; 
    this.nuevoTipo = 'Equipo';
  }

  editar(fav: Favorito) { 
    this.nuevoNombre = fav.nombre; 
    this.nuevoTipo = fav.tipo; 
    this.editandoId = fav.id!; 
  }
  
  eliminar(id: string) { 
    if(confirm('¿Eliminar favorito?')) {
      this.favoritosService.deleteFavorito(id);
    } 
  }

  exportarPDF() {
    if (!this.tieneFavoritos) return; // Evita exportar si está vacío
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42); 
    doc.text("Reporte de Favoritos - FutbolApp", 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, 14, 28);

    doc.setDrawColor(203, 213, 225);
    doc.line(14, 34, 196, 34);

    let posY = 45;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text("Ítem / Nombre", 14, posY);
    doc.text("Tipo de Registro", 120, posY);
    
    posY += 6;
    doc.setDrawColor(226, 232, 240);
    doc.line(14, posY, 196, posY);
    posY += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    this.listaFavoritosActuales.forEach((fav, index) => {
      if (posY > 280) { 
        doc.addPage();
        posY = 20;
      }
      doc.text(`${index + 1}. ${fav.nombre}`, 14, posY);
      doc.text(fav.tipo.toUpperCase(), 120, posY);
      posY += 10;
    });

    doc.save("mis-favoritos-futbolapp.pdf");
  }
}