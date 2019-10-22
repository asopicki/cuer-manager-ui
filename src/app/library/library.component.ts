import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { SearchService } from '../search/search.service';
import { Cuecard } from '../events/cuecard';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {

  cuecards: Cuecard[]
  phases: string[]
  rhythms: string[]
  searchForm: FormGroup

  constructor(private searchService: SearchService) { 
    this.cuecards = [];

    this.phases = ['II', 'III', 'IV', 'V', 'VI'];
    this.rhythms = [
      'Two Step',
      'Waltz',
      'Cha-Cha-Cha',
      'Rumba',
      'Foxtrot',
      'Tango',
      'Bolero',
      'Mambo',
      'Quickstep',
      'Jive',
      'Slow Two Step',
      'Samba',
      'Single Swing',
      'West Coast Swing',
      'Paso Doble',
      'Argentine Tango',
      'Hesitation Canter Waltz'
    ]

    let titleControl = new FormControl(null);
    titleControl.valueChanges.pipe(
      debounceTime(200), distinctUntilChanged()
    ).subscribe((title: string) => {
      if (title && title.length > 2) {
        this.searchTitle(title);
      }
    });

    let rhythmControl = new FormControl(null);

    this.searchForm = new FormGroup({
      title: titleControl,
      rhythm: rhythmControl
    });

    this.getCuecards();
  }

  ngOnInit() {

  }

  searchTitle(title: string) {
    let collator = Intl.Collator();
    this.searchService.byTitle(title).subscribe(cuecards => {
      this.updateCuecards(cuecards, (a: Cuecard, b: Cuecard) => {
        return collator.compare(a.title.toString(), b.title.toString());
      });
    });
  }

  searchPhase(phase: string) {
    let collator = Intl.Collator();
    this.searchService.byPhase(phase).subscribe(cuecards => {
      this.updateCuecards(cuecards, (a: Cuecard, b: Cuecard) => {
        if (collator.compare(a.phase.toString(), b.phase.toString()) === 0) {
          return collator.compare(a.title.toString(), b.title.toString());
        } else {
          collator.compare(a.phase.toString(), b.phase.toString());
        }
      });
    })
  }

  rhythmChanged(event) {
    if (event.value) {
      let collator = Intl.Collator();
      this.searchService.byRhythm(event.value).subscribe(cuecards => {
        this.updateCuecards(cuecards, (a: Cuecard, b: Cuecard) => {
          if (collator.compare(a.rhythm.toString(), b.rhythm.toString()) === 0) {
            return collator.compare(a.title.toString(), b.title.toString());
          } else {
            collator.compare(a.rhythm.toString(), b.rhythm.toString());
          }
        });
      });
    }
  }

  updateCuecards(cuecards: Cuecard[], sortFunc) {
    this.cuecards = cuecards.sort(sortFunc);
  }

  open(cuecard: Cuecard) {
    window.open(cuecard.getLink().toString(), "_blank");
  }

  resetFilter() {
    this.searchForm.reset();
    this.getCuecards();
  }

  getCuecards() {
    this.searchService.getAll().subscribe(result => {
      this.updateCuecards(result, (a, b) => a.title.localeCompare(b.title.toString()));
    })
  }
}
