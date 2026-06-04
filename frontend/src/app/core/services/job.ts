import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../constants/api';
import { JobOffer, JobPage } from '../../shared/models/job-offer';
import { PostulacionEstado } from '../../shared/models/postante';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private http = inject(HttpClient);

  getJobs(page: number, size: number): Observable<JobPage> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<JobPage>(`${API_BASE}/postulaciones`, { params });
  }

  getRecruiterJobs(recruiterId: number): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(`${API_BASE}/reclutadores/${recruiterId}/postulaciones`);
  }

  getJobById(jobId: number): Observable<JobOffer> {
    return this.http.get<JobOffer>(`${API_BASE}/postulaciones/${jobId}`);
  }

  saveJobOffer(offerData: Partial<JobOffer>, recruiterId: number, editId?: number | null): Observable<JobOffer> {
    if (editId) {
      return this.http.put<JobOffer>(`${API_BASE}/postulaciones/${editId}`, offerData);
    }
    return this.http.post<JobOffer>(`${API_BASE}/reclutadores/${recruiterId}/postulaciones`, offerData);
  }

  deleteJobOffer(jobId: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/postulaciones/${jobId}`);
  }

  applyToJob(candidateId: number, jobId: number): Observable<PostulacionEstado> {
    return this.http.post<PostulacionEstado>(`${API_BASE}/postulaciones/${jobId}/postular`, { postanteId: candidateId });
  }

  getCandidates(jobId: number): Observable<PostulacionEstado[]> {
    return this.http.get<PostulacionEstado[]>(`${API_BASE}/postulaciones/${jobId}/candidatos`);
  }

  updateApplicationStatus(estadoId: number, estado: string, motivo?: string): Observable<PostulacionEstado> {
    return this.http.put<PostulacionEstado>(`${API_BASE}/postulaciones/${estadoId}/estado`, { estado, motivo: motivo ?? '' });
  }
}

export { JobService as Job };
