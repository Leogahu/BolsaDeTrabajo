import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth';
import { JobService } from '../../../core/services/job';
import { JobOffer } from '../../../shared/models/job-offer';
import { PostulacionEstado } from '../../../shared/models/postante';

@Component({
  selector: 'app-gestion-candidatos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestion-candidatos.html',
  styleUrl: './gestion-candidatos.css',
})
export class GestionCandidatos implements OnInit {
  private auth = inject(AuthService);
  private jobService = inject(JobService);

  jobs = signal<JobOffer[]>([]);
  selectedJobId = signal<number | null>(null);
  candidates = signal<PostulacionEstado[]>([]);
  selectedCandidateId = signal<number | null>(null);
  message = signal<string | null>(null);

  readonly statusOptions = [
    { value: 'CV_ENVIADO', label: 'CV enviado' },
    { value: 'EN_REVISION', label: 'En revisión' },
    { value: 'CONTACTARAN', label: 'Te contactarán' },
    { value: 'FINALIZADO', label: 'Finalizado' },
  ];

  ngOnInit(): void {
    const recruiterId = this.auth.currentUser()?.id;
    if (!recruiterId) return;

    this.jobService.getRecruiterJobs(recruiterId).subscribe({
      next: (jobs) => {
        this.jobs.set(jobs);
        if (jobs[0]?.id) {
          this.selectJob(jobs[0].id!);
        }
      },
    });
  }

  selectJob(jobId: number): void {
    this.selectedJobId.set(jobId);
    this.selectedCandidateId.set(null);
    this.jobService.getCandidates(jobId).subscribe({
      next: (candidates) => {
        this.candidates.set(candidates);
        if (candidates[0]?.id) {
          this.selectedCandidateId.set(candidates[0].id);
        }
      },
    });
  }

  selectCandidate(candidateId: number): void {
    this.selectedCandidateId.set(candidateId);
  }

  updateStatus(estado: string): void {
    const estadoId = this.selectedCandidateId();
    const jobId = this.selectedJobId();
    if (!estadoId || !jobId) {
      this.message.set('Selecciona un candidato primero.');
      return;
    }

    const motivo = window.prompt('Motivo o comentario (opcional):') ?? '';

    this.jobService.updateApplicationStatus(estadoId, estado, motivo).subscribe({
      next: () => {
        this.message.set('Estado actualizado correctamente.');
        this.selectJob(jobId);
      },
      error: (err) => {
        this.message.set(err.error?.message || 'No se pudo actualizar el estado.');
      },
    });
  }

  candidateName(candidate: PostulacionEstado): string {
    const p = candidate.postante;
    if (!p) return 'Candidato';
    return `${p.nombres ?? ''} ${p.apellidos ?? ''}`.trim() || 'Candidato';
  }

  statusLabel(estado: string): string {
    return this.statusOptions.find(s => s.value === estado)?.label ?? estado;
  }
}
