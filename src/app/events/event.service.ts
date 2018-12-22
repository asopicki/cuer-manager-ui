import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Event } from './event';
import { MessageService } from '../message.service'

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private urls = {
    "events": "v2/events",
    "event": "v2/events/"
  }

  private eventUrl = 'v2/events/';

  constructor(private http: HttpClient, private messageService: MessageService) { }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`EventService: ${message}`);
  }

  /*
   * @TODO: Add support for loading events in a certain range (start date, end date)
   */
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.urls['events'])
      .pipe(map(events => {
        const result = events.map(data => new Event(data));
        return result;
      }));
  }

  getEvent(uuid: string): Observable<Event> {
    return this.http.get<Event>(this.urls['event'] + uuid)
      .pipe(map(eventData => {
        return new Event(eventData);
      }))
  }
}
