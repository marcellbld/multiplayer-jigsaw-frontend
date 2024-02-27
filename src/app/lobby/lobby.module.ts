import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LobbyPageComponent } from './components/lobby-page/lobby-page.component';
import { JoinLobbyComponent } from './components/join-lobby/join-lobby.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { LobbyNavComponent } from './components/lobby/lobby-nav/lobby-nav.component';
import { LobbyRoomBlockComponent } from './components/lobby/lobby-room-block/lobby-room-block.component';
import { CreateRoomComponent } from './components/lobby/create-room/create-room.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [
    LobbyPageComponent,
    JoinLobbyComponent,
    LobbyComponent,
    LobbyNavComponent,
    LobbyRoomBlockComponent,
    CreateRoomComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SharedModule
  ]
})
export class LobbyModule { }
