import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, of, EMPTY } from "rxjs";
import { map, mergeMap, catchError } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { DateTime } from 'luxon';

import { Event } from '../event';
import { Tip } from '../tip';
import { Cuecard } from '../cuecard';
import { EventService } from "../event.service";
import { ProgramService } from "../program.service";
import { TipService } from "../tip.service";
import { Program } from '../program';
import { TipDialogComponent } from './tip-dialog/tip-dialog.component';
import { NotesEditorComponent } from './notes-editor/notes-editor.component';
import { SearchDialogComponent } from '../../search/search-dialog/search-dialog.component';


const urls = {
  'cuecard_data': '/cuecard/'
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
                            this.tipService.getTips(program).subscribe(tips => { 
                              if (tips) {
                                result.setTips(tips);
                                this.tips = tips;
                              }
                            });
                        }
                        return result;
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

  edit(event: Event) {
    if (event) {
      this.programService.getNotes(event).subscribe((notes) => {

        const dialogRef = this.dialog.open(NotesEditorComponent, {
          data: {
            notes: notes
          },
          height: '720px',
          width: '800px'
        });

        dialogRef.afterClosed().subscribe(result => {
          this.programService.updateNotes(event.program, result.notes).subscribe(
            notes => event.program.notes = notes
          )
        })
      })
    }
  }

  addTip(): void {
    let startDate = DateTime.fromJSDate(this.event.date_start);

    if (this.tips.length > 0) {
      startDate = DateTime.fromJSDate(this.tips[this.tips.length-1].date_end);
    }

    let endDate = startDate.plus({minutes: 15});

    const dialogRef = this.dialog.open(TipDialogComponent, {
      data: {
        startTime: startDate.toFormat('HH:mm'), 
        endTime: endDate.toFormat('HH:mm')
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      let startDate = DateTime.fromJSDate(this.event.date_start);
      let startTime = DateTime.fromISO(result.get('startTime').value);      
      let endTime = DateTime.fromISO(result.get('endTime').value);

      startDate = startDate.set({
        hour: startTime.hour,
        minute: startTime.minute,
        second: startTime.second,
        millisecond: startTime.millisecond
      });
      
      let endDate = startDate.set({
        hour: endTime.hour,
        minute: endTime.minute,
        second: endTime.second,
        millisecond: endTime.millisecond
      })

      this.tipService.createTip(
        result.get('name').value, 
        this.event.getProgram().id,
        startDate, 
        endDate).subscribe(_tip => {
        this.tipService.getTips(this.event.getProgram()).subscribe(tips => {
          this.event.setTips(tips);
          this.tips = tips;
        });
      });

    });
  }

  removeTip(tip: Tip): void {
    //console.debug('Removing tip', tip);

    this.tipService.removeTip(tip.uuid).subscribe(_ => {
      this.updateTips(this.event.getProgram())
    })
  }

  addCuecard(tip: Tip): void {
    // console.debug('Adding cuecard to', tip);

    const dialogRef = this.dialog.open(SearchDialogComponent);

    dialogRef.afterClosed().subscribe(cuecard => {
      // console.debug('Selected cuecard', cuecard);
      if (cuecard) {
        this.tipService.addCuecard(tip.uuid, cuecard.uuid, this.tips.length+1).subscribe(_ => {
          this.updateTips(this.event.getProgram())
        })
      }
      // console.debug('Search closed');
    })
  }

  removeCuecard(cuecard: Cuecard, tip: Tip): void {
    // console.debug('Removing cuecard', cuecard, 'from tip', tip);

    this.tipService.removeCuecard(tip.uuid, cuecard.uuid).subscribe(_ => {
      this.updateTips(this.event.getProgram())
    })
  }

  updateTips(program: Program) {
    this.tipService.getTips(program).subscribe(tips => {
      if (tips) this.tips = tips
    })
  }

  drop(event: CdkDragDrop<any>) {
    //Handle move from one tip to another
    if (event.container !== event.previousContainer) {
      let previousTip = <Tip>event.previousContainer.data;
      let tip = <Tip>event.container.data;
      let cuecard = <Cuecard>event.item.data;
      // console.log("Moving from index", event.previousIndex, "to index", event.currentIndex);

      //Step 1: add cuecard to it's new location
      this.tipService.addCuecard(tip.uuid, cuecard.uuid, event.currentIndex+1).subscribe(_ => {

        //Step 2: Adjust position of the cuecards from the currentIndex onward
        for(let i = event.currentIndex; i < tip.cuecards.length; i++) {
          let current = (<Cuecard[]>tip.cuecards)[i];
          this.tipService.updateCuecard(tip.uuid, current.uuid, i+2).subscribe(_ => {});
        }
        //Add cuecard to container
        tip.cuecards.splice(event.currentIndex,0,cuecard);
      })
     
      //Step 3: remove cuecard from it's previous location
      this.tipService.removeCuecard(previousTip.uuid, cuecard.uuid).subscribe(_ => {
        //Step 4: Adjust position of the cuecards after the previousIndex
        for(let i = event.previousIndex+1; i < previousTip.cuecards.length; i++) {
          let current = (<Cuecard[]>previousTip.cuecards)[i];
          this.tipService.updateCuecard(previousTip.uuid, current.uuid, i).subscribe(_ => {});
        }
        //Step 5: Remove the cuecard from the container
        previousTip.cuecards.splice(event.previousIndex,1);
      })

    } else if (event.currentIndex != event.previousIndex) {
      let tip = <Tip>event.container.data;

      let cuecards = [];

      for (let card of tip.cuecards) {
        cuecards.push({...card});
      }
      moveItemInArray(tip.cuecards, event.previousIndex, event.currentIndex);
  
      cuecards.forEach((cuecard, index) => {
        let newIndex = tip.cuecards.findIndex((card: Cuecard) => card.uuid == cuecard.uuid )
  
        if (index != newIndex) {
          this.tipService.updateCuecard(tip.uuid, (<Cuecard>cuecard).uuid, newIndex+1).subscribe(_ => {});
        }
      });
    }
  }

  open(cuecard: Cuecard) {
    window.open(cuecard.getLink().toString(), "_blank");
  }
}
