import { Component, OnInit } from '@angular/core';


import { Event } from './event';
import { EventService } from './event.service'

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  events: Event[];

  constructor(private eventService: EventService) { }

  getEvents() {
    return this.eventService.getEvents()
      .subscribe(events => this.events = events);
  }

  ngOnInit() {
    this.getEvents();
  }

}
