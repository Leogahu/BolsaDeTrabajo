import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { JobService } from '../../../core/services/job';
import { JobOffer } from '../../../shared/models/job-offer';

@Component({
  selector: 'app-publicar-oferta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './publicar-oferta.html',
  styleUrl: './publicar-oferta.css',
})
export class PublicarOferta implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private jobService = inject(JobService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  currentStep = signal(1);
  editId = signal<number | null>(null);
  publishing = signal(false);
  message = signal<string | null>(null);

  form = this.fb.group({
    titulo: ['', Validators.required],
    tipoPuesto: ['', Validators.required],
    ubicacion: ['', Validators.required],
    descripcion: ['', Validators.required],
    requisitos: ['', Validators.required],
    tipoModalidad: ['', Validators.required],
    salarioMinimo: [0, Validators.required],
    salarioMaximo: [0, Validators.required],
  });

  ngOnInit(): void {
    const editId = Number(this.route.snapshot.queryParamMap.get('editId'));
    if (!editId) return;

    this.editId.set(editId);
    this.jobService.getJobById(editId).subscribe({
      next: (job) => {
        this.form.patchValue({
          titulo: job.titulo,
          tipoPuesto: job.tipoPuesto,
          ubicacion: job.ubicacion,
          descripcion: job.descripcion,
          requisitos: job.requisitos,
          tipoModalidad: job.tipoModalidad,
          salarioMinimo: job.salarioMinimo ?? job.sueldoMin ?? 0,
          salarioMaximo: job.salarioMaximo ?? job.sueldoMax ?? 0,
        });
      },
    });
  }

  nextStep(): void {
    if (!this.validateStep(this.currentStep())) return;
    if (this.currentStep() < 4) {
      this.currentStep.update(s => s + 1);
    }
  }

  prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  validateStep(step: number): boolean {
    const controlsByStep: Record<number, string[]> = {
      1: ['titulo', 'tipoPuesto', 'ubicacion'],
      2: ['descripcion', 'requisitos'],
      3: ['tipoModalidad', 'salarioMinimo', 'salarioMaximo'],
    };

    const fields = controlsByStep[step] ?? [];
    let valid = true;
    fields.forEach(name => {
      const control = this.form.get(name);
      control?.markAsTouched();
      if (control?.invalid) valid = false;
    });

    const min = Number(this.form.value.salarioMinimo);
    const max = Number(this.form.value.salarioMaximo);
    if (step === 3 && min > max) {
      this.message.set('El salario mínimo no puede ser mayor que el máximo.');
      return false;
    }

    this.message.set(valid ? null : 'Completa los campos obligatorios del paso actual.');
    return valid;
  }

  publish(): void {
    if (!this.validateStep(3)) return;

    const recruiterId = this.auth.currentUser()?.id;
    if (!recruiterId) return;

    this.publishing.set(true);
    const payload: Partial<JobOffer> = {
      titulo: this.form.value.titulo ?? undefined,
      tipoPuesto: this.form.value.tipoPuesto ?? undefined,
      ubicacion: this.form.value.ubicacion ?? undefined,
      descripcion: this.form.value.descripcion ?? undefined,
      requisitos: this.form.value.requisitos ?? undefined,
      tipoModalidad: this.form.value.tipoModalidad ?? undefined,
      salarioMinimo: Number(this.form.value.salarioMinimo ?? 0),
      salarioMaximo: Number(this.form.value.salarioMaximo ?? 0),
      fechaPublicacion: new Date().toISOString(),
    };

    this.jobService.saveJobOffer(payload, recruiterId, this.editId()).subscribe({
      next: () => this.router.navigate(['/reclutador/vacantes']),
      error: (err) => {
        this.message.set(err.error?.error || 'No se pudo publicar la vacante.');
        this.publishing.set(false);
      },
      complete: () => this.publishing.set(false),
    });
  }
}
