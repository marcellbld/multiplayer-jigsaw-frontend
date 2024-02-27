import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomPageComponent } from './components/room-page/room-page.component';
import { RoomComponent } from './components/room/room.component';
import { GameBoardModule } from '@app/game-board/game-board.module';
import { SharedModule } from '@app/shared/shared.module';



@NgModule({
  declarations: [
    RoomPageComponent,
    RoomComponent
  ],
  imports: [
    CommonModule,
    GameBoardModule,
    SharedModule
  ]
})
export class RoomModule { }

