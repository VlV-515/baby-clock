import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShawerPage } from './shawer.page';

const routes: Routes = [
  {
    path: '',
    component: ShawerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShawerPageRoutingModule {}
