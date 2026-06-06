import { Injectable, inject } from '@angular/core';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';
import { AuthService } from './auth';
import { Mensaje, Conversacion } from './chat';
import { Notificacion } from './notification';

@Injectable({ providedIn: 'root' })
export class RealtimeService {
  private auth = inject(AuthService);
  private client?: Client;
  private userSub?: StompSubscription;
  private convSub?: StompSubscription;
  private chatSubs = new Map<number, StompSubscription>();

  readonly notification$ = new Subject<Notificacion>();
  readonly message$ = new Subject<Mensaje>();
  readonly conversation$ = new Subject<Conversacion>();
  readonly connected$ = new Subject<boolean>();

  connect(): void {
    const user = this.auth.currentUser();
    if (!user?.id) return;

    if (this.client?.active) {
      this.subscribeUserTopics();
      return;
    }

    this.client = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        this.connected$.next(true);
        this.subscribeUserTopics();
      },
      onDisconnect: () => this.connected$.next(false),
      onStompError: () => this.connected$.next(false),
    });

    this.client.activate();
  }

  private subscribeUserTopics(): void {
    const user = this.auth.currentUser();
    if (!user?.id || !this.client?.connected) return;

    const tipo = this.auth.userTipoApi();
    this.userSub?.unsubscribe();
    this.convSub?.unsubscribe();

    this.userSub = this.client.subscribe(
      `/topic/notificaciones/${tipo}/${user.id}`,
      (msg: IMessage) => {
        try {
          this.notification$.next(JSON.parse(msg.body) as Notificacion);
        } catch { /* ignore malformed */ }
      }
    );

    this.convSub = this.client.subscribe(
      `/topic/conversaciones/${tipo}/${user.id}`,
      (msg: IMessage) => {
        try {
          this.conversation$.next(JSON.parse(msg.body) as Conversacion);
        } catch { /* ignore malformed */ }
      }
    );
  }

  subscribeChat(conversacionId: number): void {
    if (!this.client?.connected) return;
    this.unsubscribeChat(conversacionId);

    const sub = this.client.subscribe(`/topic/chat/${conversacionId}`, (msg: IMessage) => {
      try {
        this.message$.next(JSON.parse(msg.body) as Mensaje);
      } catch { /* ignore malformed */ }
    });
    this.chatSubs.set(conversacionId, sub);
  }

  unsubscribeChat(conversacionId: number): void {
    this.chatSubs.get(conversacionId)?.unsubscribe();
    this.chatSubs.delete(conversacionId);
  }

  disconnect(): void {
    this.userSub?.unsubscribe();
    this.convSub?.unsubscribe();
    this.chatSubs.forEach((s) => s.unsubscribe());
    this.chatSubs.clear();
    if (this.client?.active) {
      this.client.deactivate();
    }
    this.client = undefined;
    this.connected$.next(false);
  }
}
