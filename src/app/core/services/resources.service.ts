import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {

  constructor(private http: HttpClient) { }

  public getImageAsFile(imageUrl: string): Observable<File> {
    return this.http.get(imageUrl, { responseType: 'blob' })
    .pipe(map((blob: Blob) => new File([blob], imageUrl, {type:"image/jpeg"})));
  }
}
