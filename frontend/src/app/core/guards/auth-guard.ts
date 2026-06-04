import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard = (requiredRole?: 'postante' | 'reclutador'): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLogged()) {
      router.navigate(['/login']);
      return false;
    }

    if (requiredRole && authService.userType() !== requiredRole) {
      // Si está logueado pero intenta cruzar de panel (ej. Reclutador en panel de Candidato)
      const redirectPath = authService.userType() === 'reclutador' ? '/reclutador/dashboard' : '/candidato/dashboard';
      router.navigate([redirectPath]);
      return false;
    }

    return true;
  };
};