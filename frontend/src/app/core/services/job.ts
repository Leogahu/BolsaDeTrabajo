import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config';
import { JobOffer, JobPage } from '../../shared/models/job-offer';
import { PostulacionEstado } from '../../shared/models/postante';

@Injectable({ providedIn: 'root' })
export class JobService {
  private http          = inject(HttpClient);
  private configService = inject(ConfigService);

  private get api(): string { return this.configService.apiUrl; }

  getJobs(page: number, size: number): Observable<JobPage> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<JobPage>(`${this.api}/postulaciones`, { params });
  }

  getRecruiterJobs(recruiterId: number): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(`${this.api}/reclutadores/${recruiterId}/postulaciones`);
  }

  getJobById(jobId: number): Observable<JobOffer> {
    return this.http.get<JobOffer>(`${this.api}/postulaciones/${jobId}`);
  }

  saveJobOffer(offerData: Partial<JobOffer>, recruiterId: number, editId?: number | null): Observable<JobOffer> {
    if (editId) {
      return this.http.put<JobOffer>(`${this.api}/postulaciones/${editId}`, offerData);
    }
    return this.http.post<JobOffer>(`${this.api}/reclutadores/${recruiterId}/postulaciones`, offerData);
  }

  deleteJobOffer(jobId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/postulaciones/${jobId}`);
  }

  applyToJob(candidateId: number, jobId: number): Observable<PostulacionEstado> {
    return this.http.post<PostulacionEstado>(`${this.api}/postulaciones/${jobId}/postular`, { postanteId: candidateId });
  }

  getCandidates(jobId: number): Observable<PostulacionEstado[]> {
    return this.http.get<PostulacionEstado[]>(`${this.api}/postulaciones/${jobId}/candidatos`);
  }

  updateApplicationStatus(estadoId: number, estado: string, motivo?: string): Observable<PostulacionEstado> {
    return this.http.put<PostulacionEstado>(`${this.api}/postulaciones/${estadoId}/estado`, { estado, motivo: motivo ?? '' });
  }
}

export { JobService as Job };