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
  optPecho: string[] = [
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
      if (pecho === this.optPecho[0]) {
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
  private async getInfoPechoIzq(): Promise<void> {
    const resIzq = await this.lsSvc.getFromLocalStorage(this.optPecho[0]);
    const arrPecho = resIzq ? JSON.parse(resIzq).slice(0, 3) : [];
    this.pechoIzq = arrPecho;
  }
  private async getInfoPechoDer(): Promise<void> {
    const resDer = await this.lsSvc.getFromLocalStorage(this.optPecho[1]);
    const arrPecho = resDer ? JSON.parse(resDer).slice(0, 3) : [];
    this.pechoDer = arrPecho;
  }
  private async getInfoUltimoPecho(): Promise<void> {
    const resPecho = (await this.lsSvc.getFromLocalStorage(
      this.optPecho[2]
    )) as unknown as PechoModel;
    this.ultimoPecho = resPecho || null;
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
            value: this.optPecho[0],
          },
        },
        {
          label: 'Pecho Derecho',
          type: 'radio',
          value: {
            nombre: 'Pecho Derecho',
            value: this.optPecho[1],
          },
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
    if (pecho.value === this.optPecho[0]) {
      this.saveLSLactancia(pecho, hora, this.pechoIzq);
      return;
    }
    this.saveLSLactancia(pecho, hora, this.pechoDer);
  }
  private async saveLSLactancia(
    pecho: LactanciaModel,
    hora: string,
    arrayPechos: string[]
  ): Promise<void> {
    await this.lsSvc.setInLocalStorage(
      pecho.value,
      JSON.stringify([hora, ...arrayPechos])
    );
    this.guardarUltimoPecho(pecho.value);
  }
  private async guardarUltimoPecho(pecho: string): Promise<void> {
    await this.lsSvc.setInLocalStorage(this.optPecho[2], pecho);
    this.alertasSvc.handlerToastMessagesAlert({
      message: 'Guardado',
      color: 'success',
    });
    this.getInfoGeneral();
  }
  private deleteHorario(index: number, arrPecho: any[]): void {
    arrPecho.splice(index, 1);
    this.alertasSvc.handlerToastMessagesAlert({
      message: 'Eliminado',
      color: 'danger',
    });
  }
  private deleteLS(): void {
    this.optPecho.forEach(
      async (key) => await this.lsSvc.removeFromLocalStorage(key)
    );
  }
}
