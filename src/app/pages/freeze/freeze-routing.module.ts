import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FreezePage } from './freeze.page';

const routes: Routes = [
  {
    path: '',
    component: FreezePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FreezePageRoutingModule {}
