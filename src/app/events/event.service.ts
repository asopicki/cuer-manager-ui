import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { Event } from './event';
import { MessageService } from '../message.service'
import { DateTime } from 'luxon';

const urls = {
  "events": "v2/events",
  "event": "v2/events/",
  "new_event": "v2/event"
}

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient, private messageService: MessageService) { }

  private log(message: string) {
    this.messageService.add(`EventService: ${message}`);
  }

  getEvents(): Observable<Event[]> {
    let start_date =  DateTime.local().minus({months: 1}).toUTC().toISO(); //.utc().subtract(1, 'months').toISOString(true);
    let end_date =  DateTime.local().plus({months: 3}).toUTC().toISO(); //moment().utc().add(3, 'months').toISOString(true);

    return this.http.get<Event[]>(urls['events']+'/'+ start_date + '/' + end_date)
      .pipe(map(events => {
        const result = events.map(data => new Event(data));
        return result;
      }));
  }

  getEvent(uuid: string): Observable<Event> {
    return this.http.get<Event>(urls['event'] + uuid)
      .pipe(
        map(eventData => {
          return new Event(eventData);
        })
        ,
      catchError(this.handleError<null>('getEvent')))
  }

  createEvent(name: string, startDate: DateTime, endDate: DateTime): Observable<any> {
    console.debug('Start date:', startDate);

    let event = {
      name: name,
      date_start: startDate.toISO(),
      date_end: endDate.toISO(),
      schedule: null,
      date_created: DateTime.utc().toISO(), //moment().utc().toISOString(),
      date_modified: DateTime.utc().toISO() // moment().utc().toISOString()
    }

    console.debug('Creating event:', event);

    return this.http.put(urls['new_event'], event, httpOptions).pipe(
      tap((result) => console.log('Event created!')),
      catchError(this.handleError<void>('createEvent'))
    );
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
