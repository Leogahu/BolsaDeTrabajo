import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { PostanteService } from '../../../core/services/postante';
import { ProyectoService } from '../../../core/services/proyecto';
import { Proyecto } from '../../../shared/models/proyecto';
import { Aval } from '../../../shared/models/postante';

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './editar-perfil.html',
  styleUrl: './editar-perfil.css',
})
export class EditarPerfil implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  readonly auth = inject(AuthService);
  private postanteService = inject(PostanteService);
  private proyectoService = inject(ProyectoService);

  saving = signal(false);
  message = signal<string | null>(null);
  projects = signal<Proyecto[]>([]);
  avales = signal<Aval[]>([]);
  avatarPreview = signal<string | null>(null);

  form = this.fb.group({
    nombres: [''],
    apellidos: [''],
    carrera: [''],
    institucion: [''],
    telefono: [''],
    egresado: ['false'],
    descripcion: [''],
  });

  projectForm = this.fb.group({
    id: [''],
    titulo: [''],
    urlEvidencia: [''],
    descripcion: [''],
  });

  avalForm = this.fb.group({
    nombreAvalador: [''],
    cargoInstitucion: [''],
    comentarioAval: [''],
    contactoEmail: [''],
  });

  ngOnInit(): void {
    const userId = this.auth.currentUser()?.id;
    if (!userId) return;

    this.postanteService.getProfile(userId).subscribe({
      next: (profile) => {
        this.form.patchValue({
          nombres: profile.nombres ?? '',
          apellidos: profile.apellidos ?? '',
          carrera: profile.carrera ?? '',
          institucion: profile.institucion ?? '',
          telefono: profile.telefono ?? '',
          egresado: String(profile.egresado ?? false),
          descripcion: profile.descripcion ?? '',
        });
        if (profile.fotoPerfil) {
          this.avatarPreview.set(profile.fotoPerfil);
        }
      },
    });

    this.loadProjects(userId);
    this.loadAvales(userId);
  }

  loadAvales(userId: number): void {
    this.postanteService.getAvales(userId).subscribe({
      next: (list) => this.avales.set(list),
    });
  }

  loadProjects(userId: number): void {
    this.proyectoService.listByPostante(userId).subscribe({
      next: (projects) => this.projects.set(projects),
    });
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => this.avatarPreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  saveProfile(cvInput: HTMLInputElement, photoInput: HTMLInputElement): void {
    const userId = this.auth.currentUser()?.id;
    if (!userId) return;

    const raw = this.form.getRawValue();
    const formData = new FormData();
    formData.append('nombres', raw.nombres ?? '');
    formData.append('apellidos', raw.apellidos ?? '');
    formData.append('descripcion', raw.descripcion ?? '');
    formData.append('carrera', raw.carrera ?? '');
    formData.append('institucion', raw.institucion ?? '');
    formData.append('egresado', raw.egresado ?? 'false');
    formData.append('telefono', raw.telefono ?? '');

    if (cvInput.files?.[0]) formData.append('cvFile', cvInput.files[0]);
    if (photoInput.files?.[0]) formData.append('fotoFile', photoInput.files[0]);

    this.saving.set(true);
    this.postanteService.updateProfileComplete(userId, formData).subscribe({
      next: () => {
        this.postanteService.getProfile(userId).subscribe({
          next: (profile) => {
            this.auth.updateSessionUser({
              nombres: profile.nombres ?? raw.nombres ?? '',
              apellidos: profile.apellidos ?? raw.apellidos ?? '',
              nombreCompleto: `${profile.nombres ?? ''} ${profile.apellidos ?? ''}`.trim(),
              fotoPerfil: profile.fotoPerfil,
            });
            this.router.navigate(['/candidato/perfil']);
          },
          error: () => this.router.navigate(['/candidato/perfil']),
        });
      },
      error: () => {
        this.message.set('Error al guardar el perfil.');
        this.saving.set(false);
      },
      complete: () => this.saving.set(false),
    });
  }

  saveProject(): void {
    const userId = this.auth.currentUser()?.id;
    if (!userId) return;

    const raw = this.projectForm.getRawValue();
    if (!raw.titulo) return;

    const payload: Proyecto = {
      titulo: raw.titulo,
      descripcion: raw.descripcion ?? '',
      urlEvidencia: raw.urlEvidencia ?? '',
    };

    const request = raw.id
      ? this.proyectoService.update(Number(raw.id), payload)
      : this.proyectoService.create(userId, payload);

    request.subscribe({
      next: () => {
        this.projectForm.reset({ id: '', titulo: '', urlEvidencia: '', descripcion: '' });
        this.loadProjects(userId);
      },
    });
  }

  editProject(project: Proyecto): void {
    this.projectForm.patchValue({
      id: String(project.id ?? ''),
      titulo: project.titulo,
      urlEvidencia: project.urlEvidencia ?? '',
      descripcion: project.descripcion ?? '',
    });
  }

  deleteProject(id?: number): void {
    const userId = this.auth.currentUser()?.id;
    if (!id || !userId) return;
    this.proyectoService.delete(id).subscribe({
      next: () => this.loadProjects(userId),
    });
  }

  saveAval(): void {
    const userId = this.auth.currentUser()?.id;
    if (!userId) return;
    const raw = this.avalForm.getRawValue();
    if (!raw.nombreAvalador) return;

    this.postanteService.addAval(userId, {
      nombreAvalador: raw.nombreAvalador,
      cargoInstitucion: raw.cargoInstitucion ?? '',
      comentarioAval: raw.comentarioAval ?? '',
      contactoEmail: raw.contactoEmail ?? '',
    }).subscribe({
      next: () => {
        this.avalForm.reset({ nombreAvalador: '', cargoInstitucion: '', comentarioAval: '', contactoEmail: '' });
        this.loadAvales(userId);
      },
    });
  }

  deleteAval(id: number): void {
    const userId = this.auth.currentUser()?.id;
    if (!userId) return;
    this.postanteService.deleteAval(id).subscribe({
      next: () => this.loadAvales(userId),
    });
  }
}
