import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UploadService {
  // lien vers l'API
  private api = 'https://api.vimeo.com/me/videos';
  // le token créer en passant par vimeo
  private accessToken = '9f2bbe6d034faa6c6d78d0e5e4077bdc';
  header: HttpHeaders = new HttpHeaders()
    .set('Authorization', 'bearer ' + this.accessToken)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/vnd.vimeo.*+json;version=3.4');
  constructor(private http: HttpClient) { }

  createVideo(file: File): Observable<any> {
    const body = { name: file.name, upload: { approach: 'tus', size: file.size } };
    return this.http.post(this.api, body, {
      headers: this.header,
      observe: 'response'
    });
  }
  getVideos() {
    return this.http.get(this.api, {
      headers: this.header
    });
  }

}



