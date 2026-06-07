import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router      = inject(Router);
  const localToken  = localStorage.getItem('token');
  const skipAuth =
    req.url.endsWith('config.json') ||
    req.url.startsWith('/assets/') ||
    req.url.startsWith('http') && !req.url.includes('onrender.com') && !req.url.includes('localhost');

  const authReq = (localToken && !skipAuth)
    ? req.clone({ setHeaders: { Authorization: `Bearer ${localToken}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && localToken && !skipAuth) {
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};