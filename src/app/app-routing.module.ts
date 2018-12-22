import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventsComponent } from './events/events.component';
import { HomeComponent } from './home/home.component';

import { EventDetailsComponent } from './events/event-details/event-details.component';

const routes: Routes = [
  { path: 'events', component: EventsComponent},
  { path: 'events/details/:uuid', component: EventDetailsComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
