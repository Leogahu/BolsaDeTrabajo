import { TestBed } from '@angular/core/testing';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { provideRouter } from '@angular/router';
import { AuthService } from '../services/auth';

import { authGuard } from './auth-guard';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ) => TestBed.runInInjectionContext(() => authGuard('postante')(route, state));

  const authServiceMock = {
    isLogged: () => true,
    userType: () => 'postante'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]), 
        { provide: AuthService, useValue: authServiceMock } 
      ]
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});