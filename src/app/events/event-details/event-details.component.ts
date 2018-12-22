import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { EventService }  from '../event.service';
import { Event } from '../event';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  event: Event

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private location: Location
  ) { }

  ngOnInit() {
    this.getEvent();
    /*
      @TODO: Get further details regarding the event

      - Schedule
      - Playlist
      - Notes
      - Tags
      - ....
    */
  }

  getEvent() {
    const uuid: string = this.route.snapshot.paramMap.get('uuid') || '';
    this.eventService.getEvent(uuid).subscribe(event => this.event = event);
  }
}
