import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: any;

  constructor(private http: HttpClient) {}

  cargarConfiguracion(): Promise<boolean> {
    return firstValueFrom(this.http.get('/config.json'))
      .then((res: any) => {
        this.config = res;
        return true;
      })
      .catch((err) => {
        console.error('Error cargando la configuración de la app', err);
        return false;
      });
  }

  get apiUrl(): string {
    return this.config?.apiUrl || 'http://localhost:8080/api/v1';
  }

  get uploadUrl(): string {
    return this.config?.uploadUrl || 'http://localhost:8080/uploads';
  }

  get wsUrl(): string {
    return this.config?.wsUrl || 'ws://localhost:8080/ws';
  }
}