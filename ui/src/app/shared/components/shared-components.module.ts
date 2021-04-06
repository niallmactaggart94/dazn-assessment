
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {LoadingComponent} from './loading/loading.component';
import {ErrorComponent} from './error/error.component';
import {BackLinkComponent} from './back-link/back-link.component';

@NgModule({
  declarations: [
    LoadingComponent,
    ErrorComponent,
    BackLinkComponent
  ],
  imports: [
    CommonModule,
  ],
  providers: [],
  exports: [
    LoadingComponent,
    ErrorComponent,
    BackLinkComponent
  ]
})
export class SharedComponentsModule { }
