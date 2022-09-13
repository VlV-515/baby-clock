import { Component, OnInit } from '@angular/core';
import { HomeModel } from 'src/app/shared/interfaces/HomeModel.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  objData: HomeModel[] = environment.objMenu;

  constructor() {}

  ngOnInit() {}
}
