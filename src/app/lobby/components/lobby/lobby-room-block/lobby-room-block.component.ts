import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoomService } from '@app/core/services/room.service';
import { Room } from '@shared/models/room.model';

@Component({
  selector: 'app-lobby-room-block',
  templateUrl: './lobby-room-block.component.html',
  styleUrls: ['./lobby-room-block.component.scss']
})
export class LobbyRoomBlockComponent implements OnInit {

  @Input() room!: Room;

  constructor(private roomService: RoomService) {
  }
  ngOnInit(): void {
  }

  clickOnJoinBtn(): void {
    this.roomService.join(this.room.id);
  }

  get pieces(): number {
    return this.room.puzzle.piecesDimensions[0] * this.room.puzzle.piecesDimensions[1];
  }
}
