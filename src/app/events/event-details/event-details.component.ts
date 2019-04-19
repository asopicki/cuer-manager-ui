import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, of, EMPTY } from "rxjs";
import { map, mergeMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';

import { Event } from '../event';
import { Tip } from '../tip';
import { Cuecard } from '../cuecard';
import { EventService } from "../event.service";
import { ProgramService } from "../program.service";
import { TipService } from "../tip.service";
import { Program } from '../program';
import { TipDialogComponent } from './tip-dialog/tip-dialog.component';


const urls = {
  'cuecard_data': '/v2/cuecards/'
};

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  event: Event;
  tips: Tip[];
  loading: boolean;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private eventService: EventService, 
    private programService: ProgramService, 
    private tipService: TipService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loading = true
    this.route.paramMap.subscribe(params => this.getEvent(params.get('uuid') || '').subscribe(event => {
      this.event = event;
      this.tips = event.getTips();
      this.loading = false;
    }))
  }

  getEvent(uuid: string): Observable<Event> {
    let result = null
  
    if (!uuid) {
        return EMPTY
    }

    return this.eventService.getEvent(uuid).pipe(
        mergeMap(event => {
            if (event) {
              result = event
              this.programService.getProgram(event).pipe(
                    map(program => {
                        result.setProgram(program);
                        if (program) {
                            this.tipService.getTips(program).subscribe(tips => { if (tips) result.setTips(tips)});
                        }
                        return event;
                    })
              ).subscribe(_ => {})
              return of(result);
            } else {
               return of(null);
            }
    }));
}  

  plusFigures(cuecard: Cuecard): String {
    return cuecard.meta['plusfigures'];
  }

  cuecardLink(cuecard: Cuecard): String {
    return urls['cuecard_data'] + cuecard.uuid;
  }

  program(): Program {
    if (this.event) {
      return this.event.getProgram();
    }

    return null;
  }

  addTip(): void {
    const dialogRef = this.dialog.open(TipDialogComponent, {
      data: {name: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.debug('The name of the tip is', result);

      if ( result ) {
        console.debug('Program ID:', this.event.getProgram().id);
        console.debug('Start date:', this.event.date_start);

        /*this.tipService.createTip(result).subscribe(tip => {
          console.debug('Tip created!', tip)
        });*/
      }
    });
  }
}
