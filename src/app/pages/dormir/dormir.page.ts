import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AlertasService } from 'src/app/shared/services/alertas.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import {
  DormirTipo,
  DormirModel,
  DormirDetalleModel,
  DormirAlertaModel,
  DormirTipoAlerta,
} from './interfaces/dormir.interface';
import { DateTime, DurationObjectUnits } from 'luxon';
@Component({
  selector: 'app-dormir',
  templateUrl: './dormir.page.html',
  styleUrls: ['./dormir.page.scss'],
})
export class DormirPage {
  objDormirTipo = DormirTipo;
  arrSiesta: DormirModel[] = [];
  arrNoche: DormirModel[] = [];
  objSiestaEnCurso: DormirDetalleModel = null;
  objNocheEnCurso: DormirDetalleModel = null;
  objAlertaDormir: DormirAlertaModel = null;
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
  public async btnInicioSesion(dormirTipo: DormirTipo): Promise<void> {
    const seguro = await this.alertaSvc.handlerConfirmAlert({
      message: '¿Estas seguro de iniciar la sesión?',
    });
    return seguro ? this.iniciarSesion(dormirTipo) : null;
  }
  public async btnFinalizaSesion(dormirTipo: DormirTipo): Promise<void> {
    const seguro = await this.alertaSvc.handlerConfirmAlert({
      message: '¿Estas seguro de finalizar la sesión?',
    });
    return seguro ? this.finalizarSesion(dormirTipo) : null;
  }
  public btnMostrarDetalle(detalle: string): void {
    this.alertaSvc.handlerMessageAlert({
      header: 'Información de la sesión',
      message: detalle,
    });
  }
  public async btnEliminarItem(
    index: number,
    dormirTipo: DormirTipo
  ): Promise<void> {
    const seguro = await this.alertaSvc.handlerConfirmAlert({
      message: '¿Estas seguro de eliminar la sesión?',
    });
    if (seguro) {
      if (dormirTipo === DormirTipo.siesta) {
        this.arrSiesta.splice(index, 1);
        this.lsSvc.setInLocalStorage(
          DormirTipo.siesta,
          JSON.stringify(this.arrSiesta)
        );
      }
      if (dormirTipo === DormirTipo.noche) {
        this.arrNoche.splice(index, 1);
        this.lsSvc.setInLocalStorage(
          DormirTipo.noche,
          JSON.stringify(this.arrNoche)
        );
      }
      this.alertaSvc.handlerToastMessagesAlert({
        message: 'Sesión eliminada con exito',
        color: 'danger',
      });
    }
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
      if (dormir) {
        this.objSiestaEnCurso = JSON.parse(dormir);
        this.setObjAlertaDormir(DormirTipo.siesta);
        this.alertaSiesta();
        return;
      }
      this.objSiestaEnCurso = null;
      return;
    }

    if (dormirTipo === DormirTipo.nocheEnCurso) {
      if (dormir) {
        this.objNocheEnCurso = JSON.parse(dormir);
        this.setObjAlertaDormir(DormirTipo.noche);
        return;
      }
      this.objNocheEnCurso = null;
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
  private async iniciarSesion(dormirTipo: DormirTipo): Promise<void> {
    const hora = this.getHora();
    const obj: DormirDetalleModel = { hora };
    if (dormirTipo === DormirTipo.siesta) {
      this.objSiestaEnCurso = obj;
      this.setObjAlertaDormir(DormirTipo.siesta);
      await this.lsSvc.setInLocalStorage(
        DormirTipo.siestaEnCurso,
        JSON.stringify(obj)
      );
    }
    if (dormirTipo === DormirTipo.noche) {
      this.objNocheEnCurso = obj;
      this.setObjAlertaDormir(DormirTipo.noche);
      await this.lsSvc.setInLocalStorage(
        DormirTipo.nocheEnCurso,
        JSON.stringify(obj)
      );
    }
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
  private setObjAlertaDormir(dormirTipo: DormirTipo): void {
    const { minutes, hours } = this.calcularTiempoTranscurrido(dormirTipo);
    if (hours >= 3) {
      this.objAlertaDormir = {
        header: 'Alerta',
        mensaje: `Ian lleva dormido ${hours} horas y ${minutes} minutos`,
        tipo: DormirTipoAlerta.peligro,
        diferencia: `${hours} horas, ${minutes} minutos`,
      };
    }
    if (hours >= 2 && hours < 3) {
      this.objAlertaDormir = {
        header: 'Atención',
        mensaje: `Ian lleva dormido ${hours} horas y ${minutes} minutos`,
        tipo: DormirTipoAlerta.alerta,
        diferencia: `${hours} horas, ${minutes} minutos`,
      };
    }
    if (hours < 2) {
      let mensaje: string;
      let diferencia: string;
      if (hours >= 1) {
        mensaje = `Ian lleva dormido ${hours} horas y ${minutes} minutos`;
        diferencia = `${hours} horas, ${minutes} minutos`;
      } else {
        mensaje = `Ian lleva dormido ${minutes} minutos`;
        diferencia = `${minutes} minutos`;
      }
      this.objAlertaDormir = {
        header: 'Información',
        mensaje,
        tipo: DormirTipoAlerta.bien,
        diferencia,
      };
    }
  }
  private calcularTiempoTranscurrido(
    dormirTipo: DormirTipo
  ): DurationObjectUnits {
    let objEnCurso: DormirDetalleModel;
    if (dormirTipo === DormirTipo.siesta) {
      objEnCurso = this.objSiestaEnCurso;
    }
    if (dormirTipo === DormirTipo.noche) {
      objEnCurso = this.objNocheEnCurso;
    }
    const [hInicio, mInicio] = objEnCurso.hora.split(':');
    const [hFinal, mFinal] = this.getHora().split(':');
    const inicio = DateTime.fromObject({
      hour: Number(hInicio),
      minute: Number(mInicio),
    });
    const final = DateTime.fromObject({
      hour: Number(hFinal),
      minute: Number(mFinal),
    });
    const diff = final.diff(inicio, ['minutes', 'hours']);
    return diff.toObject();
  }
  private alertaSiesta(): void {
    this.alertaSvc.handlerMessageAlert({
      message: this.objAlertaDormir.mensaje,
      header: this.objAlertaDormir.header,
    });
  }
}
