import { SocketEventType } from "./socket-event-type.enum";

export class SocketMessage {
  event: SocketEventType;
  body: any;

  constructor(event: SocketEventType, body: any) {
    this.event = event;
    this.body = body;
  }
}