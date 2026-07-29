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
  
  private authService = inject(AuthService);
  private router = inject(Router);

  iniciarSesion(): void {
    this.authService.login(this.email, this.password)
      .then(() => this.router.navigate(['/favoritos']))
      .catch((error: any) => alert('Error: ' + error.message));
  }

  registrarse(): void {
    this.authService.registro(this.email, this.password)
      .then(() => alert('Registro exitoso. Ya puedes iniciar sesión.'))
      .catch((error: any) => alert('Error: ' + error.message));
  }
}