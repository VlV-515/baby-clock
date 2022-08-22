import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'eat',
    loadChildren: () =>
      import('./pages/eat/eat.module').then((m) => m.EatPageModule),
  },
  {
    path: 'clean',
    loadChildren: () =>
      import('./pages/clean/clean.module').then((m) => m.CleanPageModule),
  },
  {
    path: 'game',
    loadChildren: () =>
      import('./pages/game/game.module').then((m) => m.GamePageModule),
  },
  {
    path: 'shawer',
    loadChildren: () =>
      import('./pages/shawer/shawer.module').then((m) => m.ShawerPageModule),
  },
  {
    path: 'freeze',
    loadChildren: () =>
      import('./pages/freeze/freeze.module').then((m) => m.FreezePageModule),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
