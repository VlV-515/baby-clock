import { LocalStorageService } from './../../shared/services/local-storage.service';
import { AlertController } from '@ionic/angular';
import { AlertasService } from './../../shared/services/alertas.service';
import { Component } from '@angular/core';
export interface AseoModel {
  cuando: string;
  detalle: string;
}

@Component({
  selector: 'app-aseo',
  templateUrl: './aseo.page.html',
  styleUrls: ['./aseo.page.scss'],
})
export class AseoPage {
  optTipoAseo = ['AseoPipi', 'AseoPopo'];
  arrPipi: AseoModel[] = [];
  arrPopo: AseoModel[] = [];

  constructor(
    private readonly lsSvc: LocalStorageService,
    private readonly alertaSvc: AlertasService,
    private readonly alertController: AlertController
  ) {}
  //! SISTEMA
  ionViewWillEnter() {
    this.getAseos();
  }
  //! PUBLICAS
  public getAseos(): void {
    this.getAseo(this.optTipoAseo[0]);
    this.getAseo(this.optTipoAseo[1]);
  }
  public btnAddAseo(): void {
    this.selectAseo();
  }
  public btnMostrarDetalle(detalle: string): void {
    this.alertaSvc.handlerConfirmAlert({
      message: detalle,
      btnCancelar: false,
    });
  }
  //! PRIVADAS
  private async getAseo(tipoAseo): Promise<void> {
    const aseo = await this.lsSvc.getFromLocalStorage(tipoAseo);
    const arr = JSON.parse(aseo).slice(0, 5) || [];

    if (tipoAseo === this.optTipoAseo[0]) {
      this.arrPipi = arr;
      return;
    }
    this.arrPopo = arr;
    return;
  }
  private async selectAseo(): Promise<void> {
    const alert = await this.alertController.create({
      mode: 'ios',
      header: 'Selecciona un tipo de aseo',
      inputs: [
        {
          label: 'Pipi 💦',
          value: this.optTipoAseo[0],
          type: 'radio',
        },
        {
          label: 'Popo 💩',
          value: this.optTipoAseo[1],
          type: 'radio',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'destructive',
        },
        {
          text: 'Siguiente',
          handler: (res) => this.selectDetallesAseo(res),
        },
      ],
    });
    await alert.present();
  }
  private async selectDetallesAseo(tipoAseo: string): Promise<void> {
    const today = new Date();
    const time = today.getHours() + ':' + today.getMinutes();

    const alert = await this.alertController.create({
      mode: 'ios',
      header: 'Selecciona los detalles',
      inputs: [
        {
          type: 'time',
          value: time,
          label: 'Hora',
        },
        {
          type: 'textarea',
          placeholder: 'Detalles del aseo',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'destructive',
        },
        {
          text: 'Guardar',
          handler: (res) => this.guardarAseo(tipoAseo, res[0], res[1]),
        },
      ],
    });
    await alert.present();
  }
  private async guardarAseo(tipoAseo, hora, detalle): Promise<void> {
    const obj: AseoModel = {
      cuando: hora,
      detalle,
    };
    const arrObj: AseoModel[] =
      tipoAseo === this.optTipoAseo[0]
        ? [obj, ...this.arrPipi]
        : [obj, ...this.arrPipi];
    await this.lsSvc.setInLocalStorage(tipoAseo, JSON.stringify(arrObj));
    this.alertaSvc.handlerMessages({ message: 'Guardado', color: 'success' });
    this.getAseo(tipoAseo);
  }
}
