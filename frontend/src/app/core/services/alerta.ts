import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config';

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
  private http          = inject(HttpClient);
  private configService = inject(ConfigService);

  private get api(): string { return this.configService.apiUrl; }

  list(postanteId: number): Observable<AlertaEmpleo[]> {
    return this.http.get<AlertaEmpleo[]>(`${this.api}/alertas-empleo/postante/${postanteId}`);
  }

  create(postanteId: number, data: { keyword: string; modalidad?: string; frecuencia?: string }): Observable<AlertaEmpleo> {
    return this.http.post<AlertaEmpleo>(`${this.api}/alertas-empleo/postante/${postanteId}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/alertas-empleo/${id}`);
  }
}

export { AlertaService as Alerta };