import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EatPage } from './eat.page';

const routes: Routes = [
  {
    path: '',
    component: EatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EatPageRoutingModule {}
