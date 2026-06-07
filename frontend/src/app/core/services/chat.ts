import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config';

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
  private http          = inject(HttpClient);
  private configService = inject(ConfigService);

  private get api(): string { return this.configService.apiUrl; }

  listConversations(userId: number, tipo: 'POSTANTE' | 'RECLUTADOR'): Observable<Conversacion[]> {
    const path = tipo === 'POSTANTE'
      ? `${this.api}/chat/conversaciones/postante/${userId}`
      : `${this.api}/chat/conversaciones/reclutador/${userId}`;
    return this.http.get<Conversacion[]>(path);
  }

  getFromPostulacion(estadoId: number): Observable<Conversacion> {
    return this.http.get<Conversacion>(`${this.api}/chat/conversaciones/postulacion-estado/${estadoId}`);
  }

  getMessages(conversacionId: number): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(`${this.api}/chat/conversaciones/${conversacionId}/mensajes`);
  }

  sendMessage(conversacionId: number, remitenteTipo: string, remitenteId: number, contenido: string): Observable<Mensaje> {
    const params = new HttpParams()
      .set('remitenteTipo', remitenteTipo)
      .set('remitenteId', remitenteId);
    return this.http.post<Mensaje>(
      `${this.api}/chat/conversaciones/${conversacionId}/mensajes`,
      { contenido },
      { params }
    );
  }

  markRead(conversacionId: number, lectorTipo: string, lectorId: number): Observable<void> {
    const params = new HttpParams().set('lectorTipo', lectorTipo).set('lectorId', lectorId);
    return this.http.put<void>(`${this.api}/chat/conversaciones/${conversacionId}/leidos`, {}, { params });
  }

  countUnread(userId: number, tipo: 'POSTANTE' | 'RECLUTADOR'): Observable<{ count: number }> {
    const params = new HttpParams().set('usuarioId', userId).set('tipo', tipo);
    return this.http.get<{ count: number }>(`${this.api}/chat/no-leidos`, { params });
  }
}

export { ChatService as Chat };