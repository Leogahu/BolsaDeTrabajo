import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { PostanteService } from '../../../core/services/postante';
import { ProyectoService } from '../../../core/services/proyecto';
import { PostanteProfile, Certificado, Aval } from '../../../shared/models/postante';
import { Proyecto } from '../../../shared/models/proyecto';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {
  private auth = inject(AuthService);
  private postanteService = inject(PostanteService);
  private proyectoService = inject(ProyectoService);

  profile = signal<PostanteProfile | null>(null);
  projects = signal<Proyecto[]>([]);
  certificados = signal<Certificado[]>([]);
  avales = signal<Aval[]>([]);

  ngOnInit(): void {
    const userId = this.auth.currentUser()?.id;
    if (!userId) return;

    this.postanteService.getProfile(userId).subscribe({
      next: (profile) => this.profile.set(profile),
    });

    this.proyectoService.listByPostante(userId).subscribe({
      next: (projects) => this.projects.set(projects),
    });

    this.postanteService.getCertificados(userId).subscribe({
      next: (certs) => this.certificados.set(certs),
    });

    this.postanteService.getAvales(userId).subscribe({
      next: (list) => this.avales.set(list),
    });
  }

  fullName(): string {
    const p = this.profile();
    if (!p) return 'Usuario';
    return `${p.nombres ?? ''} ${p.apellidos ?? ''}`.trim() || 'Usuario';
  }

  avatarUrl(): string {
    const p = this.profile();
    if (p?.fotoPerfil) return p.fotoPerfil;
    return this.auth.avatarUrl(this.fullName());
  }
}
