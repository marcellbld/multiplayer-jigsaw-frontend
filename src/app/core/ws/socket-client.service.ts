import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { CompatClient, Stomp, StompSubscription, messageCallbackType } from '@stomp/stompjs';
import { BehaviorSubject, Observable } from 'rxjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class SocketClientService {

  private client!: CompatClient;
  private connectionStatusSubject = new BehaviorSubject<{ status: SockJS.State, frame?: any }>({ status: SockJS.CLOSED });
  connectionStatus$: Observable<{ status: SockJS.State, frame?: any }> = this.connectionStatusSubject.asObservable();

  constructor() {
  }

  public initializeWebSocketConnection(connectHeaders: any): Observable<{ status: SockJS.State, frame?: any }> {
    const ws = new SockJS(environment.wsApiUrl);

    this.client = Stomp.over(() => ws);

    this.connectionStatusSubject.next({ status: SockJS.CONNECTING });
    this.client.onConnect = (frame: any) => {
      this.onConnect(frame);
      this.connectionStatusSubject.next({ status: SockJS.OPEN, frame });
    };
    this.client.onWebSocketClose = () => this.onError();
    this.client.onDisconnect = () => this.onError();
    this.client.onStompError = () => this.onError();
    this.client.connectHeaders = connectHeaders;

    this.client.activate();

    return this.connectionStatus$;
  }

  public disconnectWebSocketConnection() {
    this.client.deactivate();
  }

  public publish(destination: string, body: any) {
    this.client.publish({
      destination: destination,
      body: JSON.stringify(body)
    });
  }

  public subscribe(destination: string, callback: messageCallbackType): StompSubscription {
    return this.client.subscribe(destination, callback);
  }
  public unsubscribe(destination: string): void {
    this.client.unsubscribe(destination);
  }

  private onConnect(frame: any) {
    console.log("CONNECTED");
  }

  private onError() {
    this.connectionStatusSubject.next({ status: SockJS.CLOSED });
  }
}
