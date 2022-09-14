import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DormirPage } from './dormir.page';

const routes: Routes = [
  {
    path: '',
    component: DormirPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DormirPageRoutingModule {}
