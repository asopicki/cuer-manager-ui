import { Component, OnInit } from '@angular/core';

import { Event } from '../events/event';
import { EventService } from '../events/event.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  events: Event[];

  constructor(private eventService: EventService) { }

  getEvents() {
    // @TODO: Get next events based on date (-1 month, +3 months)
    return this.eventService.getEvents().subscribe(events => this.events = events.slice(0,8));
  }

  ngOnInit() {
    this.getEvents();
  }

}
