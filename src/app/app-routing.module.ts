import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './public/components/login-page/login-page.component';
import { LoginGuard } from './core/auth/guards/login.guard';
import { RegistrationPageComponent } from './public/components/registration-page/registration-page.component';
import { LobbyPageComponent } from './lobby/components/lobby-page/lobby-page.component';
import { RoomPageComponent } from './room/components/room-page/room-page.component';
import { RoomGuard } from './core/guards/room.guard';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent, canActivate: [LoginGuard] },
  {
    path: 'registration',
    component: RegistrationPageComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'lobby',
    component: LobbyPageComponent,
  },
  {
    path: 'room',
    component: RoomPageComponent,
    canActivate: [RoomGuard]
  },
  { path: '', component: LobbyPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
