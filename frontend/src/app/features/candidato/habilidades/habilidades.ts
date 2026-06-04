import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { PostanteService } from '../../../core/services/postante';
import { Habilidad } from '../../../shared/models/postante';

interface SkillQuiz {
  question: string;
  options: string[];
  correctIndex: number;
}

@Component({
  selector: 'app-habilidades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './habilidades.html',
  styleUrl: './habilidades.css',
})
export class Habilidades implements OnInit {
  private auth = inject(AuthService);
  private postanteService = inject(PostanteService);

  skills = signal<Habilidad[]>([]);
  newSkill = signal('');
  activeQuiz = signal<{ skill: Habilidad; quiz: SkillQuiz } | null>(null);
  selectedAnswer = signal<number | null>(null);
  quizResult = signal<string | null>(null);
  testing = signal(false);

  ngOnInit(): void {
    this.loadSkills();
  }

  loadSkills(): void {
    const userId = this.auth.currentUser()?.id;
    if (!userId) return;
    this.postanteService.getSkills(userId).subscribe({
      next: (skills) => this.skills.set(skills),
    });
  }

  addSkill(): void {
    const userId = this.auth.currentUser()?.id;
    const skill = this.newSkill().trim();
    if (!userId || !skill) return;

    this.postanteService.addSkills(userId, [skill]).subscribe({
      next: () => {
        this.newSkill.set('');
        this.loadSkills();
      },
    });
  }

  startTest(skill: Habilidad): void {
    this.activeQuiz.set({ skill, quiz: this.buildQuiz(skill.nombre) });
    this.selectedAnswer.set(null);
    this.quizResult.set(null);
  }

  cancelTest(): void {
    this.activeQuiz.set(null);
    this.selectedAnswer.set(null);
    this.quizResult.set(null);
  }

  submitTest(): void {
    const quizData = this.activeQuiz();
    const answer = this.selectedAnswer();
    const userId = this.auth.currentUser()?.id;
    if (!quizData || answer === null || !userId) return;

    if (answer !== quizData.quiz.correctIndex) {
      this.quizResult.set('Respuesta incorrecta. Intenta nuevamente.');
      return;
    }

    this.testing.set(true);
    this.postanteService.verifySkill(quizData.skill.id).subscribe({
      next: () => {
        this.postanteService.addCertificado(
          userId,
          `Certificación en ${quizData.skill.nombre}`,
          'ChapaTuChamba - Prueba de habilidades'
        ).subscribe({
          next: () => {
            this.quizResult.set('¡Aprobaste! Tu habilidad fue verificada y se agregó un certificado a tu perfil.');
            this.loadSkills();
            this.testing.set(false);
          },
          error: () => {
            this.quizResult.set('Habilidad verificada, pero no se pudo registrar el certificado.');
            this.loadSkills();
            this.testing.set(false);
          },
        });
      },
      error: () => {
        this.quizResult.set('No se pudo verificar la habilidad.');
        this.testing.set(false);
      },
    });
  }

  private buildQuiz(skillName: string): SkillQuiz {
    return {
      question: `¿Cuál es una buena práctica al demostrar dominio en ${skillName}?`,
      options: [
        'Mencionar proyectos concretos donde la aplicaste',
        'Decir que la conoces sin dar ejemplos',
        'Evitar hablar de ella en entrevistas',
        'Copiar definiciones de internet sin contexto',
      ],
      correctIndex: 0,
    };
  }
}
