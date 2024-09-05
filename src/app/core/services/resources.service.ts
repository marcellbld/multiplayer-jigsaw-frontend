import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { forkJoin, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {

  private static readonly DEFAULT_IMAGES_PATH = `${environment.apiUrl}/default_images/`;
  private static readonly DEFAULT_IMAGES_NUMBER = 7;

  private defaultImageNames = Array.from({ length: ResourcesService.DEFAULT_IMAGES_NUMBER },
    (_, i) => `default${(i + 1).toString().padStart(3, "0")}.jpg`);

  constructor(private http: HttpClient) { }

  private getImageAsFile(imageUrl: string): Observable<File> {
    return this.http.get(imageUrl, { responseType: 'blob' })
      .pipe(map((blob: Blob) => new File([blob], imageUrl, { type: "image/jpeg" })));
  }
  public getDefaultImages(): Observable<File[]> {
    return forkJoin(this.defaultImageNames.map(name => this.getImageAsFile(`${ResourcesService.DEFAULT_IMAGES_PATH}${name}`)));
  }
}
