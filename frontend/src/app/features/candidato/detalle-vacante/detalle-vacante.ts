import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JobService } from '../../../core/services/job';
import { AuthService } from '../../../core/services/auth';
import { JobOffer } from '../../../shared/models/job-offer';

@Component({
  selector: 'app-detalle-vacante',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-vacante.html',
  styleUrl: './detalle-vacante.css',
})
export class DetalleVacante implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private jobService = inject(JobService);
  private auth = inject(AuthService);

  job = signal<JobOffer | null>(null);
  message = signal<string | null>(null);
  applying = signal(false);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;

    this.jobService.getJobById(id).subscribe({
      next: (job) => this.job.set(job),
      error: () => this.message.set('No se pudo cargar la vacante.'),
    });
  }

  companyName(): string {
    const job = this.job();
    if (!job) return 'Empresa Confidencial';
    if (typeof job.empresa === 'string') return job.empresa;
    return job.empresa?.nombre || job.nombreEmpresa || 'Empresa Confidencial';
  }
  companyLogo(): string | null {
    const job = this.job();
    if (!job || typeof job.empresa === 'string') return null;
    return job.empresa?.fotoEmpresa || null;
  }
  salaryLabel(): string {
    const job = this.job();
    if (!job) return 'Consultar';
    const min = job.sueldoMin ?? job.salarioMinimo;
    const max = job.sueldoMax ?? job.salarioMaximo;
    if (min && max) return `S/ ${min} - S/ ${max}`;
    if (min || max) return `S/ ${min ?? max}`;
    return 'Sueldo no especificado';
  }

  apply(): void {
    const user = this.auth.currentUser();
    const job = this.job();
    if (!user || !job?.id) {
      this.router.navigate(['/login']);
      return;
    }

    this.applying.set(true);
    this.message.set(null);

    this.jobService.applyToJob(user.id, job.id).subscribe({
      next: () => {
        this.message.set('¡Te has postulado con éxito a esta vacante!');
        this.applying.set(false);
      },
      error: (err) => {
        this.message.set(err.error?.error || err.error?.message || 'No se pudo procesar la postulación.');
        this.applying.set(false);
      },
    });
  }
}
