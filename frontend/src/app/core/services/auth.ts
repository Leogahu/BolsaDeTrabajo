import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_BASE } from '../constants/api';
import { UserSession } from '../../shared/models/auth';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPostantePayload {
  username: string;
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
}

export interface RegisterReclutadorPayload {
  username: string;
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  empresa: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private sessionState = signal<UserSession>(this.loadInitialSession());

  readonly session = computed(() => this.sessionState());
  readonly isLogged = computed(() => this.sessionState().isLogged);
  readonly userType = computed(() => this.sessionState().userType);
  readonly currentUser = computed(() => this.sessionState().user);

  readonly selectedUserTypeRegister = signal<'postante' | 'reclutador'>('postante');

  private loadInitialSession(): UserSession {
    const raw = localStorage.getItem('userSession');
    if (raw) {
      try {
        return JSON.parse(raw) as UserSession;
      } catch {
        return { isLogged: false, userType: null, user: null };
      }
    }
    return { isLogged: false, userType: null, user: null };
  }

  login(credentials: { email?: string; username?: string; password: string }): Observable<any> {
    const loginData: LoginPayload = {
      username: credentials.username ?? credentials.email ?? '',
      password: credentials.password
    };

    return this.http.post<any>(`${API_BASE}/auth/login`, loginData).pipe(
      tap(userData => {
        if (userData.token) {
          localStorage.setItem('token', userData.token);
        }

        const partes = userData.nombreCompleto ? userData.nombreCompleto.trim().split(' ') : [];
        const session: UserSession = {
          isLogged: true,
          userType: userData.tipo,
          user: {
            id: userData.id,
            nombres: userData.nombres || partes[0] || '',
            apellidos: userData.apellidos || partes.slice(1).join(' ') || '',
            nombreCompleto: userData.nombreCompleto || `${userData.nombres ?? ''} ${userData.apellidos ?? ''}`.trim(),
            email: userData.email,
            username: userData.username,
            empresa: userData.empresa,
            fotoPerfil: userData.fotoPerfil
          }
        };

        localStorage.setItem('userSession', JSON.stringify(session));
        this.sessionState.set(session);
      })
    );
  }

  registerPostante(data: RegisterPostantePayload): Observable<any> {
    return this.http.post(`${API_BASE}/auth/postante/register`, data);
  }

  registerReclutador(data: RegisterReclutadorPayload): Observable<any> {
    return this.http.post(`${API_BASE}/reclutadores/register`, data);
  }

  updateSessionUser(partial: Partial<NonNullable<UserSession['user']>>): void {
    const current = this.sessionState();
    if (!current.user) return;
    const updated = { ...current, user: { ...current.user, ...partial } };
    localStorage.setItem('userSession', JSON.stringify(updated));
    this.sessionState.set(updated);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userSession');
    this.sessionState.set({ isLogged: false, userType: null, user: null });
    this.router.navigate(['/']);
  }

  avatarUrl(name?: string): string {
    const user = this.currentUser();
    if (user?.fotoPerfil) return user.fotoPerfil;
    const display = name || user?.nombreCompleto || 'Usuario';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(display)}&background=0052EA&color=fff`;
  }

  userTipoApi(): 'POSTANTE' | 'RECLUTADOR' {
    return this.userType() === 'reclutador' ? 'RECLUTADOR' : 'POSTANTE';
  }
}

export { AuthService as Auth };
