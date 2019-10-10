import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CuecardService {

  constructor(private http: HttpClient,) { }

  getCuecard(uuid: String): Observable<String> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'text/html' }),
      responseType: 'text' as 'json'
    };

    return this.http.get<String>('/v2/cuecards/' + uuid, httpOptions);
  } 

  getAudioFile(file: String): Observable<Blob> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'audio/mp3' }),
      responseType: 'blob' as 'json'
    };

    return this.http.get<Blob>('/v2/audio/' + file, httpOptions);
  }
}
