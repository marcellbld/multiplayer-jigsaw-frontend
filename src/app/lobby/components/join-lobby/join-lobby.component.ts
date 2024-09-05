import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocketGameService } from '@core/ws/socket-game.service';
import { AuthService } from '@core/auth/services/auth.service';
import SockJS from 'sockjs-client';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-join-lobby',
  templateUrl: './join-lobby.component.html',
  styleUrls: ['./join-lobby.component.scss']
})
export class JoinLobbyComponent implements OnInit {
  form: FormGroup = new FormGroup({
    playerName: new FormControl('', [Validators.minLength(4)])
  });

  isConnecting: Boolean = false;
  joinError: string | null = null;
  connectionStatus: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private socketGameService: SocketGameService
  ) { }

  ngOnInit(): void {
  }


  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  onSubmit() {
    this.socketGameService.connect(this.playerName.value);
    this.joinError = null;

    if (!this.connectionStatus) {
      this.connectionStatus = this.socketGameService.connectionStatus$.subscribe(
        ({ status, frame }) => {
          this.isConnecting = status === SockJS.CONNECTING || status === SockJS.OPEN;

          if (!this.isConnecting) {
            this.joinError = "Error connecting to the server";
          }
        }
      )
    }
  }

  get playerName(): FormControl {
    return this.form.get('playerName') as FormControl;
  }
}
