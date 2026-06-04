import { TestBed } from '@angular/core/testing';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { provideRouter } from '@angular/router';
import { AuthService } from '../services/auth';

import { authGuard } from './auth-guard';

describe('authGuard', () => {
  // CORREGIDO: Invocamos auth() primero pasándole un rol simulado (ej. 'postante') para obtener el CanActivateFn real
  const executeGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ) => TestBed.runInInjectionContext(() => authGuard('postante')(route, state));

  // Creamos un doble (mock) mínimo del AuthService para que el Guard pueda inyectarlo en el test
  const authServiceMock = {
    isLogged: () => true,
    userType: () => 'postante'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]), // Proveedor del sistema de rutas
        { provide: AuthService, useValue: authServiceMock } // Proveedor simulado de tu servicio de autenticación
      ]
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});