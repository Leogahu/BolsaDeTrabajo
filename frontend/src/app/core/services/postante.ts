import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config';
import { Habilidad, PostanteProfile, PostulacionEstado, Certificado, Aval } from '../../shared/models/postante';

@Injectable({ providedIn: 'root' })
export class PostanteService {
  private http          = inject(HttpClient);
  private configService = inject(ConfigService);

  private get api(): string { return this.configService.apiUrl; }

  getProfile(id: number): Observable<PostanteProfile> {
    return this.http.get<PostanteProfile>(`${this.api}/postantes/${id}`);
  }

  getApplications(id: number): Observable<PostulacionEstado[]> {
    return this.http.get<PostulacionEstado[]>(`${this.api}/postantes/${id}/postulaciones`);
  }

  getSkills(id: number): Observable<Habilidad[]> {
    return this.http.get<Habilidad[]>(`${this.api}/postantes/${id}/habilidades`);
  }

  addSkills(id: number, habilidades: string[]): Observable<PostanteProfile> {
    return this.http.post<PostanteProfile>(`${this.api}/postantes/${id}/habilidades`, habilidades);
  }

  verifySkill(habilidadId: number): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.api}/postantes/habilidades/${habilidadId}/verificar`, {});
  }

  updateDescription(id: number, descripcion: string): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.api}/postantes/${id}/descripcion`, { descripcion });
  }

  updateProfileComplete(id: number, formData: FormData): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.api}/postantes/${id}/completo`, formData);
  }

  getCertificados(id: number): Observable<Certificado[]> {
    return this.http.get<Certificado[]>(`${this.api}/postantes/${id}/certificados`);
  }

  addCertificado(id: number, nombreCurso: string, institucionEmisora?: string): Observable<Certificado> {
    return this.http.post<Certificado>(`${this.api}/postantes/${id}/certificados`, {
      nombreCurso,
      institucionEmisora: institucionEmisora ?? 'ChapaTuChamba'
    });
  }

  getAvales(id: number): Observable<Aval[]> {
    return this.http.get<Aval[]>(`${this.api}/postantes/${id}/avales`);
  }

  addAval(id: number, data: Partial<Aval>): Observable<Aval> {
    return this.http.post<Aval>(`${this.api}/postantes/${id}/avales`, data);
  }

  deleteAval(avalId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/postantes/avales/${avalId}`);
  }
}

export { PostanteService as Postante };