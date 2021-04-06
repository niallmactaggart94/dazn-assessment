import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { HomePageComponent } from './home-page/home-page.component';
import {SharedComponentsModule} from '../shared/components/shared-components.module';

@NgModule({
  declarations: [
    HomePageComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    SharedComponentsModule
  ],
  providers: [],
  exports: [
    CommonModule,
    HomePageComponent
  ]
})
export class SystemPagesModule { }

