import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FreezePageRoutingModule } from './freeze-routing.module';

import { FreezePage } from './freeze.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FreezePageRoutingModule
  ],
  declarations: [FreezePage]
})
export class FreezePageModule {}
