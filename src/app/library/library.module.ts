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

import { LibraryComponent } from './library.component';
import { LibraryRoutingModule } from './library-routing.module';
import { CuecardCardComponent } from './cuecard-card/cuecard-card.component';

const modules = [
  ReactiveFormsModule,
  FormsModule,
  MatFormFieldModule,
  MatButtonModule,
  MatInputModule,
  MatSelectModule,
  MatCardModule,
  MatListModule,
  MatChipsModule
]

@NgModule({
  declarations: [LibraryComponent, CuecardCardComponent],
  imports: [
    ...modules,
    LibraryRoutingModule,
    CommonModule
  ],
  exports: [LibraryComponent, CuecardCardComponent]
})
export class LibraryModule { }
