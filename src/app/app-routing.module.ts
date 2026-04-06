import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'lactancia',
    loadChildren: () =>
      import('./pages/lactancia/lactancia.module').then(
        (m) => m.LactanciaPageModule
      ),
  },
  {
    path: 'banco-leche',
    loadChildren: () =>
      import('./pages/banco-leche/banco-leche.module').then(
        (m) => m.BancoLechePageModule
      ),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'aseo',
    loadChildren: () =>
      import('./pages/aseo/aseo.module').then((m) => m.AseoPageModule),
  },
  {
    path: 'dormir',
    loadChildren: () =>
      import('./pages/dormir/dormir.module').then((m) => m.DormirPageModule),
  },
  {
    path: 'banco-leche',
    loadChildren: () =>
      import('./pages/banco-leche/banco-leche.module').then(
        (m) => m.BancoLechePageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
