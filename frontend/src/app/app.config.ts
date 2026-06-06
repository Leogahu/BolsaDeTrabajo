import { ApplicationConfig, APP_INITIALIZER, provideZoneChangeDetection, inject } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { jwtInterceptor } from './core/interceptors/jwt-interceptor';
import { ConfigService } from './core/services/config'; 

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()), 
    provideHttpClient(
      withInterceptors([jwtInterceptor])
    ),
    
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const configService = inject(ConfigService); 
        return () => configService.cargarConfiguracion();
      },
      multi: true
    }
  ]
};