import { Component } from '@angular/core';

import { CuecardService } from './cuecard//cuecard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cuer-manager-ui';

  constructor(private service: CuecardService) {

  }

  refresh() {
    this.service.refresh().subscribe(() => console.log('refresh done'));
  }
}
