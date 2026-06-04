import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-register-reclutador',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  hidePassword = signal(true);
  errorMessage = signal<string | null>(null);
  loading = signal(false);

  form = this.fb.group({
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    empresa: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  togglePassword(): void {
    this.hidePassword.update(v => !v);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const payload = {
      username: raw.email!,
      nombres: raw.nombres!,
      apellidos: raw.apellidos!,
      email: raw.email!,
      password: raw.password!,
      empresa: raw.empresa!,
    };

    this.loading.set(true);
    this.errorMessage.set(null);

    this.auth.registerReclutador(payload).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        this.errorMessage.set(err.error?.error || err.error?.message || 'No se pudo completar el registro.');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }
}
