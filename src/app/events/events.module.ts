import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { NewEventComponent } from './new-event/new-event.component';
import { EventRoutingModule } from './event-routing.module';
import { EventFormComponent } from './new-event/event-form/event-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TipDialogComponent } from './event-details/tip-dialog/tip-dialog.component';
import { SearchModule } from '../search/search.module';
import { SearchDialogComponent } from '../search/search-dialog/search-dialog.component';

@NgModule({
  declarations: [EventsComponent, EventDetailsComponent, NewEventComponent, EventFormComponent, TipDialogComponent],
  entryComponents: [TipDialogComponent],
  imports: [
    CommonModule,
    EventRoutingModule,
    ReactiveFormsModule,
    SearchModule
  ],
  exports: [
    EventsComponent
  ]
})
export class EventsModule { }
