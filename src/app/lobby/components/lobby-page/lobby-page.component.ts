import { Component, OnDestroy } from '@angular/core';
import { LobbyService } from '@app/core/services/lobby.service';
import { SocketGameData } from '@core/ws/models/socket-game-data.model';
import { SocketGameService } from '@core/ws/socket-game.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lobby-page',
  templateUrl: './lobby-page.component.html',
  styleUrls: ['./lobby-page.component.scss']
})
export class LobbyPageComponent implements OnDestroy {
  socketGameData: SocketGameData | null = null;

  private subscriptions: Subscription[] = [];

  constructor(private socketGameService: SocketGameService, private lobbyService: LobbyService) {
    this.subscriptions.push(
      this.socketGameService.socketGameDataSubject.subscribe((data: SocketGameData | null) => {
        this.socketGameData = data;
      })
    );
  }
  
  ngOnDestroy(): void {
    this.lobbyService.detach();

    for(let sub of this.subscriptions) {
      sub.unsubscribe();
    }

    this.subscriptions = [];
  }
}
