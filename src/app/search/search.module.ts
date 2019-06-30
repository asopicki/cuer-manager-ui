import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';
import { SearchRoutingModule } from './search-routing.module';

import {
  MatButtonModule, 
  MatFormFieldModule, 
  MatInputModule, 
  MatDialogModule, 
  MatSelectModule,
  MatDividerModule
} from '@angular/material';
import { SearchComponent } from './search/search.component';

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
  declarations: [SearchDialogComponent, SearchComponent],
  imports: [
    ...modules,
    CommonModule,
    ReactiveFormsModule,
    SearchRoutingModule
  ],
  exports: [
    ...modules,
    SearchComponent
  ],
  entryComponents: [ SearchDialogComponent ]
})
export class SearchModule { }
