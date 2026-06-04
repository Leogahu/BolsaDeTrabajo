import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  // ReactiveFormsModule habilita [formGroup] y formControlName en el HTML
  // RouterLink habilita la directiva routerLink para los enlaces
  imports: [ReactiveFormsModule, RouterLink], 
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // 1. Signals requeridos por los bloques @if() en tu HTML
  hidePassword = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  // 2. Definición del formulario reactivo que vinculas con [formGroup]
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  // 3. Método para alternar la visibilidad del input de contraseña (click)
  togglePasswordVisibility(): void {
    this.hidePassword.update(value => !value);
  }

  // 4. Procesamiento del formulario al hacer (ngSubmit)
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null); // Limpiamos errores previos

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        // Redireccionamos según la estructura de roles de tu backend ('postante' o 'reclutador')
        if (response.tipo === 'postante') {
          this.router.navigate(['/candidato/dashboard']);
        } else if (response.tipo === 'reclutador') {
          this.router.navigate(['/reclutador/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        // Captura el mensaje de error para mostrarlo en la caja roja superior del HTML
        this.errorMessage.set('Credenciales incorrectas. Inténtalo de nuevo.');
        console.error('Error en el login:', err);
      }
    });
  }
}

export { LoginComponent as Login };