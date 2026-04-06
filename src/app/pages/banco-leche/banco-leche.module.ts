import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BancoLechePageRoutingModule } from './banco-leche-routing.module';

import { BancoLechePage } from './banco-leche.page';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BancoLechePageRoutingModule,
    PipesModule,
  ],
  declarations: [BancoLechePage],
})
export class BancoLechePageModule {}
