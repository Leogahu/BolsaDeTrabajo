import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { JobService } from '../../../core/services/job';
import { JobOffer } from '../../../shared/models/job-offer';

@Component({
  selector: 'app-vacantes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vacantes.html',
  styleUrl: './vacantes.css',
})
export class Vacantes implements OnInit {
  private auth = inject(AuthService);
  private jobService = inject(JobService);
  private router = inject(Router);

  jobs = signal<JobOffer[]>([]);
  deleteTarget = signal<number | null>(null);
  showDeleteModal = signal(false);

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    const recruiterId = this.auth.currentUser()?.id;
    if (!recruiterId) return;

    this.jobService.getRecruiterJobs(recruiterId).subscribe({
      next: (jobs) => this.jobs.set(jobs),
    });
  }

  editJob(id?: number): void {
    if (!id) return;
    this.router.navigate(['/reclutador/publicar-oferta'], { queryParams: { editId: id } });
  }

  confirmDelete(id?: number): void {
    if (!id) return;
    this.deleteTarget.set(id);
    this.showDeleteModal.set(true);
  }

  deleteJob(): void {
    const id = this.deleteTarget();
    if (!id) return;

    this.jobService.deleteJobOffer(id).subscribe({
      next: () => {
        this.showDeleteModal.set(false);
        this.deleteTarget.set(null);
        this.loadJobs();
      },
    });
  }

  goToPublish(): void {
    this.router.navigate(['/reclutador/publicar-oferta']);
  }
}
