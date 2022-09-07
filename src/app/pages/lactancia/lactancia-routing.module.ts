import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LactanciaPage } from './lactancia.page';

const routes: Routes = [
  {
    path: '',
    component: LactanciaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LactanciaPageRoutingModule {}
