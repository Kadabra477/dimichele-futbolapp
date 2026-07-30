import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styles: []
})
export class LoginComponent {
  email = ''; 
  password = '';
  errorMessage = '';
  cargando = false;
  
  private authService = inject(AuthService);
  private router = inject(Router);

  iniciarSesion(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    this.errorMessage = '';
    this.cargando = true;

    this.authService.login(this.email, this.password)
      .then(() => {
        this.cargando = false;
        this.router.navigate(['/favoritos']);
      })
      .catch((error: any) => {
        this.cargando = false;
        this.errorMessage = this.formatearErrorFirebase(error.code);
      });
  }

  registrarse(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos para registrarte.';
      return;
    }

    this.errorMessage = '';
    this.cargando = true;

    this.authService.registro(this.email, this.password)
      .then(() => {
        this.cargando = false;
        alert('¡Registro exitoso! Ya puedes iniciar sesión con tus credenciales.');
      })
      .catch((error: any) => {
        this.cargando = false;
        this.errorMessage = this.formatearErrorFirebase(error.code);
      });
  }

  // Traducción amigable de los errores de Firebase para el usuario
  private formatearErrorFirebase(code: string): string {
    switch (code) {
      case 'auth/invalid-email':
        return 'El formato del correo electrónico no es válido.';
      case 'auth/user-not-found':
        return 'No existe una cuenta asociada a este correo.';
      case 'auth/wrong-password':
        return 'La contraseña es incorrecta.';
      case 'auth/email-already-in-use':
        return 'Este correo electrónico ya está registrado.';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres.';
      case 'auth/invalid-credential':
        return 'Credenciales inválidas. Verifica tu correo o contraseña.';
      default:
        return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
    }
  }
}