import { Component } from '@angular/core';
import { from } from 'rxjs';

import { EventsComponent } from  './events/events.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cuer-manager-ui';
}
