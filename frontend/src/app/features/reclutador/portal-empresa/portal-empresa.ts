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
  telefono = signal('');
  cargo = signal('');
  sector = signal('');
  descripcion = signal('');
  fotoPreview = signal<string | null>(null);
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
        this.telefono.set(profile.telefono || '');
        this.cargo.set(profile.cargo || '');
        this.sector.set(profile.sector || '');
        this.descripcion.set(profile.descripcion || '');
        if (profile.fotoPerfil) {
          this.fotoPreview.set(profile.fotoPerfil);
          this.auth.updateSessionUser({ fotoPerfil: profile.fotoPerfil });
        }
      },
    });
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.fotoPreview.set(URL.createObjectURL(file));
    (this as unknown as { _fotoFile: File })._fotoFile = file;
  }

  save(): void {
    const userId = this.auth.currentUser()?.id;
    if (!userId) return;

    this.saving.set(true);
    this.message.set(null);

    const formData = new FormData();
    formData.append('nombres', this.nombres());
    formData.append('apellidos', this.apellidos());
    formData.append('email', this.email());
    formData.append('empresa', this.companyName());
    formData.append('telefono', this.telefono());
    formData.append('cargo', this.cargo());
    formData.append('sector', this.sector());
    formData.append('descripcion', this.descripcion());

    const foto = (this as unknown as { _fotoFile?: File })._fotoFile;
    if (foto) formData.append('fotoFile', foto);

    this.reclutadorService.updateProfileComplete(userId, formData).subscribe({
      next: (profile) => {
        this.auth.updateSessionUser({
          empresa: profile.empresa,
          nombreCompleto: `${profile.nombres} ${profile.apellidos}`.trim(),
          email: profile.email,
          fotoPerfil: profile.fotoPerfil,
        });
        if (profile.fotoPerfil) this.fotoPreview.set(profile.fotoPerfil);
        this.message.set('Perfil actualizado correctamente.');
        this.saving.set(false);
      },
      error: (err) => {
        this.message.set(err.error?.message || 'No se pudo guardar los cambios.');
        this.saving.set(false);
      },
    });
  }

  avatarUrl(): string {
    return this.fotoPreview() || this.auth.avatarUrl(this.recruiterName());
  }
}
