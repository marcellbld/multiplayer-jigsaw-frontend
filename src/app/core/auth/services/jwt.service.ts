import { Injectable } from '@angular/core';
import { User } from '@shared/models/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  constructor(private jwtHelperService: JwtHelperService) {}

  extractExpiryMs(token: string): number {
    const details = this.jwtHelperService.decodeToken(token);

    return details['exp'] ? details['exp'] * 1000 : 0;
  }

  extractUser(token: string): User | null {
    const details = this.jwtHelperService.decodeToken(token);

    return new User(details['id'], details['sub'], details['role']);
  }
}
