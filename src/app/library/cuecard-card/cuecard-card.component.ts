import { Component, OnInit, Input } from '@angular/core';
import { Cuecard } from 'src/app/events/cuecard';
import { CuecardService } from 'src/app/cuecard/cuecard.service';
import { Tag } from 'src/app/tag';
import { MatDialog } from '@angular/material/dialog';
import { TagsEditorComponent, TagsEditorData } from '../tags-editor/tags-editor.component';

@Component({
  selector: 'app-cuecard-card',
  templateUrl: './cuecard-card.component.html',
  styleUrls: ['./cuecard-card.component.scss']
})
export class CuecardCardComponent implements OnInit {

  @Input() cuecard: Cuecard
  @Input() tagsedit: boolean
  tags: Tag[]
  issueCount: number =  0
  issueDescription: String = ""
  @Input() showIssues: boolean

  constructor(private service: CuecardService, private dialog: MatDialog) { 
  }

  ngOnInit() {
    if (this.cuecard) {
      this.service.getTags(this.cuecard.uuid).subscribe(tags => this.tags = tags)

      if (!this.cuecard.music_file) {
        this._addIssue("There is no music file associated for this cuecard.");
      }

      if (!this.cuecard.karaoke_marks) {
        this._addIssue("There are no karaoke marks available for this cuecard");
      }
    }
  }

  editTags(e: Event, cuecard: Cuecard) {
    e.preventDefault();
    e.stopPropagation();

    let data = new TagsEditorData(cuecard);

    const dialogRef = this.dialog.open(TagsEditorComponent, {
      data: data,
      height: '720px',
      width: '800px'
    });

    dialogRef.afterClosed().subscribe(_ => {
      this.service.getTags(this.cuecard.uuid).subscribe(tags => this.tags = tags)
    })
  }

  _addIssue(description: String) {
    this.issueCount++;

    if (this.showIssues) {
      this.issueDescription += description + "\n";
    }
  }
}
