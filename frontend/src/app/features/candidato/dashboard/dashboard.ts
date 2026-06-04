import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { PostanteService } from '../../../core/services/postante';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private auth = inject(AuthService);
  private postanteService = inject(PostanteService);

  readonly userName = signal('Candidato');
  readonly applicationStats = signal({ postulado: 0, proceso: 0, entrevista: 0 });

  ngOnInit(): void {
    this.userName.set(this.auth.currentUser()?.nombreCompleto ?? 'Candidato');
    const userId = this.auth.currentUser()?.id;
    if (!userId) return;

    this.postanteService.getApplications(userId).subscribe({
      next: (apps) => {
        const stats = { postulado: 0, proceso: 0, entrevista: 0 };
        apps.forEach(app => {
          const estado = (app.estado ?? '').toUpperCase();
          if (estado === 'CONTACTARAN') stats.entrevista++;
          else if (estado === 'EN_REVISION') stats.proceso++;
          else stats.postulado++;
        });
        this.applicationStats.set(stats);
      },
    });
  }
}
