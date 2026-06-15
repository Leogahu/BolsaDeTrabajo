import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { PostanteService } from '../../../core/services/postante';
import { Habilidad } from '../../../shared/models/postante';

interface QuizQuestion {
  question: string;
  context: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface SkillQuiz {
  skillName: string;
  questions: QuizQuestion[];
  passingScore: number;
}

interface ActiveQuizState {
  skill: Habilidad;
  quiz: SkillQuiz;
  currentIndex: number;
  answers: (number | null)[];
  showExplanation: boolean;
  finished: boolean;
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
  activeQuiz = signal<ActiveQuizState | null>(null);
  quizResult = signal<string | null>(null);
  testing = signal(false);

  readonly verifiedCount = computed(() => this.skills().filter(s => s.verificada).length);
  readonly pendingCount = computed(() => this.skills().filter(s => !s.verificada).length);

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
    const quiz = this.buildQuiz(skill.nombre);
    this.activeQuiz.set({
      skill,
      quiz,
      currentIndex: 0,
      answers: quiz.questions.map(() => null),
      showExplanation: false,
      finished: false,
    });
    this.quizResult.set(null);
  }

  cancelTest(): void {
    this.activeQuiz.set(null);
    this.quizResult.set(null);
  }

  currentQuestion(): QuizQuestion | null {
    const state = this.activeQuiz();
    if (!state) return null;
    return state.quiz.questions[state.currentIndex] ?? null;
  }

  progressPercent(): number {
    const state = this.activeQuiz();
    if (!state) return 0;
    return Math.round(((state.currentIndex + 1) / state.quiz.questions.length) * 100);
  }

  selectedAnswer(): number | null {
    const state = this.activeQuiz();
    if (!state) return null;
    return state.answers[state.currentIndex];
  }

  selectAnswer(index: number): void {
    const state = this.activeQuiz();
    if (!state || state.showExplanation || state.finished) return;
    const answers = [...state.answers];
    answers[state.currentIndex] = index;
    this.activeQuiz.set({ ...state, answers });
  }

  confirmAnswer(): void {
    const state = this.activeQuiz();
    if (!state || state.answers[state.currentIndex] === null) return;
    this.activeQuiz.set({ ...state, showExplanation: true });
  }

  nextQuestion(): void {
    const state = this.activeQuiz();
    if (!state) return;

    const isLast = state.currentIndex >= state.quiz.questions.length - 1;
    if (isLast) {
      this.finishQuiz();
      return;
    }

    this.activeQuiz.set({
      ...state,
      currentIndex: state.currentIndex + 1,
      showExplanation: false,
    });
  }

  correctCount(): number {
    const state = this.activeQuiz();
    if (!state) return 0;
    return state.quiz.questions.reduce((acc, q, i) => {
      return acc + (state.answers[i] === q.correctIndex ? 1 : 0);
    }, 0);
  }

  isCurrentCorrect(): boolean {
    const state = this.activeQuiz();
    const q = this.currentQuestion();
    if (!state || !q) return false;
    return state.answers[state.currentIndex] === q.correctIndex;
  }

  private finishQuiz(): void {
    const state = this.activeQuiz();
    if (!state) return;

    const score = this.correctCount();
    const total = state.quiz.questions.length;
    const passed = score >= state.quiz.passingScore;

    this.activeQuiz.set({ ...state, finished: true, showExplanation: false });

    if (!passed) {
      this.quizResult.set(`Obtuviste ${score}/${total}. Necesitas al menos ${state.quiz.passingScore} respuestas correctas para verificar la habilidad.`);
      return;
    }

    this.verifySkill(state);
  }

  private verifySkill(state: ActiveQuizState): void {
    const userId = this.auth.currentUser()?.id;
    if (!userId) return;

    this.testing.set(true);
    this.postanteService.verifySkill(state.skill.id).subscribe({
      next: () => {
        this.postanteService.addCertificado(
          userId,
          `Certificación en ${state.skill.nombre}`,
          'ChapaTuChamba - Prueba de habilidades'
        ).subscribe({
          next: () => {
            this.quizResult.set(`¡Certificación aprobada! ${this.correctCount()}/${state.quiz.questions.length} respuestas correctas.`);
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
    const normalized = skillName.toLowerCase();
    const isTechnical = /javascript|java|python|sql|react|angular|node|figma|excel|git|html|css|typescript|c\+\+|c#|php|ruby|docker|aws|azure|linux|data|machine|ia|ai|devops|api|backend|frontend|mobile|android|ios/.test(normalized);

    if (isTechnical) {
      return {
        skillName,
        passingScore: 3,
        questions: [
          {
            question: `¿Cuál es la forma más efectiva de demostrar competencia en ${skillName}?`,
            context: 'Los reclutadores valoran evidencia concreta sobre afirmaciones genéricas.',
            options: [
              'Presentar proyectos reales con código, resultados y aprendizajes obtenidos',
              'Mencionar que lo conoces sin mostrar ejemplos prácticos',
              'Copiar definiciones técnicas de documentación sin aplicarlas',
              'Evitar hablar de la tecnología en entrevistas técnicas',
            ],
            correctIndex: 0,
            explanation: 'Los proyectos concretos demuestran dominio real y capacidad de aplicación.',
          },
          {
            question: `Al resolver un problema con ${skillName}, ¿qué enfoque es más profesional?`,
            context: 'Evalúa tu metodología de resolución de problemas técnicos.',
            options: [
              'Analizar el problema, proponer solución, implementar y documentar el resultado',
              'Implementar la primera solución que funcione sin revisar alternativas',
              'Delegar siempre el problema sin intentar resolverlo',
              'Evitar pruebas y validaciones para ahorrar tiempo',
            ],
            correctIndex: 0,
            explanation: 'Un enfoque estructurado refleja madurez técnica y profesionalismo.',
          },
          {
            question: `¿Qué práctica demuestra actualización continua en ${skillName}?`,
            context: 'El aprendizaje constante es clave en tecnologías en evolución.',
            options: [
              'Seguir documentación oficial, cursos y aplicar nuevas versiones en proyectos',
              'Usar solo lo aprendido en la universidad sin actualizarse',
              'Depender exclusivamente de tutoriales desactualizados',
              'Evitar cambios en herramientas o frameworks',
            ],
            correctIndex: 0,
            explanation: 'Mantenerse actualizado demuestra compromiso con la excelencia técnica.',
          },
          {
            question: `En un equipo de trabajo, ¿cómo aporta valor alguien experto en ${skillName}?`,
            context: 'Las soft skills complementan las habilidades técnicas.',
            options: [
              'Compartir conocimiento, revisar código de pares y proponer mejoras colaborativas',
              'Trabajar aislado sin comunicar avances al equipo',
              'Criticar el trabajo de otros sin ofrecer alternativas',
              'Resistirse a estándares o convenciones del equipo',
            ],
            correctIndex: 0,
            explanation: 'La colaboración y el mentoring elevan el desempeño del equipo completo.',
          },
        ],
      };
    }

    return {
      skillName,
      passingScore: 3,
      questions: [
        {
          question: `¿Cómo demuestras dominio en ${skillName} en un contexto profesional?`,
          context: 'Esta pregunta evalúa tu capacidad de comunicar competencias de forma efectiva.',
          options: [
            'Con ejemplos concretos de situaciones donde aplicaste la habilidad con resultados medibles',
            'Diciendo que la tienes sin dar contexto ni resultados',
            'Evitando mencionarla en entrevistas o procesos de selección',
            'Exagerando experiencia sin poder sustentarla con hechos',
          ],
          correctIndex: 0,
          explanation: 'Los reclutadores buscan evidencia verificable, no solo afirmaciones.',
        },
        {
          question: `¿Qué actitud refleja madurez profesional al aplicar ${skillName}?`,
          context: 'Evalúa tu enfoque ante desafíos relacionados con esta competencia.',
          options: [
            'Reconocer áreas de mejora, buscar retroalimentación y practicar deliberadamente',
            'Asumir que ya dominas todo y no necesitas mejorar',
            'Ocultar errores para no parecer incompetente',
            'Blamear al entorno cuando algo no sale bien',
          ],
          correctIndex: 0,
          explanation: 'La humildad intelectual y la mejora continua son muy valoradas.',
        },
        {
          question: `Al postular a una vacante que requiere ${skillName}, ¿qué estrategia es más efectiva?`,
          context: 'Conecta tu perfil con las expectativas del reclutador.',
          options: [
            'Destacar en CV y carta cómo la habilidad generó impacto en proyectos anteriores',
            'Listar la habilidad sin explicar cómo la usaste',
            'Mentir sobre el nivel de experiencia para pasar filtros',
            'Esperar que el reclutador adivine tus capacidades',
          ],
          correctIndex: 0,
          explanation: 'Un perfil bien articulado aumenta significativamente tus oportunidades.',
        },
        {
          question: `¿Cómo mantienes y desarrollas ${skillName} a largo plazo?`,
          context: 'El crecimiento sostenido diferencia a candidatos destacados.',
          options: [
            'Practicando regularmente, tomando cursos y aplicándola en proyectos reales',
            'Dejando de practicar una vez verificada la habilidad',
            'Confiando solo en la experiencia pasada sin renovar conocimientos',
            'Esperando que el empleador provea todo el entrenamiento necesario',
          ],
          correctIndex: 0,
          explanation: 'El aprendizaje activo demuestra proactividad y compromiso profesional.',
        },
      ],
    };
  }
}
