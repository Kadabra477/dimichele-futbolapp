import { Component, inject, ChangeDetectorRef } from '@angular/core';
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
  cargandoLogin = false;
  cargandoRegistro = false;
  
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  iniciarSesion(): void {
    const emailLimpio = this.email.trim();

    if (!emailLimpio || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    this.errorMessage = '';
    this.cargandoLogin = true;

    this.authService.login(emailLimpio, this.password)
      .then(() => {
        this.cargandoLogin = false;
        this.cdr.detectChanges();
        this.router.navigate(['/partidos']); // Redirige correctamente al listado de partidos
      })
      .catch((error: any) => {
        console.error('Error en login:', error);
        this.cargandoLogin = false;
        this.errorMessage = this.formatearErrorFirebase(error.code);
        this.cdr.detectChanges();
      });
  }

  registrarse(): void {
    const emailLimpio = this.email.trim();

    if (!emailLimpio || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos para registrarte.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    this.errorMessage = '';
    this.cargandoRegistro = true;

    this.authService.registro(emailLimpio, this.password)
      .then(() => {
        this.cargandoRegistro = false;
        this.cdr.detectChanges();
        alert('¡Registro exitoso! Ya puedes iniciar sesión con tus credenciales.');
        this.router.navigate(['/partidos']);
      })
      .catch((error: any) => {
        console.error('Error en registro:', error);
        this.cargandoRegistro = false;
        this.errorMessage = this.formatearErrorFirebase(error.code);
        this.cdr.detectChanges();
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
        return 'La cuenta no existe o los datos ingresados son incorrectos.';
      case 'auth/operation-not-allowed':
        return 'El inicio de sesión con correo y contraseña no está habilitado en Firebase.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos fallidos. Por favor, intenta más tarde.';
      default:
        return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
    }
  }
}