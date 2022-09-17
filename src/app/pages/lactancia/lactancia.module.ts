import { PipesModule } from './../../shared/pipes/pipes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LactanciaPageRoutingModule } from './lactancia-routing.module';

import { LactanciaPage } from './lactancia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LactanciaPageRoutingModule,
    PipesModule,
  ],
  declarations: [LactanciaPage],
})
export class LactanciaPageModule {}
