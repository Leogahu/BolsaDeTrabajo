import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { JobService } from '../../../core/services/job';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private auth = inject(AuthService);
  private jobService = inject(JobService);

  readonly userName = signal('Reclutador');
  readonly totalVacancies = signal(0);
  readonly totalApplicants = signal(0);

  ngOnInit(): void {
    this.userName.set(this.auth.currentUser()?.nombreCompleto ?? 'Reclutador');
    const recruiterId = this.auth.currentUser()?.id;
    if (!recruiterId) return;

    this.jobService.getRecruiterJobs(recruiterId).subscribe({
      next: (jobs) => {
        this.totalVacancies.set(jobs.length);
        this.totalApplicants.set(jobs.reduce((acc, job) => acc + (job.cantidadCandidatos ?? 0), 0));
      },
    });
  }
}
