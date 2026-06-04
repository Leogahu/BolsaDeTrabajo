export interface JobOffer {
  id?: number;
  titulo: string;
  tipoPuesto?: string;
  ubicacion?: string;
  descripcion?: string;
  requisitos?: string;
  tipoModalidad?: string;
  salarioMinimo?: number;
  salarioMaximo?: number;
  sueldoMin?: number;
  sueldoMax?: number;
  fechaPublicacion?: string;
  cantidadCandidatos?: number;
  candidatos?: unknown[];
  empresa?: { nombre?: string; totalVacantes?: number } | string;
  nombreEmpresa?: string;
}

export interface JobPage {
  content: JobOffer[];
  last: boolean;
}
