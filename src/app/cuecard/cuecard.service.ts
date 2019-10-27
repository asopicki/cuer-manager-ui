import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Cuecard } from '../events/cuecard';
import { MarkData } from './markdata';
import { Tag } from '../tag';

@Injectable({
  providedIn: 'root'
})
export class CuecardService {

  constructor(private http: HttpClient) { }

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
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'blob' as 'json'
    };

    let data = {
      filename: CuecardService._b64EncodeUnicode(file.toString())
    }

    return this.http.post<Blob>('/v2/audio', data, httpOptions);
  }

  setMarks(uuid: String, marks: MarkData): Observable<String> {
    let data = {
      karaoke_marks: JSON.stringify(marks)
    }

    return this.http.post<String>('/v2/cuecards/' + uuid + '/marks', data);
  }

  refresh(): Observable<void> {
    let data = "";

    return this.http.post<void>('/v2/cuecards/refresh', data);
  }

  getTags(uuid: String): Observable<Tag[]> {
    return this.http.get<Tag[]>("/v2/cuecards/" + uuid + "/tags").pipe(
      map(tags => tags.map(tag => new Tag(tag)))
    );
  }

  getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>("/v2/tags").pipe(
      map(tags => tags.map(tag => new Tag(tag)))
    );
  }

  addTag(tag: Tag, cuecard: Cuecard): Observable<void> {
    let data = { tag: tag.tag }

    return this.http.post<void>("/v2/cuecards/" + cuecard.uuid + "/tags", data);
  }

  removeTag(tag: Tag, cuecard: Cuecard): Observable<void> {
    return this.http.delete<void>("/v2/cuecards/" + cuecard.uuid + "/tag/" + tag.tag);
  }

  
  private static _b64EncodeUnicode(str: string): string {
    if (window
        && "btoa" in window
        && "encodeURIComponent" in window) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
            return String.fromCharCode(("0x" + p1) as any);
        }));
    }
  }
  
}
