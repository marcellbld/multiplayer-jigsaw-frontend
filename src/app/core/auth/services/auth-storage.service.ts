import { Injectable } from '@angular/core';
import { JwtService } from './jwt.service';
import { User } from '@shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthStorageService {
  private static TOKEN_KEY = 'access_token';

  constructor(private jwtService: JwtService) {}

  saveToken(token: string) {
    localStorage.setItem(AuthStorageService.TOKEN_KEY, token);
  }

  deleteToken() {
    localStorage.removeItem(AuthStorageService.TOKEN_KEY);
  }

  getToken() {
    return localStorage.getItem(AuthStorageService.TOKEN_KEY);
  }

  loadUser(): User | null {
    const token = localStorage.getItem(AuthStorageService.TOKEN_KEY);

    if (!token) {
      return null;
    }

    return this.jwtService.extractUser(token);
  }
}
