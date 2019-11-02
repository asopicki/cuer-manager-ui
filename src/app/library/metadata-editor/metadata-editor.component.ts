import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Cuecard } from 'src/app/events/cuecard';
import { rhythms, phases } from '../../shared/rhythms';

export interface MetaDataEditorInterface {
  cuecard: Cuecard
}

export class MetaDataEditorData implements MetaDataEditorInterface {
  cuecard: Cuecard
  
  constructor(cuecard: Cuecard) {
    this.cuecard = cuecard;
  }
}

@Component({
  selector: 'app-metadata-editor',
  templateUrl: './metadata-editor.component.html',
  styleUrls: ['./metadata-editor.component.scss']
})
export class MetadataEditorComponent implements OnInit {

  metaDataGroup: FormGroup
  cueCard: Cuecard
  rhythms = rhythms;
  phases = phases;

  constructor(
    public dialogRef: MatDialogRef<MetadataEditorComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: MetaDataEditorInterface) {
      this.cueCard = data.cuecard;
      
      this.metaDataGroup = new FormGroup({
        choreographer: new FormControl(this.cueCard.choreographer, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
        phase: new FormControl(this.cueCard.phase, [Validators.required]),
        difficulty: new FormControl(this.cueCard.meta['difficulty'], [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
        rhythm: new FormControl(this.cueCard.rhythm, [Validators.required]),
        plusfigures: new FormControl(this.cueCard.meta['plusfigures'], [Validators.maxLength(255)]),
        steplevel: new FormControl(this.cueCard.meta['steplevel'], [Validators.maxLength(10)]),
        music: new FormControl(this.cueCard.meta['music'], [Validators.maxLength(255)]),
        music_file: new FormControl(this.cueCard.music_file, [Validators.maxLength(255)]),
      });
  }

  ngOnInit() {
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
