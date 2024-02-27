import { Component, OnDestroy } from '@angular/core';
import { Room } from '@shared/models/room.model';
import { Observable, Subscription, map, merge, of, tap } from 'rxjs';
import { RoomService } from '@core/services/room.service';
import { LobbyService } from '@app/core/services/lobby.service';
import { LobbyInitialDataDto } from '@app/lobby/models/ws-messages/lobby-initial-data-dto.model';
import { SocketMessage } from '@app/core/ws/models/socket-message.model';
import { SocketEventType } from '@app/core/ws/models/socket-event-type.enum';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnDestroy {
  creatingRoom: boolean = false;

  rooms: Room[] = [];

  private subscriptions: Subscription[] = [];

  constructor(private roomService: RoomService, private lobbyService: LobbyService) {
    lobbyService.join((message: any) => this.loadInitialData(message));

    this.subscriptions.push(
      lobbyService.creatingRoomSubject.subscribe((creatingRoom: boolean) => {
        this.creatingRoom = creatingRoom;
      }),
      lobbyService.lobbyEvent.subscribe((message: SocketMessage) => this.lobbyEvent(message)),
      lobbyService.roomListSubject.subscribe((roomList: Room[]) => {
        this.rooms = roomList;
      })
    );
    
    this.rooms = lobbyService.roomListSubject.value;
    
  }

  private lobbyEvent(message: SocketMessage) {
    if(message.event === SocketEventType.UserLobby_FailedToJoinToRoom) {
      console.log("Failed to join");
      //TODO ROOM FAILED TO JOIN EVENT
    }
  }

  private loadInitialData(initialData: LobbyInitialDataDto) {
    // this.rooms = of(initialData.rooms);
  }

  clickOnCreateRoomBtn(): void {
    this.creatingRoom = true;
  }

  changeCreatingRoom(creatingRoom: boolean) {
    this.creatingRoom = creatingRoom;
  }

  ngOnDestroy(): void {
    for(let sub of this.subscriptions) {
      sub.unsubscribe();
    }
    this.subscriptions = [];
  }
  
}
