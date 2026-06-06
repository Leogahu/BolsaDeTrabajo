import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../constants/api';

export interface AlertaEmpleo {
  id: number;
  keyword: string;
  modalidad?: string;
  frecuencia?: string;
  activa: boolean;
  fechaCreacion?: string;
}

@Injectable({ providedIn: 'root' })
export class AlertaService {
  private http = inject(HttpClient);

  list(postanteId: number): Observable<AlertaEmpleo[]> {
    return this.http.get<AlertaEmpleo[]>(`${API_BASE}/alertas-empleo/postante/${postanteId}`);
  }

  create(postanteId: number, data: { keyword: string; modalidad?: string; frecuencia?: string }): Observable<AlertaEmpleo> {
    return this.http.post<AlertaEmpleo>(`${API_BASE}/alertas-empleo/postante/${postanteId}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/alertas-empleo/${id}`);
  }
}

export { AlertaService as Alerta };
