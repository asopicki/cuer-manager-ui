import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Event } from './event';
import { EventService } from './event.service';
import { NewEventComponent } from './new-event/new-event.component';

import { DateTime } from 'luxon';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  events: Event[];

  constructor(private eventService: EventService, private dialog: MatDialog) { }

  getEvents() {
    return this.eventService.getEvents()
      .subscribe(events => this.events = events);
  }

  ngOnInit() {
    this.getEvents();
  }

  addEvent(event: any) {
    event.preventDefault();
    const dialogRef = this.dialog.open(NewEventComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      let startDate = DateTime.fromJSDate(result.startDate);
      let startTime = DateTime.fromISO(result.startTime);
      let endDate = DateTime.fromJSDate(result.endDate);
      let endTime = DateTime.fromISO(result.endTime);
      
      startDate = startDate.set({
        hour: startTime.hour,
        minute: startTime.minute,
        second: startTime.second,
        millisecond: startTime.millisecond
      });
      
      endDate = endDate.set({
        hour: endTime.hour,
        minute: endTime.minute,
        second: endTime.second,
        millisecond: endTime.millisecond
      })
      console.debug('Start date:', startDate);
      console.debug('End date:', endDate);

      this.eventService.createEvent(result.name, startDate, endDate).subscribe(_ => {
        this.getEvents();
      });
    });
  }
}
