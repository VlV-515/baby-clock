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
  optTipoAseo = ['AseoPipi', 'AseoPopo', 'AseoRegadera'];
  arrPipi: AseoModel[] = [];
  arrPopo: AseoModel[] = [];
  arrRegadera: AseoModel[] = [];

  constructor(
    private readonly lsSvc: LocalStorageService,
    private readonly alertaSvc: AlertasService,
    private readonly alertController: AlertController
  ) {}
  //! SISTEMA
  ionViewWillEnter() {
    //this.deleteLS();
    this.getAseos();
  }
  //! PUBLICAS
  public async getAseos(): Promise<void> {
    await this.getAseo(this.optTipoAseo[0]);
    await this.getAseo(this.optTipoAseo[1]);
    await this.getAseo(this.optTipoAseo[2]);
  }
  public btnAddAseo(): void {
    this.selectAseo();
  }
  public async btnDelete(index, tipoAseo): Promise<void> {
    const estaSeguro = await this.alertaSvc.handlerConfirmAlert({
      message: '¿Seguro que desea eliminarlo?',
    });
    if (!estaSeguro) {
      return;
    }
    if (tipoAseo === this.optTipoAseo[0]) {
      this.eliminarAseo(this.arrPipi, index, tipoAseo);
    }
    if (tipoAseo === this.optTipoAseo[1]) {
      this.eliminarAseo(this.arrPopo, index, tipoAseo);
    }
    if (tipoAseo === this.optTipoAseo[2]) {
      this.eliminarAseo(this.arrRegadera, index, tipoAseo);
    }
  }
  public btnMostrarDetalle(detalle: string): void {
    this.alertaSvc.handlerMessageAlert({
      message: detalle,
    });
  }
  //! PRIVADAS
  private async getAseo(tipoAseo): Promise<void> {
    const aseo = await this.lsSvc.getFromLocalStorage(tipoAseo);
    const arr = aseo ? JSON.parse(aseo).slice(0, 5) : [];

    if (tipoAseo === this.optTipoAseo[0]) {
      this.arrPipi = arr;
      return;
    }
    if (tipoAseo === this.optTipoAseo[1]) {
      this.arrPopo = arr;
      return;
    }
    if (tipoAseo === this.optTipoAseo[2]) {
      this.arrRegadera = arr;
      return;
    }
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
        {
          label: 'Baño 🛁',
          value: this.optTipoAseo[2],
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
    const isRegadera = tipoAseo === this.optTipoAseo[2];

    const alert = await this.alertController.create({
      mode: 'ios',
      header: 'Selecciona los detalles',
      inputs: [
        {
          type: isRegadera ? 'datetime-local' : 'time',
          value: isRegadera ? today : time,
          label: isRegadera ? 'Fecha' : 'Hora',
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
    let arrObj: AseoModel[];
    if (tipoAseo === this.optTipoAseo[0]) {
      arrObj = this.creaOBJ(obj, this.arrPipi);
    }
    if (tipoAseo === this.optTipoAseo[1]) {
      arrObj = this.creaOBJ(obj, this.arrPopo);
    }
    if (tipoAseo === this.optTipoAseo[2]) {
      arrObj = this.creaOBJ(obj, this.arrRegadera);
    }

    await this.lsSvc.setInLocalStorage(tipoAseo, JSON.stringify(arrObj));
    this.alertaSvc.handlerToastMessagesAlert({
      message: 'Guardado',
      color: 'success',
    });
    await this.getAseo(tipoAseo);
  }
  private creaOBJ(obj, arr): AseoModel[] {
    return [obj, ...arr];
  }
  private async eliminarAseo(arr, index, tipoAseo): Promise<void> {
    arr.splice(index, 1);
    this.actualizarAseo(tipoAseo, arr);
    this.alertaSvc.handlerToastMessagesAlert({
      message: 'Eliminado',
      color: 'danger',
    });
  }
  private async actualizarAseo(tipoAseo, arrAseo): Promise<void> {
    await this.lsSvc.setInLocalStorage(tipoAseo, JSON.stringify([...arrAseo]));
    await this.getAseo(tipoAseo);
  }
  private deleteLS(): void {
    this.optTipoAseo.forEach(
      async (key) => await this.lsSvc.removeFromLocalStorage(key)
    );
  }
}
