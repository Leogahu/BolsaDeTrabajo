import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { ReclutadorService } from '../../../core/services/reclutador';

@Component({
  selector: 'app-portal-empresa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './portal-empresa.html',
  styleUrl: './portal-empresa.css',
})
export class PortalEmpresa implements OnInit {
  private auth = inject(AuthService);
  private reclutadorService = inject(ReclutadorService);

  companyName = signal('');
  recruiterName = signal('');
  email = signal('');
  nombres = signal('');
  apellidos = signal('');
  saving = signal(false);
  message = signal<string | null>(null);

  ngOnInit(): void {
    const user = this.auth.currentUser();
    if (!user?.id) return;

    this.reclutadorService.getProfile(user.id).subscribe({
      next: (profile) => {
        this.companyName.set(profile.empresa || 'Mi Empresa');
        this.recruiterName.set(`${profile.nombres} ${profile.apellidos}`.trim());
        this.email.set(profile.email);
        this.nombres.set(profile.nombres);
        this.apellidos.set(profile.apellidos);
      },
      error: () => {
        this.companyName.set(user.empresa || 'Mi Empresa');
        this.recruiterName.set(user.nombreCompleto || 'Reclutador');
        this.email.set(user.email || '');
      },
    });
  }

  save(): void {
    const userId = this.auth.currentUser()?.id;
    if (!userId) return;

    this.saving.set(true);
    this.message.set(null);

    this.reclutadorService.updateProfile(userId, {
      nombres: this.nombres(),
      apellidos: this.apellidos(),
      email: this.email(),
      empresa: this.companyName(),
    }).subscribe({
      next: (profile) => {
        this.auth.updateSessionUser({
          empresa: profile.empresa,
          nombreCompleto: `${profile.nombres} ${profile.apellidos}`.trim(),
          email: profile.email,
        });
        this.message.set('Perfil de empresa actualizado correctamente.');
        this.saving.set(false);
      },
      error: (err) => {
        this.message.set(err.error?.message || 'No se pudo guardar los cambios.');
        this.saving.set(false);
      },
    });
  }
}
