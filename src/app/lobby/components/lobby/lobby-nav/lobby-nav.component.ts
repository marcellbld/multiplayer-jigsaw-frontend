import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LobbyService } from '@app/core/services/lobby.service';
import { SocketGameData } from '@core/ws/models/socket-game-data.model';
import { SocketGameService } from '@core/ws/socket-game.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lobby-nav',
  templateUrl: './lobby-nav.component.html',
  styleUrls: ['./lobby-nav.component.scss']
})
export class LobbyNavComponent implements OnDestroy {
  creatingRoom: boolean = false;

  socketGameData: SocketGameData | null = null;

  subscriptions: Subscription[] = [];
  constructor(
      private socketGameService: SocketGameService,
      private router: Router,
      private lobbyService: LobbyService
  ) {
    this.subscriptions.push(
      this.socketGameService.socketGameDataSubject.subscribe((data: SocketGameData | null) => {
        this.socketGameData = data;
      }),
      this.lobbyService.creatingRoomSubject.subscribe((creatingRoom: boolean) => {
        this.creatingRoom = creatingRoom;
      })
    );

    this.socketGameData = socketGameService.socketGameDataSubject.value;

  }
  ngOnDestroy(): void {
    for(let sub of this.subscriptions) {
      sub.unsubscribe();
    }
    this.subscriptions = [];
  }
  clickOnBackBtn(): void {
    if(!this.creatingRoom){
      this.socketGameService.disconnect();
    }
    this.router.navigate([`/lobby`]);
    this.lobbyService.changeCreatingRoom(false);
  }

  clickOnCreateRoomBtn(): void {
    this.lobbyService.changeCreatingRoom(true);
  }
}
