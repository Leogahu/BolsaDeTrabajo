import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { PostanteService } from '../../../core/services/postante';
import { ChatService } from '../../../core/services/chat';
import { ChatUiService } from '../../../core/services/chat-ui';
import { PostulacionEstado } from '../../../shared/models/postante';

@Component({
  selector: 'app-postulaciones',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './postulaciones.html',
  styleUrl: './postulaciones.css',
})
export class Postulaciones {
  private auth = inject(AuthService);
  private postanteService = inject(PostanteService);
  private chatService = inject(ChatService);
  private chatUi = inject(ChatUiService);

  applications = signal<PostulacionEstado[]>([]);
  loading = signal(true);
  message = signal<string | null>(null);

  ngOnInit(): void {
    const userId = this.auth.currentUser()?.id;
    if (!userId) {
      this.loading.set(false);
      return;
    }

    this.postanteService.getApplications(userId).subscribe({
      next: (apps) => {
        this.applications.set(apps);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  title(app: PostulacionEstado): string {
    return app.postulacion?.titulo || 'Vacante';
  }

  company(app: PostulacionEstado): string {
    const empresa = app.postulacion?.empresa;
    if (typeof empresa === 'string') return empresa;
    return empresa?.nombre || 'Empresa';
  }

  statusLabel(estado: string): string {
    const labels: Record<string, string> = {
      CV_ENVIADO: 'CV enviado',
      EN_REVISION: 'En revisión',
      CONTACTARAN: 'Te contactarán',
      FINALIZADO: 'Finalizado',
    };
    return labels[estado] ?? estado;
  }

  canChat(estado: string): boolean {
    return estado === 'CONTACTARAN' || estado === 'FINALIZADO';
  }

  openChat(app: PostulacionEstado): void {
    if (!app.id) return;
    this.chatService.getFromPostulacion(app.id).subscribe({
      next: (conv) => {
        this.chatUi.requestOpen(conv);
        this.message.set('Chat abierto.');
      },
      error: (err) => this.message.set(err.error?.message || 'No se pudo abrir el chat.'),
    });
  }
}
