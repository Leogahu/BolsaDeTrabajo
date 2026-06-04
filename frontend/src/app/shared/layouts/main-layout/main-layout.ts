import { Component, inject, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly auth = this.authService;

  readonly panel = computed(() => (this.router.url.startsWith('/reclutador') ? 'reclutador' : 'candidato') as 'candidato' | 'reclutador');
  readonly isRecruiter = computed(() => this.panel() === 'reclutador');
  readonly userName = computed(() => this.authService.currentUser()?.nombreCompleto ?? 'Usuario');
  readonly avatarUrl = computed(() => this.authService.avatarUrl(this.userName()));

  sidebarOpen = signal(false);
  notifOpen = signal(false);
  msgOpen = signal(false);
  profileOpen = signal(false);

  readonly candidatoNav: NavItem[] = [
    { label: 'Inicio', route: '/candidato/dashboard', icon: 'dashboard' },
    { label: 'Oportunidades', route: '/candidato/explorar-vacantes', icon: 'work' },
    { label: 'Mis Postulaciones', route: '/candidato/postulaciones', icon: 'assignment' },
    { label: 'Pruebas', route: '/candidato/habilidades', icon: 'quiz' },
    { label: 'Mi perfil', route: '/candidato/perfil', icon: 'person' },
    { label: 'Alertas', route: '/candidato/alertas', icon: 'notifications' },
    { label: 'Simulador', route: '/candidato/entrevistas', icon: 'mic' },
  ];

  readonly reclutadorNav: NavItem[] = [
    { label: 'Dashboard', route: '/reclutador/dashboard', icon: 'dashboard' },
    { label: 'Vacantes', route: '/reclutador/vacantes', icon: 'work' },
    { label: 'Postulantes', route: '/reclutador/gestion-candidatos', icon: 'groups' },
    { label: 'Publicar Empleo', route: '/reclutador/publicar-oferta', icon: 'add_circle' },
    { label: 'Feedback', route: '/reclutador/feedback', icon: 'reviews' },
    { label: 'Reportes', route: '/reclutador/reportes', icon: 'bar_chart' },
    { label: 'Configuración', route: '/reclutador/portal-empresa', icon: 'settings' },
  ];

  readonly navItems = computed(() => (this.isRecruiter() ? this.reclutadorNav : this.candidatoNav));

  readonly notifications = signal([
    'Nueva vacante de Frontend',
    'TechCorp revisó tu perfil',
  ]);

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  closeDropdowns(): void {
    this.notifOpen.set(false);
    this.msgOpen.set(false);
    this.profileOpen.set(false);
  }

  toggleNotif(event: Event): void {
    event.stopPropagation();
    this.notifOpen.update(v => !v);
    this.msgOpen.set(false);
    this.profileOpen.set(false);
  }

  toggleMsg(event: Event): void {
    event.stopPropagation();
    this.msgOpen.update(v => !v);
    this.notifOpen.set(false);
    this.profileOpen.set(false);
  }

  toggleProfile(event: Event): void {
    event.stopPropagation();
    this.profileOpen.update(v => !v);
    this.notifOpen.set(false);
    this.msgOpen.set(false);
  }

  removeNotif(index: number): void {
    this.notifications.update(list => list.filter((_, i) => i !== index));
  }

  logout(): void {
    this.authService.logout();
  }

  goToProfileSettings(): void {
    const route = this.isRecruiter() ? '/reclutador/portal-empresa' : '/candidato/perfil';
    this.router.navigate([route]);
    this.closeDropdowns();
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeDropdowns();
  }
}
