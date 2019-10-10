import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CuecardComponent } from './cuecard.component';

const routes: Routes = [
    { path: 'cuecard/:uuid', component: CuecardComponent},
];

@NgModule({
    imports: [
      RouterModule.forRoot(routes)
    ],
    exports: [
      RouterModule
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
  })
  export class CuecardRoutingModule { }