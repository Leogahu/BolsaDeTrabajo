import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config';

export interface InterviewQuestion {
  question: string;
  options: string[];
}

export interface InterviewCheckAnswer {
  correct: boolean;
  correctIndex: number;
}

export interface InterviewGenerateResponse {
  questions: InterviewQuestion[];
  profileSummary: string;
}

export interface InterviewResult {
  score: number;
  total: number;
  percentage: number;
  level: string;
  feedback: string;
}

export interface CvReview {
  overallAssessment: string;
  strengths: string[];
  recommendations: string[];
  score: number;
}

@Injectable({ providedIn: 'root' })
export class AiService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);

  private get api(): string { return this.configService.apiUrl; }

  generateInterview(): Observable<InterviewGenerateResponse> {
    return this.http.post<InterviewGenerateResponse>(`${this.api}/ai/interview/generate`, {});
  }

  submitInterview(answers: number[]): Observable<InterviewResult> {
    return this.http.post<InterviewResult>(`${this.api}/ai/interview/submit`, { answers });
  }

  checkAnswer(questionIndex: number, selectedIndex: number): Observable<InterviewCheckAnswer> {
    return this.http.post<InterviewCheckAnswer>(`${this.api}/ai/interview/check`, { questionIndex, selectedIndex });
  }

  reviewCv(): Observable<CvReview> {
    return this.http.post<CvReview>(`${this.api}/ai/cv/review`, {});
  }
}
