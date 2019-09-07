import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { EventsComponent } from './events.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { NewEventComponent } from './new-event/new-event.component';
import { EventRoutingModule } from './event-routing.module';
import { EventFormComponent } from './new-event/event-form/event-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TipDialogComponent } from './event-details/tip-dialog/tip-dialog.component';
import { SearchModule } from '../search/search.module';

@NgModule({
  declarations: [EventsComponent, EventDetailsComponent, NewEventComponent, EventFormComponent, TipDialogComponent],
  entryComponents: [TipDialogComponent],
  imports: [
    CommonModule,
    EventRoutingModule,
    ReactiveFormsModule,
    SearchModule,
    DragDropModule
  ],
  exports: [
    EventsComponent
  ]
})
export class EventsModule { }
