import { Component } from '@angular/core';
export interface DormirModel {
  inicio: DormirFechasModel;
  final?: DormirFechasModel;
}
export interface DormirFechasModel {
  cuando: string;
  detalle: string;
}
@Component({
  selector: 'app-dormir',
  templateUrl: './dormir.page.html',
  styleUrls: ['./dormir.page.scss'],
})
export class DormirPage {
  optTipoDormir = ['DormirSiesta', 'DormirNoche', 'DormirSiestaEnCurso'];
  arrSiesta: DormirModel[] = [
    {
      inicio: {
        cuando: '08:00',
        detalle: 'Siesta inicio',
      },
      final: {
        cuando: '10:00',
        detalle: 'Siesta final',
      },
    },
    {
      inicio: {
        cuando: '12:00',
        detalle: 'Detalle siesta inicio',
      },
      final: {
        cuando: '14:00',
        detalle: 'Detalle siesta final',
      },
    },
  ];
  arrNoche: DormirModel[] = [
    {
      inicio: {
        cuando: '22:00',
        detalle: 'Noche inicio',
      },
      final: {
        cuando: '06:00',
        detalle: 'Noche final',
      },
    },
    {
      inicio: {
        cuando: '23:00',
        detalle: 'Detalle noche inicio',
      },
      final: {
        cuando: '07:00',
        detalle: 'Detalle noche final',
      },
    },
  ];
  constructor() {}
}
