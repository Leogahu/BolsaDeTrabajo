export interface AvisoRequest {
  titulo: string;
  descripcion: string;
  requisitos: string;
  ubicacion: string;
  salarioMinimo: number;
  salarioMaximo: number;
  tipoModalidad: string;
  tipoPuesto: string;
}
export interface AvisoResponse {
  id: number;
  titulo: string;
  descripcion: string;
  requisitos: string;
  ubicacion: string;
  salarioMinimo: number;
  salarioMaximo: number;
  tipoModalidad: string;
  tipoPuesto: string;
  nombreEmpresa?: string;
  fechaPublicacion?: string;
}