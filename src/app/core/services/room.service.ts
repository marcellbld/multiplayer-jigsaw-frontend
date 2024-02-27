import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Room } from '@shared/models/room.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { SocketDestinations } from '../ws/models/socket-destinations.enum';
import { IMessage, StompSubscription } from '@stomp/stompjs';
import { SocketGameService } from '../ws/socket-game.service';
import { SocketMessage } from '../ws/models/socket-message.model';
import { SocketEventType } from '../ws/models/socket-event-type.enum';
import { RoomInitialDataDto } from '@app/shared/models/ws-messages/room-initial-data-dto.model';
import { RoomUserJoinedDto } from '@app/shared/models/ws-messages/room-user-joined-dto.model';
import { RoomUserLeftDto } from '@app/shared/models/ws-messages/room-user-left-dto.model';
import { RoomUser } from '@app/shared/models/room-user.model';
import { Router } from '@angular/router';
import { PuzzlePiece } from '@app/shared/models/puzzle-piece.model';
import { throttle } from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  @Output() public roomEvent: EventEmitter<SocketMessage> = new EventEmitter();

  public roomSubject: BehaviorSubject<Room> = new BehaviorSubject({} as any);

  private sendMoveMessageThrottle = throttle(this.sendMoveMessage, 50, {});

  private stompSubscription: StompSubscription | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private socketGameService: SocketGameService
  )
  { }
  
  public join(id: string, initialDataCallback: Function | null = null):void {
    this.stompSubscription = this.socketGameService.subscribe(
      SocketDestinations.Room + "/" + id,
     (message: IMessage) => {
      const socketMessage: SocketMessage = JSON.parse(message.body);
      
      if(socketMessage.event === SocketEventType.Room_InitialData){
        const socketMessageBody: RoomInitialDataDto = socketMessage.body;

        socketMessageBody.room.users = socketMessageBody.room.users.map(user => new RoomUser(user.username, user.colorId));
        
        this.setRoomSubject(socketMessageBody.room);
        if(initialDataCallback !== null){
          initialDataCallback(socketMessageBody);
        }
      }
      this.receiveMessage(socketMessage);

      this.router.navigate(['/room']);
    });

  }

  private setRoomSubject(room: Room) {
    this.roomSubject.next(room);
  }

  public detach() {
    this.socketGameService.unsubscribe(SocketDestinations.Room + "/" + this.roomSubject.value.id);

    this.stompSubscription?.unsubscribe();
    this.stompSubscription = null;
  }
    
  private receiveMessage(message: SocketMessage) {
    if(message.event === SocketEventType.Room_UserJoined) {
      const messageBody: RoomUserJoinedDto = message.body;

      const roomUser = new RoomUser(messageBody.user.username, messageBody.user.colorId);

      if(roomUser.username === this.socketGameService.socketGameDataSubject.value?.username) {
        return;
      }
      
      this.setRoomSubject({...this.roomSubject.value, users: [...this.roomSubject.value.users, roomUser] });
    }
    else if(message.event === SocketEventType.Room_UserLeft) {
      const messageBody: RoomUserLeftDto = message.body;
      
      this.setRoomSubject({...this.roomSubject.value, users: this.roomSubject.value.users.filter(user => user.username !== messageBody.user.username) });
    }

    this.roomEvent.emit(message);
  }

  public isJoined(): boolean {
    
    return this.stompSubscription != null;
  }

  public sendMovePuzzlePiece(puzzlePiece: PuzzlePiece) {
    this.sendMoveMessageThrottle(puzzlePiece);
  }

  private sendMoveMessage(puzzlePiece: PuzzlePiece) {
    this.socketGameService.publish(
      SocketDestinations.Room + "/" + this.roomSubject.value.id + "/puzzle/move",
      { puzzlePiece }
    );
  }
  
  public sendReleasePuzzlePiece(puzzlePiece: PuzzlePiece) {
    this.socketGameService.publish(
      SocketDestinations.Room + "/" + this.roomSubject.value.id + "/puzzle/release",
      { puzzlePiece }
    );
  }
  
  public getUserByUsername(username: string): RoomUser | undefined {
    if(!this.roomSubject.value.id) throw new Error("Room doesn't exist.");

    const room: Room = this.roomSubject.value;

    return room.users.find(user => user.username === username);
  }
}
