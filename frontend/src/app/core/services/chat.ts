import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../constants/api';

export interface Conversacion {
  id: number;
  postanteId: number;
  postanteNombre: string;
  postanteFoto?: string;
  reclutadorId: number;
  reclutadorNombre: string;
  reclutadorEmpresa?: string;
  reclutadorFoto?: string;
  ultimoMensaje?: string;
  fechaUltimoMensaje?: string;
  mensajesNoLeidos: number;
  postulacionEstadoId?: number;
}

export interface Mensaje {
  id: number;
  conversacionId: number;
  remitenteTipo: string;
  remitenteId: number;
  contenido: string;
  leido: boolean;
  fechaEnvio?: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private http = inject(HttpClient);

  listConversations(userId: number, tipo: 'POSTANTE' | 'RECLUTADOR'): Observable<Conversacion[]> {
    const path = tipo === 'POSTANTE'
      ? `${API_BASE}/chat/conversaciones/postante/${userId}`
      : `${API_BASE}/chat/conversaciones/reclutador/${userId}`;
    return this.http.get<Conversacion[]>(path);
  }

  getFromPostulacion(estadoId: number): Observable<Conversacion> {
    return this.http.get<Conversacion>(`${API_BASE}/chat/conversaciones/postulacion-estado/${estadoId}`);
  }

  getMessages(conversacionId: number): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(`${API_BASE}/chat/conversaciones/${conversacionId}/mensajes`);
  }

  sendMessage(conversacionId: number, remitenteTipo: string, remitenteId: number, contenido: string): Observable<Mensaje> {
    const params = new HttpParams()
      .set('remitenteTipo', remitenteTipo)
      .set('remitenteId', remitenteId);
    return this.http.post<Mensaje>(
      `${API_BASE}/chat/conversaciones/${conversacionId}/mensajes`,
      { contenido },
      { params }
    );
  }

  markRead(conversacionId: number, lectorTipo: string, lectorId: number): Observable<void> {
    const params = new HttpParams().set('lectorTipo', lectorTipo).set('lectorId', lectorId);
    return this.http.put<void>(`${API_BASE}/chat/conversaciones/${conversacionId}/leidos`, {}, { params });
  }

  countUnread(userId: number, tipo: 'POSTANTE' | 'RECLUTADOR'): Observable<{ count: number }> {
    const params = new HttpParams().set('usuarioId', userId).set('tipo', tipo);
    return this.http.get<{ count: number }>(`${API_BASE}/chat/no-leidos`, { params });
  }
}

export { ChatService as Chat };
