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

  constructor(private service: CuecardService, private dialog: MatDialog) { }

  ngOnInit() {
    if (this.cuecard) {
      this.service.getTags(this.cuecard.uuid).subscribe(tags => this.tags = tags)
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

}
