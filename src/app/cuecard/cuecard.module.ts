import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CuecardComponent } from './cuecard.component';
import { CuecardRoutingModule } from './cuecard-routing.module';



@NgModule({
  declarations: [CuecardComponent],
  imports: [
    CommonModule,
    CuecardRoutingModule
  ],
  exports: [
    CuecardComponent,
  ]
})
export class CuecardModule { }
