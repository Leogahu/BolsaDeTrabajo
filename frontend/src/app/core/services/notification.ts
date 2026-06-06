import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../constants/api';

export interface Notificacion {
  id: number;
  titulo: string;
  mensaje: string;
  tipo: string;
  referenciaId?: number;
  leida: boolean;
  fechaCreacion?: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private http = inject(HttpClient);

  list(usuarioId: number, tipo: 'POSTANTE' | 'RECLUTADOR'): Observable<Notificacion[]> {
    const params = new HttpParams().set('usuarioId', usuarioId).set('tipo', tipo);
    return this.http.get<Notificacion[]>(`${API_BASE}/notificaciones`, { params });
  }

  countUnread(usuarioId: number, tipo: 'POSTANTE' | 'RECLUTADOR'): Observable<{ count: number }> {
    const params = new HttpParams().set('usuarioId', usuarioId).set('tipo', tipo);
    return this.http.get<{ count: number }>(`${API_BASE}/notificaciones/no-leidas`, { params });
  }

  markRead(id: number): Observable<void> {
    return this.http.put<void>(`${API_BASE}/notificaciones/${id}/leida`, {});
  }

  markAllRead(usuarioId: number, tipo: 'POSTANTE' | 'RECLUTADOR'): Observable<void> {
    const params = new HttpParams().set('usuarioId', usuarioId).set('tipo', tipo);
    return this.http.put<void>(`${API_BASE}/notificaciones/marcar-todas`, {}, { params });
  }
}

export { NotificationService as Notification };
