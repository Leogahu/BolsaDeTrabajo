import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../constants/api';
import { Proyecto } from '../../shared/models/proyecto';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  private http = inject(HttpClient);

  listByPostante(postanteId: number): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(`${API_BASE}/proyectos/postante/${postanteId}`);
  }

  create(postanteId: number, proyecto: Proyecto): Observable<Proyecto> {
    return this.http.post<Proyecto>(`${API_BASE}/proyectos/postante/${postanteId}`, proyecto);
  }

  update(id: number, proyecto: Proyecto): Observable<Proyecto> {
    return this.http.put<Proyecto>(`${API_BASE}/proyectos/${id}`, proyecto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/proyectos/${id}`);
  }
}

export { ProyectoService as Proyecto };
