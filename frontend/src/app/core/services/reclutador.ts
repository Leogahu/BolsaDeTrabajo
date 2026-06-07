import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config';

export interface ReclutadorProfile {
  id: number;
  username: string;
  nombres: string;
  apellidos: string;
  email: string;
  empresa: string;
  telefono?: string;
  cargo?: string;
  descripcion?: string;
  fotoPerfil?: string;
  sector?: string;
}

export interface ReclutadorUpdatePayload {
  nombres?: string;
  apellidos?: string;
  email?: string;
  empresa?: string;
  password?: string;
}

@Injectable({ providedIn: 'root' })
export class ReclutadorService {
  private http          = inject(HttpClient);
  private configService = inject(ConfigService);

  private get api(): string { return this.configService.apiUrl; }

  getProfile(id: number): Observable<ReclutadorProfile> {
    return this.http.get<ReclutadorProfile>(`${this.api}/reclutadores/${id}`);
  }

  updateProfile(id: number, data: ReclutadorUpdatePayload): Observable<ReclutadorProfile> {
    return this.http.put<ReclutadorProfile>(`${this.api}/reclutadores/${id}`, data);
  }

  updateProfileComplete(id: number, formData: FormData): Observable<ReclutadorProfile> {
    return this.http.put<ReclutadorProfile>(`${this.api}/reclutadores/${id}/completo`, formData);
  }
}

export { ReclutadorService as Reclutador };