import { Component, ViewChild } from '@angular/core';
import { AlertController, IonList } from '@ionic/angular';
import { Router } from '@angular/router';
import { DateTime } from 'luxon';
import {
  ALMACENAMIENTO_LECHE,
  AlmacenamientoLecheModel,
  BancoLecheRegistro,
} from './interfaces/banco-leche.interface';
import { AlertasService } from 'src/app/shared/services/alertas.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-banco-leche',
  templateUrl: './banco-leche.page.html',
  styleUrls: ['./banco-leche.page.scss'],
})
export class BancoLechePage {
  @ViewChild(IonList) ionList: IonList;
  optTipoAlmacenamiento: string[] = ['ambiente', 'refrigerador', 'congelador'];

  arrAmbiente: BancoLecheRegistro[] = [];
  arrRefrigerador: BancoLecheRegistro[] = [];
  arrCongelador: BancoLecheRegistro[] = [];

  arrDisponibles: BancoLecheRegistro[] = [];
  arrUsados: BancoLecheRegistro[] = [];
  arrExpirados: BancoLecheRegistro[] = [];

  vistaActual: 'status' | 'tipo' = 'status';

  constructor(
    private readonly alertController: AlertController,
    private readonly lsSvc: LocalStorageService,
    private readonly alertasSvc: AlertasService,
    private readonly router: Router
  ) {}

  ionViewWillEnter() {
    this.getInfoGeneral();
  }

  //* Public Methods
  btnAddBancoLeche() {
    this.seleccionarTipo();
  }

  cambiarVista(): void {
    this.vistaActual = this.vistaActual === 'status' ? 'tipo' : 'status';
  }

  async marcarComoUsado(registro: BancoLecheRegistro): Promise<void> {
    this.ionList.closeSlidingItems();
    await this.actualizarStatus(registro, 'usado');
    this.alertasSvc.handlerToastMessagesAlert({
      message: 'Marcado como usado',
      color: 'success',
    });
    this.getInfoGeneral();
  }

  async btnDeleteRegistro(registro: BancoLecheRegistro): Promise<void> {
    this.ionList.closeSlidingItems();
    const estaSeguro = await this.alertasSvc.handlerConfirmAlert({
      message: '¿Seguro que desea eliminarlo?',
    });
    if (estaSeguro) {
      await this.actualizarStatus(registro, 'eliminado');
      this.alertasSvc.handlerToastMessagesAlert({
        message: 'Eliminado',
        color: 'danger',
      });
      this.getInfoGeneral();
    }
  }

  verDetalle(registro: BancoLecheRegistro): void {
    this.router.navigate(['/banco-leche/detalle-leche'], {
      state: { registro },
    });
  }

  estaVencido(registro: BancoLecheRegistro): boolean {
    const ahora = DateTime.now();
    const vencimiento = DateTime.fromISO(
      `${registro.fechaVencimiento}T${registro.horaVencimiento}`
    );
    return ahora > vencimiento;
  }

  getTipoTexto(tipo: string): string {
    switch (tipo) {
      case 'ambiente':
        return 'Ambiente';
      case 'refrigerador':
        return 'Refrigerador';
      case 'congelador':
        return 'Congelador';
      default:
        return '';
    }
  }

  //* Private Methods
  private async getInfoGeneral(): Promise<void> {
    await this.getInfoAmbiente();
    await this.getInfoRefrigerador();
    await this.getInfoCongelador();
    this.organizarPorStatus();
  }

  private async getInfoAmbiente(): Promise<void> {
    const res = await this.lsSvc.getFromLocalStorage(
      this.optTipoAlmacenamiento[0]
    );
    const arr = res ? JSON.parse(res) : [];
    this.arrAmbiente = arr.filter(
      (r: BancoLecheRegistro) => r.status !== 'eliminado'
    );
  }

  private async getInfoRefrigerador(): Promise<void> {
    const res = await this.lsSvc.getFromLocalStorage(
      this.optTipoAlmacenamiento[1]
    );
    const arr = res ? JSON.parse(res) : [];
    this.arrRefrigerador = arr.filter(
      (r: BancoLecheRegistro) => r.status !== 'eliminado'
    );
  }

  private async getInfoCongelador(): Promise<void> {
    const res = await this.lsSvc.getFromLocalStorage(
      this.optTipoAlmacenamiento[2]
    );
    const arr = res ? JSON.parse(res) : [];
    this.arrCongelador = arr.filter(
      (r: BancoLecheRegistro) => r.status !== 'eliminado'
    );
  }

  private organizarPorStatus(): void {
    const todosLosRegistros = [
      ...this.arrAmbiente,
      ...this.arrRefrigerador,
      ...this.arrCongelador,
    ];

    this.arrDisponibles = todosLosRegistros
      .filter((r) => r.status === 'disponible' && !this.estaVencido(r))
      .sort((a, b) => {
        const dateA = new Date(`${a.fechaVencimiento}T${a.horaVencimiento}`);
        const dateB = new Date(`${b.fechaVencimiento}T${b.horaVencimiento}`);
        return dateA.getTime() - dateB.getTime();
      });
    this.arrUsados = todosLosRegistros.filter((r) => r.status === 'usado');
    this.arrExpirados = todosLosRegistros.filter(
      (r) => r.status === 'disponible' && this.estaVencido(r)
    );
  }

  private async actualizarStatus(
    registro: BancoLecheRegistro,
    nuevoStatus: 'disponible' | 'usado' | 'eliminado' | 'expirado'
  ): Promise<void> {
    const res = await this.lsSvc.getFromLocalStorage(registro.tipo);
    const registros: BancoLecheRegistro[] = res ? JSON.parse(res) : [];

    const index = registros.findIndex((r) => r.id === registro.id);
    if (index !== -1) {
      registros[index].status = nuevoStatus;
      await this.lsSvc.setInLocalStorage(
        registro.tipo,
        JSON.stringify(registros)
      );
    }
  }

  private async generarSiguienteFolio(): Promise<string> {
    const todosLosRegistros: BancoLecheRegistro[] = [];

    for (const tipo of this.optTipoAlmacenamiento) {
      const res = await this.lsSvc.getFromLocalStorage(tipo);
      if (res) {
        const registros: BancoLecheRegistro[] = JSON.parse(res);
        todosLosRegistros.push(...registros);
      }
    }

    if (todosLosRegistros.length === 0) {
      return 'BL-001';
    }

    // Extraer todos los números de los folios que siguen el formato BL-XXX
    const numeros = todosLosRegistros
      .map((r) => {
        const match = r.folio.match(/^BL-(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((num) => num > 0);

    if (numeros.length === 0) {
      return 'BL-001';
    }

    const maxNumero = Math.max(...numeros);
    const siguienteNumero = maxNumero + 1;
    return `BL-${siguienteNumero.toString().padStart(3, '0')}`;
  }

  private async seleccionarTipo() {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      mode: 'ios',
      header: 'Selecciona un tipo',
      inputs: [
        {
          label: 'Ambiente (≤ 25°C - 4 horas)',
          type: 'radio',
          value: ALMACENAMIENTO_LECHE[0],
        },
        {
          label: 'Refrigerador (≤ 4°C - 4 días)',
          type: 'radio',
          value: ALMACENAMIENTO_LECHE[1],
        },
        {
          label: 'Congelador (−18°C - 6 meses)',
          type: 'radio',
          value: ALMACENAMIENTO_LECHE[2],
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'destructive',
        },
        {
          text: 'Siguiente',
          handler: (res) => this.capturarDatos(res),
        },
      ],
    });
    await alert.present();
  }

  private async capturarDatos(tipo: AlmacenamientoLecheModel) {
    const today = DateTime.now();
    const time = today.toFormat('HH:mm');
    const fecha = today.toISODate();
    const siguienteFolio = await this.generarSiguienteFolio();

    const alert = await this.alertController.create({
      backdropDismiss: false,
      mode: 'ios',
      header: 'Datos del registro',
      subHeader: tipo.descripcion,
      inputs: [
        {
          name: 'folio',
          type: 'text',
          placeholder: 'Folio (ej: BL-001)',
          value: siguienteFolio,
          disabled: true,
        },
        {
          name: 'fecha',
          type: 'date',
          value: fecha,
          label: 'Fecha de extracción',
        },
        {
          name: 'hora',
          type: 'time',
          value: time,
          label: 'Hora de extracción',
        },
        {
          name: 'descripcion',
          type: 'textarea',
          placeholder: 'Descripción (opcional)',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'destructive',
        },
        {
          text: 'Guardar',
          handler: async (data) => {
            if (!data.folio || data.folio.trim() === '') {
              this.alertasSvc.handlerToastMessagesAlert({
                message: 'El folio es requerido',
                color: 'danger',
              });
              return false;
            }

            this.guardarBancoLeche(tipo, data);
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  private guardarBancoLeche(
    tipo: AlmacenamientoLecheModel,
    data: { folio: string; fecha: string; hora: string; descripcion: string }
  ) {
    if (tipo.tipo === this.optTipoAlmacenamiento[0]) {
      this.saveLSBancoLeche(tipo, data, this.arrAmbiente);
      return;
    }
    if (tipo.tipo === this.optTipoAlmacenamiento[1]) {
      this.saveLSBancoLeche(tipo, data, this.arrRefrigerador);
      return;
    }
    if (tipo.tipo === this.optTipoAlmacenamiento[2]) {
      this.saveLSBancoLeche(tipo, data, this.arrCongelador);
    }
  }

  private async saveLSBancoLeche(
    tipo: AlmacenamientoLecheModel,
    data: { folio: string; fecha: string; hora: string; descripcion: string },
    arrayRegistros: BancoLecheRegistro[]
  ): Promise<void> {
    const fechaHoraRegistro = DateTime.fromISO(`${data.fecha}T${data.hora}`);
    const fechaVencimiento = fechaHoraRegistro.plus({
      hours: tipo.duracionHoras,
    });

    const nuevoRegistro: BancoLecheRegistro = {
      id: Date.now().toString(),
      folio: data.folio.toUpperCase(),
      tipo: tipo.tipo,
      status: 'disponible',
      horaRegistro: data.hora,
      fechaRegistro: data.fecha,
      fechaVencimiento: fechaVencimiento.toISODate(),
      horaVencimiento: fechaVencimiento.toFormat('HH:mm'),
      duracionHoras: tipo.duracionHoras,
      descripcion: data.descripcion || '',
    };

    await this.lsSvc.setInLocalStorage(
      tipo.tipo,
      JSON.stringify([nuevoRegistro, ...arrayRegistros])
    );
    this.alertasSvc.handlerToastMessagesAlert({
      message: 'Guardado',
      color: 'success',
    });
    this.getInfoGeneral();
  }
}
