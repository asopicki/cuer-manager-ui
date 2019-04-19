import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  MatButtonModule, 
  MatFormFieldModule, 
  MatInputModule, 
  MatDialogModule, 
  MatDatepickerModule,
  MatNativeDateModule
} from '@angular/material';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

import { EventDetailsComponent } from './event-details/event-details.component';
import { NewEventComponent } from './new-event/new-event.component';
import { EventsComponent } from './events.component';

const routes: Routes = [
  { path: 'events', component: EventsComponent},
  { path: 'events/new', component: NewEventComponent },
  { 
    path: 'events/details/:uuid', 
    component: EventDetailsComponent
  },
];

let modules =  [
  FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule
]

@NgModule({
  imports: [
    ...modules,
    RouterModule.forRoot(routes)
  ],
  exports: [
    ...modules,
    RouterModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EventRoutingModule { }
