import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { RoomService } from '../services/room.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomGuard implements CanActivate {
  constructor(private roomService: RoomService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.roomService.isJoined()) {
      return this.router.navigate(['/lobby']);
    }
    return true;
  }
}