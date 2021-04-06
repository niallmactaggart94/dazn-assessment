
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from 'src/app/app-routing.module';
import {FormsModule} from '@angular/forms';
import {SharedComponentsModule} from '../shared/components/shared-components.module';
import {WatchComponent} from './watch.component';


@NgModule({
  declarations: [
    WatchComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    SharedComponentsModule
  ],
  providers: [],
  exports: [
    CommonModule,
    WatchComponent,

  ]
})
export class WatchModule { }
