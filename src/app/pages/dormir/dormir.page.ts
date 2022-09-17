import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AlertasService } from 'src/app/shared/services/alertas.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
export enum TipoDormir {
  siesta = 'DormirSiesta',
  noche = 'DormirNoche',
  siestaEnCurso = 'DormirSiestaEnCurso',
}
export interface DormirModel {
  inicio: DormirDetalleModel;
  final?: DormirDetalleModel;
}
export interface DormirDetalleModel {
  hora: string;
  detalle?: string;
}
@Component({
  selector: 'app-dormir',
  templateUrl: './dormir.page.html',
  styleUrls: ['./dormir.page.scss'],
})
export class DormirPage {
  arrSiesta: DormirModel[] = [
    {
      inicio: {
        hora: '08:00',
        detalle: 'Siesta inicio',
      },
      final: {
        hora: '10:00',
        detalle: 'Siesta final',
      },
    },
    {
      inicio: {
        hora: '12:00',
        detalle: 'Detalle siesta inicio',
      },
      final: {
        hora: '14:00',
        detalle: 'Detalle siesta final',
      },
    },
  ];
  arrNoche: DormirModel[] = [
    {
      inicio: {
        hora: '22:00',
        detalle: 'Noche inicio',
      },
      final: {
        hora: '06:00',
        detalle: 'Noche final',
      },
    },
    {
      inicio: {
        hora: '23:00',
        detalle: 'Detalle noche inicio',
      },
      final: {
        hora: '07:00',
        detalle: 'Detalle noche final',
      },
    },
  ];
  objSiestaEnCurso: DormirDetalleModel = null;
  constructor(
    private readonly lsSvc: LocalStorageService,
    private readonly alertaSvc: AlertasService,
    private readonly alertController: AlertController
  ) {}
  //! SISTEMA
  ionViewWillEnter() {
    this.initDormir();
    //this.deleteLS();
  }
  //! PUBLICAS
  public async btnInicioSiestaEnCurso(): Promise<void> {
    const seguro = await this.alertaSvc.handlerConfirmAlert({
      message: '¿Estas seguro de iniciar la siesta?',
    });
    if (!seguro) {
      return;
    }
    const hora = this.getHora();
    const obj: DormirDetalleModel = { hora };
    this.objSiestaEnCurso = obj;
    await this.lsSvc.setInLocalStorage(
      TipoDormir.siestaEnCurso,
      JSON.stringify(obj)
    );
  }
  public async btnFinalSiestaEnCurso(): Promise<void> {
    const seguro = await this.alertaSvc.handlerConfirmAlert({
      message: '¿Estas seguro de finalizar la siesta?',
    });
    if (!seguro) {
      return;
    }
    const detalle = await this.getDetalle(TipoDormir.siesta);
    const hora = this.getHora();
    const objSiesta: DormirModel = {
      inicio: this.objSiestaEnCurso,
      final: { hora, detalle },
    };
    this.arrSiesta.unshift(objSiesta);
    this.objSiestaEnCurso = null;
    await this.lsSvc.setInLocalStorage(
      TipoDormir.siesta,
      JSON.stringify(this.arrSiesta)
    );
    await this.lsSvc.setInLocalStorage(TipoDormir.siestaEnCurso, null);
  }
  //! PRIVADAS
  private async initDormir(): Promise<void> {
    await this.getDormir(TipoDormir.siesta);
    await this.getDormir(TipoDormir.noche);
    await this.getDormir(TipoDormir.siestaEnCurso);
  }
  private async getDormir(tipoDormir: TipoDormir): Promise<void> {
    const dormir = await this.lsSvc.getFromLocalStorage(tipoDormir);
    if (tipoDormir === TipoDormir.siestaEnCurso) {
      this.objSiestaEnCurso = dormir ? JSON.parse(dormir) : null;
      return;
    }
    const arr = dormir ? JSON.parse(dormir).slice(0, 5) : [];
    if (tipoDormir === TipoDormir.siesta) {
      this.arrSiesta = arr;
      return;
    }
    if (tipoDormir === TipoDormir.noche) {
      this.arrNoche = arr;
      return;
    }
  }
  private getHora(): string {
    const today = new Date();
    return today.getHours() + ':' + today.getMinutes();
  }
  private async getDetalle(tipoDormir: TipoDormir): Promise<string> {
    const alert = await this.alertController.create({
      header: `Detalles de la ${
        tipoDormir === TipoDormir.siesta ? 'siesta' : 'noche'
      }`,
      inputs: [
        {
          name: 'detalle',
          type: 'text',
          placeholder: 'Detalles',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Guardar',
          handler: (res) => res.detalle,
        },
      ],
    });
    await alert.present();
    const { data } = await alert.onDidDismiss();
    return data.values.detalle;
  }
}
