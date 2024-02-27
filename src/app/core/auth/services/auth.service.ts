import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthRequest } from '../models/auth-request.model';
import { Observable, tap, throwError } from 'rxjs';
import { AuthResponse } from '../models/auth-response.model';
import { AuthStorageService } from './auth-storage.service';
import { JwtService } from './jwt.service';
import { environment } from 'src/environments/environment';
import { RegistrationRequest } from '../models/registration-request.model';
import { User } from '@shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  tokenExpiryTimeout: any = null;

  constructor(
    private http: HttpClient,
    private authStorageService: AuthStorageService,
    private jwtService: JwtService
  ) {
    if (this.authStorageService.getToken()) {
      this.setTokenExpiryInterval(this.authStorageService.getToken());
    }
  }

  getLoggedInUser(): User | null {
    return this.authStorageService.loadUser();
  }

  isLoggedIn(): boolean {
    return this.authStorageService.getToken() != null;
  }

  login(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${environment.apiUrl}/auth/login`,
        authRequest
      )
      .pipe(
        tap({
          next: (res: AuthResponse) => {
            console.log('Login successful');

            this.authStorageService.saveToken(res.token);
            this.setTokenExpiryInterval(res.token);
          },
          error: (error) => {
            console.log('Login failed');

            this.authStorageService.deleteToken();
            this.setTokenExpiryInterval(null);

            return throwError(() => new Error(error));
          },
        })
      );
  }

  registration(
    registrationRequest: RegistrationRequest
  ): Observable<AuthResponse> {

    return this.http
      .post<AuthResponse>(
        `${environment.apiUrl}/auth/register`,
        registrationRequest,
        {
          headers: new HttpHeaders(
            { 'Accept': 'application/json' })
        }
      )
      .pipe(
        tap({
          next: (res: AuthResponse) => {
            console.log('Registration successful');
          },
          error: (error) => {
            console.log('Registration failed');

            return throwError(() => new Error(error));
          },
        })
      );
  }

  logout(): void {
    this.authStorageService.deleteToken();
    this.setTokenExpiryInterval(null);
  }

  private setTokenExpiryInterval(token: string | null) {
    clearTimeout(this.tokenExpiryTimeout);

    if (token) {
      const expiryMs = this.jwtService.extractExpiryMs(token);

      this.tokenExpiryTimeout = setTimeout(() => {
        //TODO refresh-token
        this.logout();
      }, expiryMs - new Date().getTime());
    }
  }
}
