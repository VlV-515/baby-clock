import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleLechePage } from './detalle-leche.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleLechePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleLechePageRoutingModule {}
