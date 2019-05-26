import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators'; //tap

import { OptionalProgram, Program } from './program';
import { Event } from './event';
import { MessageService } from '../message.service';

const urls = {
  "program_event": "v2/event/program/"
};

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class ProgramService {

  constructor(private http: HttpClient, private messageService: MessageService) { }

  getProgram(event: Event): Observable<OptionalProgram> {
    if (event) {
      return this.http.get<OptionalProgram>(urls['program_event'] + event.getId())
        .pipe(
          map(programData => {
            return programData ? new Program(programData, event) : null;
          }),
          catchError(this.handleError<null>('getProgram'))
        )
    } else {
      return of(null);
    }
  }

  private log(message: string) {
    this.messageService.add(`ProgramService: ${message}`);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
    
      console.error(error); // log to console instead
    
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
    
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}