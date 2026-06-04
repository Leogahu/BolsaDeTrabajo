import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth';
import { JobService } from '../../../core/services/job';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css',
})
export class Reportes implements OnInit {
  private auth = inject(AuthService);
  private jobService = inject(JobService);

  readonly metrics = signal([
    { label: 'Vacantes publicadas', value: '0' },
    { label: 'Postulaciones recibidas', value: '0' },
    { label: 'Promedio candidatos/vacante', value: '0' },
    { label: 'Vacantes con candidatos', value: '0' },
  ]);
  loading = signal(true);

  ngOnInit(): void {
    const recruiterId = this.auth.currentUser()?.id;
    if (!recruiterId) {
      this.loading.set(false);
      return;
    }

    this.jobService.getRecruiterJobs(recruiterId).subscribe({
      next: (jobs) => {
        const totalApplicants = jobs.reduce((acc, j) => acc + (j.cantidadCandidatos ?? 0), 0);
        const withCandidates = jobs.filter(j => (j.cantidadCandidatos ?? 0) > 0).length;
        const avg = jobs.length ? (totalApplicants / jobs.length).toFixed(1) : '0';

        this.metrics.set([
          { label: 'Vacantes publicadas', value: String(jobs.length) },
          { label: 'Postulaciones recibidas', value: String(totalApplicants) },
          { label: 'Promedio candidatos/vacante', value: avg },
          { label: 'Vacantes con candidatos', value: String(withCandidates) },
        ]);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
