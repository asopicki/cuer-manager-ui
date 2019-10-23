import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import { LibraryComponent } from './library.component';
import { LibraryRoutingModule } from './library-routing.module';
import { CuecardCardComponent } from './cuecard-card/cuecard-card.component';
import { TagsEditorComponent } from './tags-editor/tags-editor.component';

const modules = [
  ReactiveFormsModule,
  FormsModule,
  MatFormFieldModule,
  MatButtonModule,
  MatInputModule,
  MatSelectModule,
  MatCardModule,
  MatListModule,
  MatChipsModule,
  MatAutocompleteModule
]

@NgModule({
  declarations: [LibraryComponent, CuecardCardComponent, TagsEditorComponent],
  imports: [
    ...modules,
    LibraryRoutingModule,
    CommonModule
  ],
  entryComponents: [TagsEditorComponent],
  exports: [LibraryComponent, CuecardCardComponent]
})
export class LibraryModule { }
