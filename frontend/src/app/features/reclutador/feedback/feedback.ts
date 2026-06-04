import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth';
import { JobService } from '../../../core/services/job';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feedback.html',
  styleUrl: './feedback.css',
})
export class Feedback implements OnInit {
  private auth = inject(AuthService);
  private jobService = inject(JobService);

  feedbackItems = signal<{ candidate: string; role: string; comment: string }[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    const recruiterId = this.auth.currentUser()?.id;
    if (!recruiterId) {
      this.loading.set(false);
      return;
    }

    this.jobService.getRecruiterJobs(recruiterId).subscribe({
      next: (jobs) => {
        if (jobs.length === 0) {
          this.loading.set(false);
          return;
        }
        const firstJob = jobs[0];
        if (!firstJob.id) {
          this.loading.set(false);
          return;
        }
        this.jobService.getCandidates(firstJob.id).subscribe({
          next: (candidates) => {
            this.feedbackItems.set(
              candidates
                .filter(c => c.motivo)
                .map(c => ({
                  candidate: `${c.postante?.nombres ?? ''} ${c.postante?.apellidos ?? ''}`.trim() || 'Candidato',
                  role: c.postulacion?.titulo ?? 'Vacante',
                  comment: c.motivo ?? '',
                }))
            );
            this.loading.set(false);
          },
          error: () => this.loading.set(false),
        });
      },
      error: () => this.loading.set(false),
    });
  }
}
