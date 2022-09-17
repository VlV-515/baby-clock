import { PipesModule } from './../../shared/pipes/pipes.module';
import { HoraPipe } from './../../shared/pipes/hora.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DormirPageRoutingModule } from './dormir-routing.module';

import { DormirPage } from './dormir.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DormirPageRoutingModule,
    PipesModule,
  ],
  declarations: [DormirPage],
})
export class DormirPageModule {}
