import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EatPageRoutingModule } from './eat-routing.module';

import { EatPage } from './eat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EatPageRoutingModule
  ],
  declarations: [EatPage]
})
export class EatPageModule {}
