import { Component, OnInit, Input } from '@angular/core';
import { Cuecard } from 'src/app/events/cuecard';
import { CuecardService } from 'src/app/cuecard/cuecard.service';
import { Tag } from 'src/app/tag';

@Component({
  selector: 'app-cuecard-card',
  templateUrl: './cuecard-card.component.html',
  styleUrls: ['./cuecard-card.component.scss']
})
export class CuecardCardComponent implements OnInit {

  @Input() cuecard: Cuecard
  tags: Tag[]

  constructor(private service: CuecardService) { }

  ngOnInit() {
    if (this.cuecard) {
      this.service.getTags(this.cuecard.uuid).subscribe(tags => this.tags = tags)
    }
  }

}
