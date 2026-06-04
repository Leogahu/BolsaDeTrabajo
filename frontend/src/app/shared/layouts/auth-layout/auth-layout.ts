import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="auth-container">
      <header class="public-navbar">
        <div class="logo-section" routerLink="/">
          <span class="logo-text">BolsaEmpleo</span>
        </div>
        <nav>
          <a routerLink="/login" class="nav-btn">Iniciar Sesión</a>
        </nav>
      </header>
      <main class="auth-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styleUrl: './auth-layout.css'
})
export class AuthLayout {}