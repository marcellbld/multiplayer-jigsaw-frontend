import { Component, OnDestroy } from '@angular/core';
import { RoomService } from '@app/core/services/room.service';

@Component({
  selector: 'app-room-page',
  templateUrl: './room-page.component.html',
  styleUrls: ['./room-page.component.scss']
})
export class RoomPageComponent implements OnDestroy {
  constructor(private roomService: RoomService) {
  }

  ngOnDestroy(): void {
    if(this.roomService.isJoined()){
      this.roomService.detach();
    }
  }
}
