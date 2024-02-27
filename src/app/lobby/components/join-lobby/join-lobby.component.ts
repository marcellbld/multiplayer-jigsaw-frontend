import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocketGameService } from '@core/ws/socket-game.service';
import { AuthService } from '@core/auth/services/auth.service';

@Component({
  selector: 'app-join-lobby',
  templateUrl: './join-lobby.component.html',
  styleUrls: ['./join-lobby.component.scss']
})
export class JoinLobbyComponent {
  form: FormGroup = new FormGroup({
    playerName: new FormControl('', [Validators.minLength(4)])
  });

  constructor(
    private router: Router,
    private authService: AuthService,
    private socketGameService: SocketGameService
  ) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  onSubmit() {
    this.socketGameService.connect(this.playerName.value);
  }

  get playerName(): FormControl {
    return this.form.get('playerName') as FormControl;
  }
}
