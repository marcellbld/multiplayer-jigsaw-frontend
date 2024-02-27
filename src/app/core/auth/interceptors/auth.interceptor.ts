import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthStorageService } from '../services/auth-storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authStorageService: AuthStorageService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let req = request;
    if (this.authStorageService.getToken()) {
      req = request.clone({
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.authStorageService.getToken()}`,
        }),
      });
    }

    return next.handle(req);
  }
}
