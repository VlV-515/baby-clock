import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AseoPage } from './aseo.page';

const routes: Routes = [
  {
    path: '',
    component: AseoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AseoPageRoutingModule {}
