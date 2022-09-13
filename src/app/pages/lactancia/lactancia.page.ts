import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AlertasService } from './../../shared/services/alertas.service';
import { LocalStorageService } from './../../shared/services/local-storage.service';
import { LactanciaModel, PechoModel } from './interfaces/lactancia.interface';

@Component({
  selector: 'app-lactancia',
  templateUrl: './lactancia.page.html',
  styleUrls: ['./lactancia.page.scss'],
})
export class LactanciaPage {
  arrPechoOption: string[] = [
    'lactanciaPechoIzquierdo',
    'lactanciaPechoDerecho',
    'LactanciaUltimoPecho',
  ];
  pechoIzq: any[] = [];
  pechoDer: any[] = [];
  ultimoPecho: PechoModel = null;

  constructor(
    private readonly alertasSvc: AlertasService,
    private readonly lsSvc: LocalStorageService,
    private readonly alertController: AlertController
  ) {}

  ionViewWillEnter() {
    //this.deleteLS();
    this.getInfoGeneral();
  }
  //! PUBLICAS
  btnAddLactancia(): void {
    this.seleccionarPecho();
  }
  isUltimoPecho(pecho: string): boolean {
    return this.ultimoPecho === (pecho as unknown as PechoModel);
  }
  async btnDeleteHorario(pecho: string, index: number): Promise<void> {
    const estaSeguro = await this.alertasSvc.handlerConfirmAlert({
      message: '¿Seguro que desea eliminarlo?',
    });
    if (estaSeguro) {
      if (pecho === this.arrPechoOption[0]) {
        this.deleteHorario(index, this.pechoIzq);
        return;
      }
      this.deleteHorario(index, this.pechoDer);
    }
  }
  //! PRIVADAS
  private getInfoGeneral(): void {
    this.getInfoPechoIzq();
    this.getInfoPechoDer();
    this.getInfoUltimoPecho();
  }
  private getInfoPechoIzq(): void {
    this.lsSvc.getFromLocalStorage(this.arrPechoOption[0]).then((resIzq) => {
      const arrPecho = JSON.parse(resIzq).slice(0, 3) || [];
      this.pechoIzq = arrPecho;
    });
  }
  private getInfoPechoDer(): void {
    this.lsSvc.getFromLocalStorage(this.arrPechoOption[1]).then((resDer) => {
      const arrPecho = JSON.parse(resDer).slice(0, 3) || [];
      this.pechoDer = arrPecho;
    });
  }
  private getInfoUltimoPecho(): void {
    this.lsSvc.getFromLocalStorage(this.arrPechoOption[2]).then((res) => {
      this.ultimoPecho = (res as unknown as PechoModel) || null;
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
      this.saveLSLactancia(pecho, hora, this.pechoIzq);
      return;
    }
    this.saveLSLactancia(pecho, hora, this.pechoDer);
  }
  private saveLSLactancia(
    pecho: LactanciaModel,
    hora: string,
    arrayPechos: string[]
  ): void {
    this.lsSvc
      .setInLocalStorage(pecho.value, JSON.stringify([hora, ...arrayPechos]))
      .then((res) => this.guardarUltimoPecho(pecho.value));
  }
  private guardarUltimoPecho(pecho: string): void {
    this.lsSvc.setInLocalStorage(this.arrPechoOption[2], pecho).then(() => {
      this.alertasSvc.handlerToastMessagesAlert({
        message: 'Guardado',
        color: 'success',
      });
      this.getInfoGeneral();
    });
  }
  private deleteHorario(index: number, arrPecho: any[]): void {
    arrPecho.splice(index, 1);
    this.alertasSvc.handlerToastMessagesAlert({
      message: 'Eliminado',
      color: 'danger',
    });
  }
  private deleteLS(): void {
    this.lsSvc.removeFromLocalStorage(this.arrPechoOption[0]).then();
    this.lsSvc.removeFromLocalStorage(this.arrPechoOption[1]).then();
    this.lsSvc.removeFromLocalStorage(this.arrPechoOption[2]).then();
  }
}
