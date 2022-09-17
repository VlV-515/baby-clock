import { PipesModule } from './../../shared/pipes/pipes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AseoPageRoutingModule } from './aseo-routing.module';

import { AseoPage } from './aseo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AseoPageRoutingModule,
    PipesModule
  ],
  declarations: [AseoPage]
})
export class AseoPageModule {}
