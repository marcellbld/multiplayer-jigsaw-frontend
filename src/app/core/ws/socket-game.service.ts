import { Injectable } from '@angular/core';
import { SocketClientService } from './socket-client.service';
import { AuthStorageService } from '../auth/services/auth-storage.service';
import { SocketGameData } from './models/socket-game-data.model';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { StompSubscription, messageCallbackType } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class SocketGameService {
  public socketGameDataSubject: BehaviorSubject<SocketGameData | null> = new BehaviorSubject<SocketGameData | null>(null);
  connectionStatus$: Observable<{ status: SockJS.State, frame?: any }>;

  constructor(private socketClientService: SocketClientService,
    private authStorageService: AuthStorageService) {
    this.connectionStatus$ = this.socketClientService.connectionStatus$;
  }

  public connect(playerName: string | null) {
    let headers: any = {};

    if (this.authStorageService.getToken()) {
      headers["Authorization"] = `Bearer ${this.authStorageService.getToken()}`;
    }
    else {
      headers["Player-Name"] = playerName ?? "";
    }
    this.socketClientService.initializeWebSocketConnection(headers).subscribe(({ status, frame }: { status: SockJS.State, frame?: any }) => {
      if (status === SockJS.OPEN) {
        this.onConnect(frame);
      }
    });
  }

  public disconnect() {
    this.socketClientService.disconnectWebSocketConnection();
    this.setSocketGameData(null);
  }

  public publish(destination: string, body: any) {
    this.socketClientService.publish("/app" + destination, body);
  }

  public subscribe(destination: string, callback: messageCallbackType): StompSubscription {
    return this.socketClientService.subscribe("/topic" + destination, callback);
  }

  public subscribeUser(destination: string, callback: messageCallbackType): StompSubscription {
    return this.socketClientService.subscribe("/user/topic" + destination, callback);
  }

  public unsubscribe(destination: string): void {
    this.socketClientService.unsubscribe("/topic" + destination);
  }

  public unsubscribeUser(destination: string): void {
    this.socketClientService.unsubscribe("/user/topic" + destination);
  }

  public getUsername(): string | undefined {
    return this.socketGameDataSubject.value?.username;
  }

  private onConnect(frame: any) {
    this.setSocketGameData(new SocketGameData(frame.headers["user-name"]));
  }

  private setSocketGameData(socketGameData: SocketGameData | null) {
    this.socketGameDataSubject.next(socketGameData);
  }
}
