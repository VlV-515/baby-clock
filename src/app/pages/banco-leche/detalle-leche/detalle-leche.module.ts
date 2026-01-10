import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleLechePageRoutingModule } from './detalle-leche-routing.module';

import { DetalleLechePage } from './detalle-leche.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleLechePageRoutingModule
  ],
  declarations: [DetalleLechePage]
})
export class DetalleLechePageModule {}
