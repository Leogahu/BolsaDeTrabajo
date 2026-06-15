import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService, InterviewQuestion, InterviewResult, CvReview } from '../../../core/services/ai';

type ViewMode = 'home' | 'interview' | 'result' | 'cv-review';

@Component({
  selector: 'app-entrevistas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './entrevistas.html',
  styleUrl: './entrevistas.css',
})
export class Entrevistas implements OnInit {
  private aiService = inject(AiService);

  viewMode = signal<ViewMode>('home');
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  questions = signal<InterviewQuestion[]>([]);
  profileSummary = signal('');
  currentIndex = signal(0);
  answers = signal<(number | null)[]>([]);
  showExplanation = signal(false);
  result = signal<InterviewResult | null>(null);
  cvReview = signal<CvReview | null>(null);
  correctIndex = signal<number | null>(null);
  isAnswerCorrect = signal<boolean | null>(null);

  readonly currentQuestion = computed(() => this.questions()[this.currentIndex()] ?? null);
  readonly progressPercent = computed(() => {
    const total = this.questions().length;
    if (total === 0) return 0;
    return Math.round(((this.currentIndex() + 1) / total) * 100);
  });
  readonly selectedAnswer = computed(() => this.answers()[this.currentIndex()] ?? null);

  ngOnInit(): void {}

  startInterview(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.aiService.generateInterview().subscribe({
      next: (data) => {
        this.questions.set(data.questions);
        this.profileSummary.set(data.profileSummary);
        this.answers.set(data.questions.map(() => null));
        this.currentIndex.set(0);
        this.showExplanation.set(false);
        this.result.set(null);
        this.viewMode.set('interview');
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'No se pudo generar la entrevista. Verifica que OPENAI_API_KEY esté configurada.');
        this.loading.set(false);
      },
    });
  }

  selectAnswer(index: number): void {
    if (this.showExplanation()) return;
    const updated = [...this.answers()];
    updated[this.currentIndex()] = index;
    this.answers.set(updated);
  }

  confirmAnswer(): void {
    if (this.selectedAnswer() === null) return;
    this.aiService.checkAnswer(this.currentIndex(), this.selectedAnswer()!).subscribe({
      next: (res) => {
        this.isAnswerCorrect.set(res.correct);
        this.correctIndex.set(res.correctIndex);
        this.showExplanation.set(true);
      },
      error: () => this.errorMessage.set('No se pudo verificar la respuesta.'),
    });
  }

  nextQuestion(): void {
    const isLast = this.currentIndex() >= this.questions().length - 1;
    if (isLast) {
      this.submitInterview();
      return;
    }
    this.currentIndex.update(i => i + 1);
    this.showExplanation.set(false);
    this.correctIndex.set(null);
    this.isAnswerCorrect.set(null);
  }

  submitInterview(): void {
    this.loading.set(true);
    const answerList = this.answers().map(a => a ?? -1);
    this.aiService.submitInterview(answerList).subscribe({
      next: (res) => {
        this.result.set(res);
        this.viewMode.set('result');
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'No se pudo evaluar la entrevista.');
        this.loading.set(false);
      },
    });
  }

  reviewCv(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.aiService.reviewCv().subscribe({
      next: (review) => {
        this.cvReview.set(review);
        this.viewMode.set('cv-review');
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'No se pudo revisar el CV. Verifica que OPENAI_API_KEY esté configurada.');
        this.loading.set(false);
      },
    });
  }

  isCurrentCorrect(): boolean {
    return this.isAnswerCorrect() === true;
  }

  goHome(): void {
    this.viewMode.set('home');
    this.questions.set([]);
    this.result.set(null);
    this.cvReview.set(null);
    this.errorMessage.set(null);
  }

  scoreColor(percentage: number): string {
    if (percentage >= 70) return '#16a34a';
    if (percentage >= 50) return '#d97706';
    return '#dc2626';
  }
}
