import { Component, OnDestroy, ViewChild } from '@angular/core';
import { RoomService } from '@app/core/services/room.service';
import { SocketMessage } from '@app/core/ws/models/socket-message.model';
import { GameBoardComponent } from '@app/game-board/components/game-board/game-board.component';
import { Room } from '@shared/models/room.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnDestroy {
  @ViewChild(GameBoardComponent) gameBoard: GameBoardComponent;
  

  room!: Room;

  private subscriptions: Subscription[] = [];

  constructor(private roomService: RoomService) {
    this.subscriptions.push(
      this.roomService.roomEvent.subscribe((message: SocketMessage) => this.roomEvent(message)),
      this.roomService.roomSubject.subscribe(
        room => {
          this.setRoom(room);
        }
      )
    );
    this.setRoom(this.roomService.roomSubject.value);
  }
  ngOnDestroy(): void {
    for(let sub of this.subscriptions){
      sub.unsubscribe();
    }
    this.subscriptions = [];
  }

  roomEvent(message: SocketMessage) {

  }

  private setRoom(room: Room) {
    this.room = room;
  }
  
  public zoomIn():void {
    this.gameBoard.zoom(-250);
  }
  public zoomOut():void {
    this.gameBoard.zoom(250);
  }
}
