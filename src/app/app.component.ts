import { environment } from './../environments/environment';
import { HomeModel } from 'src/app/shared/interfaces/HomeModel.interface';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  objMenu: HomeModel[] = environment.objMenu;
  constructor() {}
  public btnRouter(route): void{}
}
