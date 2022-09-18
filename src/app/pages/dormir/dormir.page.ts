import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AlertasService } from 'src/app/shared/services/alertas.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import {
  DormirTipo,
  DormirModel,
  DormirDetalleModel,
} from './interfaces/dormir.interface';
@Component({
  selector: 'app-dormir',
  templateUrl: './dormir.page.html',
  styleUrls: ['./dormir.page.scss'],
})
export class DormirPage {
  arrSiesta: DormirModel[] = [];
  arrNoche: DormirModel[] = [];
  objSiestaEnCurso: DormirDetalleModel = null;
  objNocheEnCurso: DormirDetalleModel = null;
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
    return seguro ? this.iniciarSiesta() : null;
  }
  public async btnFinalSiestaEnCurso(): Promise<void> {
    const seguro = await this.alertaSvc.handlerConfirmAlert({
      message: '¿Estas seguro de finalizar la siesta?',
    });
    return seguro ? this.finalizarSesion(DormirTipo.siesta) : null;
  }
  public async btnInicioNocheEnCurso(): Promise<void> {
    const seguro = await this.alertaSvc.handlerConfirmAlert({
      message: '¿Estas seguro de iniciar el sueño de noche?',
    });
    return seguro ? this.iniciarNoche() : null;
  }
  public async btnFinalNocheEnCurso(): Promise<void> {
    const seguro = await this.alertaSvc.handlerConfirmAlert({
      message: '¿Estas seguro de finalizar el sueño de noche?',
    });
    return seguro ? this.finalizarSesion(DormirTipo.noche) : null;
  }
  //! PRIVADAS
  private async initDormir(): Promise<void> {
    await this.getDormir(DormirTipo.siesta);
    await this.getDormir(DormirTipo.noche);
    await this.getDormir(DormirTipo.siestaEnCurso);
    await this.getDormir(DormirTipo.nocheEnCurso);
  }
  private async getDormir(dormirTipo: DormirTipo): Promise<void> {
    const dormir = await this.lsSvc.getFromLocalStorage(dormirTipo);
    if (dormirTipo === DormirTipo.siestaEnCurso) {
      this.objSiestaEnCurso = dormir ? JSON.parse(dormir) : null;
      return;
    }
    if (dormirTipo === DormirTipo.nocheEnCurso) {
      this.objNocheEnCurso = dormir ? JSON.parse(dormir) : null;
      return;
    }
    const arr = dormir ? JSON.parse(dormir).slice(0, 5) : [];
    if (dormirTipo === DormirTipo.siesta) {
      this.arrSiesta = arr;
      return;
    }
    if (dormirTipo === DormirTipo.noche) {
      this.arrNoche = arr;
      return;
    }
  }
  private getHora(): string {
    const today = new Date();
    return today.getHours() + ':' + today.getMinutes();
  }
  private async getDetalle(dormirTipo: DormirTipo): Promise<string> {
    const alert = await this.alertController.create({
      mode: 'ios',
      header: `Detalles de la ${
        dormirTipo === DormirTipo.siesta ? 'siesta' : 'noche'
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
  private async iniciarSiesta(): Promise<void> {
    const hora = this.getHora();
    const obj: DormirDetalleModel = { hora };
    this.objSiestaEnCurso = obj;
    await this.lsSvc.setInLocalStorage(
      DormirTipo.siestaEnCurso,
      JSON.stringify(obj)
    );
  }
  private async iniciarNoche(): Promise<void> {
    const hora = this.getHora();
    const obj: DormirDetalleModel = { hora };
    this.objNocheEnCurso = obj;
    await this.lsSvc.setInLocalStorage(
      DormirTipo.nocheEnCurso,
      JSON.stringify(obj)
    );
  }

  private async finalizarSesion(dormirTipo: DormirTipo): Promise<void> {
    const detalle: string = await this.getDetalle(dormirTipo);
    const hora: string = this.getHora();
    const inicio: DormirDetalleModel =
      dormirTipo === DormirTipo.siesta
        ? this.objSiestaEnCurso
        : this.objNocheEnCurso;

    const obj: DormirModel = {
      inicio,
      final: { hora, detalle },
    };
    if (dormirTipo === DormirTipo.siesta) {
      this.arrSiesta.unshift(obj);
      this.objSiestaEnCurso = null;
      await this.lsSvc.setInLocalStorage(DormirTipo.siestaEnCurso, null);
      await this.lsSvc.setInLocalStorage(
        DormirTipo.siesta,
        JSON.stringify(this.arrSiesta)
      );
    }
    if (dormirTipo === DormirTipo.noche) {
      this.arrNoche.unshift(obj);
      this.objNocheEnCurso = null;
      await this.lsSvc.setInLocalStorage(DormirTipo.nocheEnCurso, null);
      await this.lsSvc.setInLocalStorage(
        DormirTipo.noche,
        JSON.stringify(this.arrNoche)
      );
    }
  }
}
