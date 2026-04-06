import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BancoLechePage } from './banco-leche.page';

const routes: Routes = [
  {
    path: '',
    component: BancoLechePage
  },
  {
    path: 'detalle-leche',
    loadChildren: () => import('./detalle-leche/detalle-leche.module').then( m => m.DetalleLechePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BancoLechePageRoutingModule {}
