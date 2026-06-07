import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config';
import { Proyecto } from '../../shared/models/proyecto';

@Injectable({ providedIn: 'root' })
export class ProyectoService {
  private http          = inject(HttpClient);
  private configService = inject(ConfigService);

  private get api(): string { return this.configService.apiUrl; }

  listByPostante(postanteId: number): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(`${this.api}/proyectos/postante/${postanteId}`);
  }

  create(postanteId: number, proyecto: Proyecto): Observable<Proyecto> {
    return this.http.post<Proyecto>(`${this.api}/proyectos/postante/${postanteId}`, proyecto);
  }

  update(id: number, proyecto: Proyecto): Observable<Proyecto> {
    return this.http.put<Proyecto>(`${this.api}/proyectos/${id}`, proyecto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/proyectos/${id}`);
  }
}

export { ProyectoService as Proyecto };