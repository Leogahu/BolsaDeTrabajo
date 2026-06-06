import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Conversacion } from './chat';

@Injectable({ providedIn: 'root' })
export class ChatUiService {
  private openChatSubject = new Subject<Conversacion>();
  readonly openChat$ = this.openChatSubject.asObservable();

  requestOpen(conversation: Conversacion): void {
    this.openChatSubject.next(conversation);
  }
}
