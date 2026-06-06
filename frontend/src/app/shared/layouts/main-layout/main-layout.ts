import { Component, OnDestroy, OnInit, inject, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { interval, Subscription, startWith } from 'rxjs';
import { AuthService } from '../../../core/services/auth';
import { NotificationService, Notificacion } from '../../../core/services/notification';
import { ChatService, Conversacion, Mensaje } from '../../../core/services/chat';
import { ChatUiService } from '../../../core/services/chat-ui';
import { RealtimeService } from '../../../core/services/realtime';
import { PostanteService } from '../../../core/services/postante';
import { ReclutadorService } from '../../../core/services/reclutador';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private chatService = inject(ChatService);
  private chatUiService = inject(ChatUiService);
  private realtime = inject(RealtimeService);
  private postanteService = inject(PostanteService);
  private reclutadorService = inject(ReclutadorService);

  readonly auth = this.authService;

  readonly panel = computed(() => (this.router.url.startsWith('/reclutador') ? 'reclutador' : 'candidato') as 'candidato' | 'reclutador');
  readonly isRecruiter = computed(() => this.panel() === 'reclutador');
  readonly userName = computed(() => this.authService.currentUser()?.nombreCompleto ?? 'Usuario');
  readonly avatarUrl = computed(() => this.authService.avatarUrl(this.userName()));

  sidebarOpen = signal(false);
  notifOpen = signal(false);
  msgOpen = signal(false);
  profileOpen = signal(false);
  chatOpen = signal(false);
  chatExpanded = signal(false);

  notifications = signal<Notificacion[]>([]);
  unreadNotifCount = signal(0);
  conversations = signal<Conversacion[]>([]);
  unreadMsgCount = signal(0);

  activeConversation = signal<Conversacion | null>(null);
  messages = signal<Mensaje[]>([]);
  newMessage = signal('');
  chatLoading = signal(false);

  private pollSub?: Subscription;
  private chatUiSub?: Subscription;
  private realtimeSubs: Subscription[] = [];

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

  ngOnInit(): void {
    this.loadProfilePhoto();
    this.refreshNotifications();
    this.refreshConversations();

    this.realtime.connect();
    this.realtimeSubs.push(
      this.realtime.notification$.subscribe((notif) => this.onRealtimeNotification(notif)),
      this.realtime.conversation$.subscribe(() => this.refreshConversations()),
      this.realtime.message$.subscribe((msg) => this.onRealtimeMessage(msg)),
    );

    this.pollSub = interval(60000).pipe(startWith(0)).subscribe(() => {
      this.refreshNotifications();
      this.refreshConversations();
    });

    this.chatUiSub = this.chatUiService.openChat$.subscribe((conv) => this.openConversation(conv));
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
    this.chatUiSub?.unsubscribe();
    this.realtimeSubs.forEach((s) => s.unsubscribe());
    const conv = this.activeConversation();
    if (conv) this.realtime.unsubscribeChat(conv.id);
  }

  private onRealtimeNotification(notif: Notificacion): void {
    const current = this.notifications();
    const exists = current.some((n) => n.id === notif.id);
    const updated = exists ? current.map((n) => (n.id === notif.id ? notif : n)) : [notif, ...current];
    this.notifications.set(updated);
    this.unreadNotifCount.set(updated.filter((n) => !n.leida).length);
    if (notif.tipo === 'MENSAJE') {
      this.refreshConversations();
    }
  }

  private onRealtimeMessage(msg: Mensaje): void {
    const conv = this.activeConversation();
    if (!conv || conv.id !== msg.conversacionId) return;
    const current = this.messages();
    if (current.some((m) => m.id === msg.id)) return;
    this.messages.set([...current, msg]);
    this.refreshConversations();
  }

  loadProfilePhoto(): void {
    const user = this.authService.currentUser();
    if (!user?.id) return;

    if (this.isRecruiter()) {
      this.reclutadorService.getProfile(user.id).subscribe({
        next: (p) => this.authService.updateSessionUser({ fotoPerfil: p.fotoPerfil, empresa: p.empresa }),
      });
    } else {
      this.postanteService.getProfile(user.id).subscribe({
        next: (p) => this.authService.updateSessionUser({ fotoPerfil: p.fotoPerfil }),
      });
    }
  }

  refreshNotifications(): void {
    const user = this.authService.currentUser();
    if (!user?.id) return;
    const tipo = this.authService.userTipoApi();

    this.notificationService.list(user.id, tipo).subscribe({
      next: (list) => {
        this.notifications.set(list);
        this.unreadNotifCount.set(list.filter(n => !n.leida).length);
      },
    });
  }

  refreshConversations(): void {
    const user = this.authService.currentUser();
    if (!user?.id) return;
    const tipo = this.authService.userTipoApi();

    this.chatService.listConversations(user.id, tipo).subscribe({
      next: (list) => {
        this.conversations.set(list);
        this.unreadMsgCount.set(list.reduce((acc, c) => acc + (c.mensajesNoLeidos ?? 0), 0));
      },
    });
  }

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
    if (this.msgOpen()) this.refreshConversations();
  }

  toggleProfile(event: Event): void {
    event.stopPropagation();
    this.profileOpen.update(v => !v);
    this.notifOpen.set(false);
    this.msgOpen.set(false);
  }

  markNotifRead(notif: Notificacion): void {
    if (!notif.leida) {
      this.notificationService.markRead(notif.id).subscribe({
        next: () => this.refreshNotifications(),
      });
    }
    if (notif.tipo === 'MENSAJE' && notif.referenciaId) {
      const conv = this.conversations().find((c) => c.id === notif.referenciaId);
      if (conv) {
        this.notifOpen.set(false);
        this.openConversation(conv);
      } else {
        this.refreshConversations();
      }
    }
  }

  markAllNotifsRead(): void {
    const user = this.authService.currentUser();
    if (!user?.id) return;
    this.notificationService.markAllRead(user.id, this.authService.userTipoApi()).subscribe({
      next: () => this.refreshNotifications(),
    });
  }

  openChatFromDropdown(conv: Conversacion): void {
    this.msgOpen.set(false);
    this.openConversation(conv);
  }

  toggleChatPanel(): void {
    this.chatOpen.update(v => !v);
    if (this.chatOpen()) this.refreshConversations();
  }

  openConversation(conv: Conversacion): void {
    this.activeConversation.set(conv);
    this.chatExpanded.set(true);
    this.chatOpen.set(true);
    this.loadMessages(conv.id);

    const user = this.authService.currentUser();
    if (!user?.id) return;
    const lectorTipo = this.isRecruiter() ? 'RECLUTADOR' : 'POSTANTE';
    this.chatService.markRead(conv.id, lectorTipo, user.id).subscribe({
      next: () => this.refreshConversations(),
    });

    this.realtime.subscribeChat(conv.id);
  }

  loadMessages(conversacionId: number): void {
    this.chatService.getMessages(conversacionId).subscribe({
      next: (msgs) => this.messages.set(msgs),
    });
  }

  sendMessage(): void {
    const conv = this.activeConversation();
    const user = this.authService.currentUser();
    const text = this.newMessage().trim();
    if (!conv || !user?.id || !text) return;

    const remitenteTipo = this.isRecruiter() ? 'RECLUTADOR' : 'POSTANTE';
    this.chatLoading.set(true);
    this.chatService.sendMessage(conv.id, remitenteTipo, user.id, text).subscribe({
      next: () => {
        this.newMessage.set('');
        this.loadMessages(conv.id);
        this.refreshConversations();
        this.chatLoading.set(false);
      },
      error: () => this.chatLoading.set(false),
    });
  }

  closeChat(): void {
    const conv = this.activeConversation();
    if (conv) this.realtime.unsubscribeChat(conv.id);
    this.chatExpanded.set(false);
    this.activeConversation.set(null);
  }

  convAvatar(conv: Conversacion): string {
    if (this.isRecruiter()) {
      return conv.postanteFoto || this.auth.avatarUrl(conv.postanteNombre);
    }
    return conv.reclutadorFoto || this.auth.avatarUrl(conv.reclutadorNombre);
  }

  convName(conv: Conversacion): string {
    return this.isRecruiter()
      ? conv.postanteNombre
      : `${conv.reclutadorNombre} · ${conv.reclutadorEmpresa ?? 'Empresa'}`;
  }

  isOwnMessage(msg: Mensaje): boolean {
    const user = this.authService.currentUser();
    if (!user?.id) return false;
    const tipo = this.isRecruiter() ? 'RECLUTADOR' : 'POSTANTE';
    return msg.remitenteTipo === tipo && msg.remitenteId === user.id;
  }

  logout(): void {
    this.realtime.disconnect();
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
