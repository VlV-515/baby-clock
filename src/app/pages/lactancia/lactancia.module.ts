import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LactanciaPageRoutingModule } from './lactancia-routing.module';

import { LactanciaPage } from './lactancia.page';
import { HoraPipe } from 'src/app/shared/pipes/hora.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LactanciaPageRoutingModule
  ],
  declarations: [LactanciaPage, HoraPipe]
})
export class LactanciaPageModule {}
