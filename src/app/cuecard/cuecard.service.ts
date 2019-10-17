import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Cuecard } from '../events/cuecard';

@Injectable({
  providedIn: 'root'
})
export class CuecardService {

  constructor(private http: HttpClient,) { }

  getCuecard(uuid: String): Observable<Cuecard> {
    return this.http.get<Cuecard>('/v2/cuecards/' + uuid).pipe(
      map((data) => new Cuecard(data))
    );
  }

  getCuecardContent(uuid: String): Observable<String> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'text/html' }),
      responseType: 'text' as 'json'
    };

    return this.http.get<String>('/v2/cuecards/' + uuid + '/content', httpOptions);
  } 

  getAudioFile(file: String): Observable<Blob> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'audio/mp3' }),
      responseType: 'blob' as 'json'
    };

    return this.http.get<Blob>('/v2/audio/' + file, httpOptions);
  }

  setMarks(uuid: String, marks: String[]): Observable<String> {
    let data = {
      karaoke_marks: JSON.stringify(marks)
    }

    return this.http.post<String>('/v2/cuecards/' + uuid + '/marks', data);
  }
}
