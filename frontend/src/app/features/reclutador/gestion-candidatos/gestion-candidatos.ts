import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { JobService } from '../../../core/services/job';
import { PostanteService } from '../../../core/services/postante';
import { ChatService } from '../../../core/services/chat';
import { ChatUiService } from '../../../core/services/chat-ui';
import { JobOffer } from '../../../shared/models/job-offer';
import { PostulacionEstado, PostanteProfile } from '../../../shared/models/postante';

@Component({
  selector: 'app-gestion-candidatos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-candidatos.html',
  styleUrl: './gestion-candidatos.css',
})
export class GestionCandidatos implements OnInit {
  private auth = inject(AuthService);
  private jobService = inject(JobService);
  private postanteService = inject(PostanteService);
  private chatService = inject(ChatService);
  private chatUi = inject(ChatUiService);

  jobs = signal<JobOffer[]>([]);
  selectedJobId = signal<number | null>(null);
  candidates = signal<PostulacionEstado[]>([]);
  selectedCandidate = signal<PostulacionEstado | null>(null);
  candidateProfile = signal<PostanteProfile | null>(null);
  message = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  showStatusModal = signal(false);
  selectedStatus = signal('EN_REVISION');
  statusMotivo = signal('');

  readonly statusOptions = [
    { value: 'CV_ENVIADO', label: 'CV enviado', color: '#64748b' },
    { value: 'EN_REVISION', label: 'En revisión', color: '#2563eb' },
    { value: 'CONTACTARAN', label: 'Contactar', color: '#7c3aed' },
    { value: 'FINALIZADO', label: 'Finalizado', color: '#16a34a' },
  ];

  ngOnInit(): void {
    const recruiterId = this.auth.currentUser()?.id;
    if (!recruiterId) return;

    this.jobService.getRecruiterJobs(recruiterId).subscribe({
      next: (jobs) => {
        this.jobs.set(jobs);
        if (jobs[0]?.id) this.selectJob(jobs[0].id!);
      },
    });
  }

  selectJob(jobId: number): void {
    this.selectedJobId.set(jobId);
    this.selectedCandidate.set(null);
    this.candidateProfile.set(null);
    this.jobService.getCandidates(jobId).subscribe({
      next: (candidates) => {
        this.candidates.set(candidates);
        if (candidates[0]) this.selectCandidate(candidates[0]);
      },
    });
  }

  selectCandidate(candidate: PostulacionEstado): void {
    this.selectedCandidate.set(candidate);
    this.errorMessage.set(null);
    const postanteId = candidate.postante?.id;
    if (postanteId) {
      this.postanteService.getProfile(postanteId).subscribe({
        next: (profile) => this.candidateProfile.set(profile),
      });
    }
  }

  openStatusModal(): void {
    const c = this.selectedCandidate();
    if (!c) {
      this.errorMessage.set('Selecciona un candidato.');
      return;
    }
    this.selectedStatus.set(c.estado || 'EN_REVISION');
    this.statusMotivo.set('');
    this.showStatusModal.set(true);
  }

  confirmStatusUpdate(): void {
    const c = this.selectedCandidate();
    const jobId = this.selectedJobId();
    if (!c?.id || !jobId) return;

    this.jobService.updateApplicationStatus(c.id, this.selectedStatus(), this.statusMotivo()).subscribe({
      next: () => {
        this.message.set('Estado actualizado correctamente.');
        this.showStatusModal.set(false);
        this.selectJob(jobId);
      },
      error: (err) => this.errorMessage.set(err.error?.message || 'No se pudo actualizar.'),
    });
  }

  openChat(): void {
    const c = this.selectedCandidate();
    if (!c?.id) return;

    if (c.estado !== 'CONTACTARAN' && c.estado !== 'FINALIZADO') {
      this.errorMessage.set('El chat se habilita al cambiar el estado a "Contactar".');
      return;
    }

    this.chatService.getFromPostulacion(c.id).subscribe({
      next: (conv) => {
        this.chatUi.requestOpen(conv);
        this.message.set('Chat abierto.');
        this.errorMessage.set(null);
      },
      error: (err) => this.errorMessage.set(err.error?.message || 'No se pudo abrir el chat.'),
    });
  }

  candidateAvatar(candidate: PostulacionEstado): string {
    const p = candidate.postante;
    if (p?.fotoPerfil) return p.fotoPerfil;
    return this.auth.avatarUrl(this.candidateName(candidate));
  }

  candidateName(candidate: PostulacionEstado): string {
    const p = candidate.postante;
    if (!p) return 'Candidato';
    return `${p.nombres ?? ''} ${p.apellidos ?? ''}`.trim() || 'Candidato';
  }

  statusLabel(estado: string): string {
    return this.statusOptions.find(s => s.value === estado)?.label ?? estado;
  }

  statusColor(estado: string): string {
    return this.statusOptions.find(s => s.value === estado)?.color ?? '#64748b';
  }

  selectedJobTitle(): string {
    const id = this.selectedJobId();
    return this.jobs().find(j => j.id === id)?.titulo ?? 'Vacante';
  }
}
