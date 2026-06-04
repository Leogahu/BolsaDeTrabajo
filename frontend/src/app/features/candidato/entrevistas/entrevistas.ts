import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface InterviewSession {
  completedQuestions: number[];
  lastVisit: string;
}

@Component({
  selector: 'app-entrevistas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './entrevistas.html',
  styleUrl: './entrevistas.css',
})
export class Entrevistas implements OnInit {
  private readonly storageKey = 'interviewSession';

  currentQuestion = signal(0);
  answer = signal('');
  feedback = signal<string | null>(null);
  completedCount = signal(0);

  readonly questions = [
    'Cuéntame sobre un proyecto universitario del que te sientas orgulloso.',
    '¿Cómo manejas el trabajo en equipo cuando hay plazos ajustados?',
    '¿Por qué te interesa esta oportunidad junior?',
    'Describe una situación donde resolviste un problema técnico.',
    '¿Cómo te mantienes actualizado en tu área profesional?',
  ];

  ngOnInit(): void {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const session = JSON.parse(saved) as InterviewSession;
        this.completedCount.set(session.completedQuestions.length);
      } catch { /* ignore */ }
    }
  }

  nextQuestion(): void {
    this.saveProgress();
    this.currentQuestion.update(i => Math.min(i + 1, this.questions.length - 1));
    this.answer.set('');
    this.feedback.set(null);
  }

  prevQuestion(): void {
    this.currentQuestion.update(i => Math.max(i - 1, 0));
    this.answer.set('');
    this.feedback.set(null);
  }

  evaluateAnswer(): void {
    const text = this.answer().trim();
    if (text.length < 30) {
      this.feedback.set('Intenta ampliar tu respuesta con un ejemplo concreto (mínimo 30 caracteres).');
      return;
    }
    this.feedback.set('Buena respuesta. Recuerda usar el método STAR: situación, tarea, acción y resultado.');
    this.saveProgress();
  }

  private saveProgress(): void {
    const idx = this.currentQuestion();
    const saved = localStorage.getItem(this.storageKey);
    let session: InterviewSession = { completedQuestions: [], lastVisit: new Date().toISOString() };
    if (saved) {
      try { session = JSON.parse(saved) as InterviewSession; } catch { /* ignore */ }
    }
    if (!session.completedQuestions.includes(idx)) {
      session.completedQuestions.push(idx);
    }
    session.lastVisit = new Date().toISOString();
    localStorage.setItem(this.storageKey, JSON.stringify(session));
    this.completedCount.set(session.completedQuestions.length);
  }
}
