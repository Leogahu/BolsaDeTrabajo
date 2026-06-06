import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { AlertaService, AlertaEmpleo } from '../../../core/services/alerta';
import { JobService } from '../../../core/services/job';
import { JobOffer } from '../../../shared/models/job-offer';

@Component({
  selector: 'app-alertas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './alertas.html',
  styleUrl: './alertas.css',
})
export class Alertas implements OnInit {
  private auth = inject(AuthService);
  private alertaService = inject(AlertaService);
  private jobService = inject(JobService);

  keyword = signal('Frontend');
  modality = signal('Remoto');
  frequency = signal('Diaria');
  alerts = signal<AlertaEmpleo[]>([]);
  matches = signal<JobOffer[]>([]);
  loading = signal(false);
  saving = signal(false);
  message = signal<string | null>(null);

  ngOnInit(): void {
    this.loadAlerts();
    this.searchMatches();
  }

  loadAlerts(): void {
    const userId = this.auth.currentUser()?.id;
    if (!userId) return;
    this.alertaService.list(userId).subscribe({
      next: (alerts) => this.alerts.set(alerts),
    });
  }

  saveAlert(): void {
    const userId = this.auth.currentUser()?.id;
    if (!userId) return;
    this.saving.set(true);
    this.alertaService.create(userId, {
      keyword: this.keyword(),
      modalidad: this.modality(),
      frecuencia: this.frequency(),
    }).subscribe({
      next: () => {
        this.loadAlerts();
        this.searchMatches();
        this.message.set('Alerta guardada correctamente.');
        this.saving.set(false);
      },
      error: () => {
        this.message.set('No se pudo guardar la alerta.');
        this.saving.set(false);
      },
    });
  }

  removeAlert(id: number): void {
    this.alertaService.delete(id).subscribe({
      next: () => {
        this.loadAlerts();
        this.searchMatches();
      },
    });
  }

  searchMatches(): void {
    this.loading.set(true);
    this.jobService.getJobs(0, 50).subscribe({
      next: (page) => {
        const keywords = this.alerts().map(a => a.keyword.toLowerCase());
        const modalities = this.alerts().map(a => a.modalidad).filter(Boolean);

        const filtered = page.content.filter(job => {
          const title = (job.titulo ?? '').toLowerCase();
          const matchesKeyword = keywords.length === 0 || keywords.some(k => title.includes(k));
          const matchesModality = modalities.length === 0 || modalities.includes(job.tipoModalidad ?? '');
          return matchesKeyword && matchesModality;
        });

        this.matches.set(filtered);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  companyName(job: JobOffer): string {
    if (typeof job.empresa === 'string') return job.empresa;
    return job.empresa?.nombre || 'Empresa';
  }
}
