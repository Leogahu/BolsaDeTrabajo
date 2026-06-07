import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config: { apiUrl: string; uploadUrl: string; wsUrl: string } = {
    apiUrl:    'http://localhost:8080/api/v1',
    uploadUrl: 'http://localhost:8080/uploads',
    wsUrl:     'ws://localhost:8080/ws'
  };

  constructor(private http: HttpClient) {}

  cargarConfiguracion(): Promise<boolean> {
    return firstValueFrom(this.http.get<typeof this.config>('/config.json'))
      .then(res => {
        this.config = res;
        console.log('[Config] Cargado:', res);
        return true;
      })
      .catch(err => {
        console.error('[Config] Error leyendo config.json — usando fallback localhost', err);
        return true;
      });
  }

  get apiUrl(): string    { return this.config.apiUrl; }
  get uploadUrl(): string { return this.config.uploadUrl; }
  get wsUrl(): string     { return this.config.wsUrl; }
}