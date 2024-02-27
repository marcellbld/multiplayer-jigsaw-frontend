import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { CompatClient, Stomp, StompSubscription, messageCallbackType } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class SocketClientService {

  private client!: CompatClient;

  constructor() {
  }

  public initializeWebSocketConnection(connectHeaders: any, connectCallback: Function) {
    const ws = new SockJS(environment.wsApiUrl);

    this.client = Stomp.over(() => ws);

    this.client.onConnect = (frame: any) => {
      this.onConnect(frame);
      connectCallback(frame);
    };
    this.client.onWebSocketClose = this.onError;
    this.client.onDisconnect = this.onError;
    this.client.onStompError = this.onError;
    this.client.connectHeaders = connectHeaders;

    this.client.activate();
  }

  public disconnectWebSocketConnection() {
    this.client.deactivate();
  }
  
  public publish(destination: string, body:any) {
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

  private onError(frame: any) {
    console.log("ERROR");
    console.log(frame);
  }
}
