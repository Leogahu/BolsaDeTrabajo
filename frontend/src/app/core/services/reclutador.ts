import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../constants/api';

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
  private http = inject(HttpClient);

  getProfile(id: number): Observable<ReclutadorProfile> {
    return this.http.get<ReclutadorProfile>(`${API_BASE}/reclutadores/${id}`);
  }

  updateProfile(id: number, data: ReclutadorUpdatePayload): Observable<ReclutadorProfile> {
    return this.http.put<ReclutadorProfile>(`${API_BASE}/reclutadores/${id}`, data);
  }

  updateProfileComplete(id: number, formData: FormData): Observable<ReclutadorProfile> {
    return this.http.put<ReclutadorProfile>(`${API_BASE}/reclutadores/${id}/completo`, formData);
  }
}

export { ReclutadorService as Reclutador };
