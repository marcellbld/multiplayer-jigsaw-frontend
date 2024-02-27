import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { SocketGameService } from '../ws/socket-game.service';
import { SocketDestinations } from '../ws/models/socket-destinations.enum';
import { IMessage, StompSubscription } from '@stomp/stompjs';
import { SocketMessage } from '../ws/models/socket-message.model';
import { SocketEventType } from '../ws/models/socket-event-type.enum';
import { LobbyCreateRoomDto } from '@app/lobby/models/ws-messages/lobby-create-room-dto.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Room } from '@app/shared/models/room.model';
import { environment } from '@environment/environment';
import { LobbyRoomCreatedDto } from '@app/lobby/models/ws-messages/lobby-room-created-dto.model';
import { RoomService } from './room.service';

@Injectable({
  providedIn: 'root'
})
export class LobbyService {

  @Output() public lobbyEvent: EventEmitter<SocketMessage> = new EventEmitter();

  public creatingRoomSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public roomListSubject: BehaviorSubject<Room[]> = new BehaviorSubject([] as any);

  private stompSubscriptions: StompSubscription[] = [];

  constructor(
    private http: HttpClient,
    private socketGameService: SocketGameService,
    private roomService: RoomService
  ) { }

  public join(initialDataCallback: Function):void {
    this.stompSubscriptions.push(
      this.socketGameService.subscribe(SocketDestinations.Lobby, (message: IMessage) => {
        const socketMessage: SocketMessage = JSON.parse(message.body);
        
        if(socketMessage.event === SocketEventType.Lobby_InitialData){
          this.setRoomListSubject(socketMessage.body.rooms);
          initialDataCallback(socketMessage.body);
        }

        this.receiveMessage(socketMessage);
      }),

      this.socketGameService.subscribeUser(SocketDestinations.Lobby, (message: IMessage) => {
        const socketMessage: SocketMessage = JSON.parse(message.body);

        this.receiveMessage(socketMessage);
      })
    );
  }

  getRooms(): Observable<Room[]> {
    return this.http
      .get<Room[]>(
        `${environment.apiUrl}/rooms`
      );
  }

  public setRoomListSubject(roomList : Room[]): void {
    this.roomListSubject.next(roomList);
  }

  public detach(): void {
    this.socketGameService.unsubscribe(SocketDestinations.Lobby);
    this.socketGameService.unsubscribeUser(SocketDestinations.Lobby);

    for(let sub of this.stompSubscriptions) {
      sub.unsubscribe();
    }
    this.stompSubscriptions = [];
  }

  public createRoom(lobbyCreateRoom: LobbyCreateRoomDto): void {
    this.http
      .post<Room>(
        `${environment.apiUrl}/rooms`,
        lobbyCreateRoom
      ).subscribe((room: Room) => {
        this.roomService.join(room.id);
      });
  }

  public changeCreatingRoom(creatingRoom: boolean) {
    this.creatingRoomSubject.next(creatingRoom);
  }

  private receiveMessage(message: SocketMessage) {
    if(message.event === SocketEventType.Lobby_RoomCreated) {
      const messageBody: LobbyRoomCreatedDto = message.body;
      
      this.setRoomListSubject([...this.roomListSubject.value, messageBody.room]);
    }
    else if(message.event === SocketEventType.Lobby_RoomRemoved) {
      const messageBody: LobbyRoomCreatedDto = message.body;
      this.setRoomListSubject(this.roomListSubject.value.filter(room => room.id !== messageBody.room.id));
    }
    
    this.lobbyEvent.emit(message);
  }
  
}
