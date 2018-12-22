import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events.component';
import { EventDetailsComponent } from './event-details/event-details.component';

@NgModule({
  declarations: [EventsComponent, EventDetailsComponent],
  imports: [
    CommonModule
  ],
  exports: [
    EventsComponent
  ]
})
export class EventsModule { }
