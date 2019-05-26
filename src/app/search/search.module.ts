import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';

import {
  MatButtonModule, 
  MatFormFieldModule, 
  MatInputModule, 
  MatDialogModule, 
  MatSelectModule,
  MatDividerModule
} from '@angular/material';

let modules =  [
  FormsModule,
  MatFormFieldModule,
  MatInputModule,
  MatDialogModule,
  MatButtonModule,
  MatSelectModule,
  MatDividerModule
]

@NgModule({
  declarations: [SearchDialogComponent],
  imports: [
    ...modules,
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    ...modules
  ],
  entryComponents: [ SearchDialogComponent ]
})
export class SearchModule { }
