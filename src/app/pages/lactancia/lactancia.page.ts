import { LactanciaModel } from './interfaces/lactancia.interface';
import { Component } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { LocalStorageService } from './../../shared/services/local-storage.service';

@Component({
  selector: 'app-lactancia',
  templateUrl: './lactancia.page.html',
  styleUrls: ['./lactancia.page.scss'],
})
export class LactanciaPage {
  arrPechoOption: string[] = [
    'lactanciaPechoIzquierdo',
    'lactanciaPechoDerecho',
  ];
  pechoIzq: any[] = [];
  pechoDer: any[] = [];
  constructor(
    private readonly lsSvc: LocalStorageService,
    private readonly alertController: AlertController,
    private readonly toastController: ToastController
  ) {}

  ionViewWillEnter() {
    //this.deleteLS();
    this.getInfoPechos();
  }

  //! PUBLICAS
  btnAddLactancia(): void {
    this.seleccionarPecho();
  }
  //! PRIVADAS
  private getInfoPechos(): void {
    this.getInfoPechoIzq();
    this.getInfoPechoDer();
  }
  private getInfoPechoIzq(): void {
    this.lsSvc.getFromLocalStorage(this.arrPechoOption[0]).then((resIzq) => {
      this.pechoIzq = JSON.parse(resIzq) || [];
      //console.log({ resIzq });
      //console.log({ pechoIzq: this.pechoIzq });
    });
  }
  private getInfoPechoDer(): void {
    this.lsSvc.getFromLocalStorage(this.arrPechoOption[1]).then((resDer) => {
      this.pechoDer = JSON.parse(resDer) || [];
      //console.log({ resDer });
      //console.log({ pechoDer: this.pechoDer });
    });
  }
  private async seleccionarPecho(): Promise<void> {
    const alert = await this.alertController.create({
      mode: 'ios',
      header: 'Selecciona un pecho',
      inputs: [
        {
          label: 'Pecho izquierdo',
          type: 'radio',
          value: {
            nombre: 'Pecho Izquierdo',
            value: 'lactanciaPechoIzquierdo',
          },
        },
        {
          label: 'Pecho Derecho',
          type: 'radio',
          value: { nombre: 'Pecho Derecho', value: 'lactanciaPechoDerecho' },
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'destructive',
        },
        {
          text: 'Siguiente',
          handler: (res) => {
            this.seleccionaHora(res);
          },
        },
      ],
    });
    await alert.present();
  }

  private async seleccionaHora(pecho: LactanciaModel): Promise<void> {
    const today = new Date();
    const time = today.getHours() + ':' + today.getMinutes();
    const alert = await this.alertController.create({
      mode: 'ios',
      header: 'Selecciona una hora',
      subHeader: pecho.nombre,
      inputs: [
        {
          type: 'time',
          value: time,
          label: 'HoraLabel',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'destructive',
        },
        {
          text: 'Guardar',
          handler: (hora) => {
            this.guardarLactancia(pecho, hora[0]);
          },
        },
      ],
    });
    await alert.present();
  }
  private guardarLactancia(pecho: LactanciaModel, hora: string): void {
    if (pecho.value === this.arrPechoOption[0]) {
      this.lsSvc
        .setInLocalStorage(
          pecho.value,
          JSON.stringify([hora, ...this.pechoIzq])
        )
        .then((res) => {
          this.handlerSuccess('Guardado');
          this.getInfoPechoIzq();
        });
      return;
    }
    this.lsSvc
      .setInLocalStorage(pecho.value, JSON.stringify([hora, ...this.pechoDer]))
      .then((res) => {
        this.handlerSuccess('Guardado');
        this.getInfoPechoDer();
      });
  }
  private async handlerSuccess(text: string): Promise<void> {
    const toast = await this.toastController.create({
      header: 'Información',
      message: text,
      icon:'checkmark-circle-outline',
      mode: 'ios',
      color:'success',
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();
  }
  private deleteLS(): void {
    this.lsSvc.removeFromLocalStorage(this.arrPechoOption[0]).then();
    this.lsSvc.removeFromLocalStorage(this.arrPechoOption[1]).then();
  }
}
