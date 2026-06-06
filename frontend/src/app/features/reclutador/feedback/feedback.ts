import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth';
import { JobService } from '../../../core/services/job';

interface FeedbackItem {
  candidate: string;
  role: string;
  comment: string;
  estado: string;
}

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

  feedbackItems = signal<FeedbackItem[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    const recruiterId = this.auth.currentUser()?.id;
    if (!recruiterId) {
      this.loading.set(false);
      return;
    }

    this.jobService.getRecruiterJobs(recruiterId).subscribe({
      next: (jobs) => {
        const withId = jobs.filter((j) => j.id);
        if (withId.length === 0) {
          this.loading.set(false);
          return;
        }

        forkJoin(
          withId.map((job) =>
            this.jobService.getCandidates(job.id!).pipe(
              map((candidates) =>
                candidates
                  .filter((c) => c.motivo)
                  .map((c) => ({
                    candidate: `${c.postante?.nombres ?? ''} ${c.postante?.apellidos ?? ''}`.trim() || 'Candidato',
                    role: c.postulacion?.titulo ?? job.titulo ?? 'Vacante',
                    comment: c.motivo ?? '',
                    estado: c.estado,
                  }))
              ),
              catchError(() => of([] as FeedbackItem[]))
            )
          )
        ).subscribe({
          next: (results) => {
            this.feedbackItems.set(results.flat());
            this.loading.set(false);
          },
          error: () => this.loading.set(false),
        });
      },
      error: () => this.loading.set(false),
    });
  }
}
