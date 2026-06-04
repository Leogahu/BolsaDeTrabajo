import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../constants/api';
import { Habilidad, PostanteProfile, PostulacionEstado, Certificado } from '../../shared/models/postante';

@Injectable({
  providedIn: 'root'
})
export class PostanteService {
  private http = inject(HttpClient);

  getProfile(id: number): Observable<PostanteProfile> {
    return this.http.get<PostanteProfile>(`${API_BASE}/postantes/${id}`);
  }

  getApplications(id: number): Observable<PostulacionEstado[]> {
    return this.http.get<PostulacionEstado[]>(`${API_BASE}/postantes/${id}/postulaciones`);
  }

  getSkills(id: number): Observable<Habilidad[]> {
    return this.http.get<Habilidad[]>(`${API_BASE}/postantes/${id}/habilidades`);
  }

  addSkills(id: number, habilidades: string[]): Observable<PostanteProfile> {
    return this.http.post<PostanteProfile>(`${API_BASE}/postantes/${id}/habilidades`, habilidades);
  }

  verifySkill(habilidadId: number): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${API_BASE}/postantes/habilidades/${habilidadId}/verificar`, {});
  }

  updateDescription(id: number, descripcion: string): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${API_BASE}/postantes/${id}/descripcion`, { descripcion });
  }

  updateProfileComplete(id: number, formData: FormData): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${API_BASE}/postantes/${id}/completo`, formData);
  }

  getCertificados(id: number): Observable<Certificado[]> {
    return this.http.get<Certificado[]>(`${API_BASE}/postantes/${id}/certificados`);
  }

  addCertificado(id: number, nombreCurso: string, institucionEmisora?: string): Observable<Certificado> {
    return this.http.post<Certificado>(`${API_BASE}/postantes/${id}/certificados`, {
      nombreCurso,
      institucionEmisora: institucionEmisora ?? 'ChapaTuChamba',
    });
  }
}

export { PostanteService as Postante };
