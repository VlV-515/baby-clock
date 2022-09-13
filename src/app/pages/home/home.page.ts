import { Component, OnInit } from '@angular/core';
export interface HomeModel {
  nombre: string;
  router: string;
  icon: string;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  objData: HomeModel[] = [
    {
      nombre: 'lactancia',
      router: '/lactancia',
      icon: 'restaurant-outline',
    },
    {
      nombre: 'aseo',
      router: '/aseo',
      icon: 'fish-outline',
    },
    {
      nombre: 'dormir',
      router: '/dormir',
      icon: 'moon-outline',
    },
    {
      nombre: 'juego',
      router: '',
      icon: 'football-outline',
    },
    {
      nombre: 'congelado',
      router: '',
      icon: 'snow-outline',
    },
  ];

  constructor() {}

  ngOnInit() {}
}
