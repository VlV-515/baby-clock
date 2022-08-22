import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShawerPageRoutingModule } from './shawer-routing.module';

import { ShawerPage } from './shawer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShawerPageRoutingModule
  ],
  declarations: [ShawerPage]
})
export class ShawerPageModule {}
