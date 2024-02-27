import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RoomService } from '@app/core/services/room.service';
import { Room } from '@shared/models/room.model';

@Component({
  selector: 'app-lobby-room-block',
  templateUrl: './lobby-room-block.component.html',
  styleUrls: ['./lobby-room-block.component.scss']
})
export class LobbyRoomBlockComponent {

  @Input() room!: Room;

  constructor(private roomService: RoomService) {
  }

  clickOnJoinBtn(): void {
    this.roomService.join(this.room.id);
  }
}
