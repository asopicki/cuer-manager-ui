import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators'; 
import { DateTime } from 'luxon';

import { Program } from './program';
import { MessageService } from '../message.service';
import { Tip } from './tip';

const urls = {
  "tips_program": "v2/tips/",
  "new_tip": "v2/tips"
};

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class TipService {

  constructor(private http: HttpClient, private messageService: MessageService) { }

  getTips(program: Program): Observable<Tip[]> {
    if (program) {
      return this.http.get<Tip[]>(urls['tips_program'] + program.id)
        .pipe(
          map(tips => {
            return tips.map(data => new Tip(data, program));
          }),
          catchError(this.handleError<Tip[]>('getTips'))
        )
    } else {
      return of(new Array<Tip>());
    }
  }

  createTip(name: string, program_id: number, startDate: DateTime, endDate: DateTime): Observable<any> {

    console.debug('Start date:', startDate);

    let tip = {
      name: name,
      program_id: program_id,
      date_start:  startDate.toUTC().toISO(),
      date_end: endDate.toUTC().toISO(),
    }

    console.debug('Creating tip:', tip);

    return this.http.put(urls['new_tip'], tip, httpOptions).pipe(
      tap((result) => console.log('Tip created!')),
      catchError(this.handleError<void>('createTip'))
    );
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
