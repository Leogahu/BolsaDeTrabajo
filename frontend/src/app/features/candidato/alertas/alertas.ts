import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../../core/services/job';
import { JobOffer } from '../../../shared/models/job-offer';

interface JobAlert {
  title: string;
  company: string;
  frequency: string;
  keyword: string;
  modality: string;
}

@Component({
  selector: 'app-alertas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alertas.html',
  styleUrl: './alertas.css',
})
export class Alertas implements OnInit {
  private jobService = inject(JobService);
  private readonly storageKey = 'jobAlerts';

  keyword = signal('Frontend');
  modality = signal('Remoto');
  frequency = signal('Diaria');
  alerts = signal<JobAlert[]>([]);
  matches = signal<JobOffer[]>([]);
  loading = signal(false);

  ngOnInit(): void {
    this.loadAlerts();
    this.searchMatches();
  }

  loadAlerts(): void {
    const raw = localStorage.getItem(this.storageKey);
    if (raw) {
      try {
        this.alerts.set(JSON.parse(raw) as JobAlert[]);
      } catch { /* ignore */ }
    }
  }

  saveAlert(): void {
    const alert: JobAlert = {
      title: `Alerta: ${this.keyword()}`,
      company: 'Cualquier empresa',
      frequency: this.frequency(),
      keyword: this.keyword(),
      modality: this.modality(),
    };
    const updated = [...this.alerts(), alert];
    this.alerts.set(updated);
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
    this.searchMatches();
  }

  removeAlert(index: number): void {
    const updated = this.alerts().filter((_, i) => i !== index);
    this.alerts.set(updated);
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
    this.searchMatches();
  }

  searchMatches(): void {
    this.loading.set(true);
    this.jobService.getJobs(0, 50).subscribe({
      next: (page) => {
        const keywords = this.alerts().map(a => a.keyword.toLowerCase());
        const modalities = this.alerts().map(a => a.modality);

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
