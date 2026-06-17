import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JobService } from '../../../core/services/job';
import { JobOffer } from '../../../shared/models/job-offer';

@Component({
  selector: 'app-explorar-vacantes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './explorar-vacantes.html',
  styleUrl: './explorar-vacantes.css'
})
export class ExplorarVacantesComponent implements OnInit {
  private jobService = inject(JobService);

  currentPage = signal(0);
  isLastPage = signal(false);
  allJobs = signal<JobOffer[]>([]);
  searchKeyword = signal('');
  selectedJobTypes = signal<string[]>([]);
  selectedModalities = signal<string[]>([]);
  loading = signal(false);

  readonly jobTypeFilters = [
    'Practicas Preprofesionales',
    'Practicas Profesionales',
    'Empleo Junior',
  ];

  readonly modalityFilters = ['Remoto', 'Presencial', 'Hibrido'];

  filteredJobs = computed(() => {
    const keyword = this.searchKeyword().toLowerCase().trim();
    const types = this.selectedJobTypes();
    const modalities = this.selectedModalities();

    return this.allJobs().filter(job => {
      const matchesKeyword = !keyword || (job.titulo ?? '').toLowerCase().includes(keyword);
      const matchesType = types.length === 0 || types.includes(job.tipoPuesto ?? '');
      const matchesModality = modalities.length === 0 || modalities.includes(job.tipoModalidad ?? '');
      return matchesKeyword && matchesType && matchesModality;
    });
  });

  ngOnInit(): void {
    this.loadMoreJobs();
  }

  loadMoreJobs(): void {
    if (this.loading() || this.isLastPage()) return;
    this.loading.set(true);

    this.jobService.getJobs(this.currentPage(), 16).subscribe({
      next: (res) => {
        this.allJobs.update(current => [...current, ...res.content]);
        this.isLastPage.set(res.last);
        if (!res.last) {
          this.currentPage.update(p => p + 1);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onSearchInput(value: string): void {
    this.searchKeyword.set(value);
  }

  isFilterActive(type: 'type' | 'modality', value: string): boolean {
    return type === 'type'
      ? this.selectedJobTypes().includes(value)
      : this.selectedModalities().includes(value);
  }

  toggleFilter(type: 'type' | 'modality', value: string): void {
    if (type === 'type') {
      this.selectedJobTypes.update(list =>
        list.includes(value) ? list.filter(v => v !== value) : [...list, value]
      );
    } else {
      this.selectedModalities.update(list =>
        list.includes(value) ? list.filter(v => v !== value) : [...list, value]
      );
    }
  }

  companyName(job: JobOffer): string {
    if (typeof job.empresa === 'string') return job.empresa;
    return job.empresa?.nombre || job.nombreEmpresa || 'Empresa Aliada';
  }
  companyLogo(job: JobOffer): string | null {
    if (typeof job.empresa === 'string') return null;
    return job.empresa?.fotoEmpresa || null;
  }
  companyInitials(job: JobOffer): string {
    return this.companyName(job).substring(0, 2).toUpperCase();
  }

  salaryLabel(job: JobOffer): string {
    const min = job.sueldoMin ?? job.salarioMinimo;
    const max = job.sueldoMax ?? job.salarioMaximo;
    if (min && max) return `S/ ${min} - S/ ${max}`;
    if (min || max) return `S/ ${min ?? max}`;
    return 'Consultar';
  }
}

export { ExplorarVacantesComponent as ExplorarVacantes };
