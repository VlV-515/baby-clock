/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DateTime } from 'luxon';
import {
  ALMACENAMIENTO_LECHE,
  BancoLecheRegistro,
} from '../interfaces/banco-leche.interface';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { AlertasService } from 'src/app/shared/services/alertas.service';

@Component({
  selector: 'app-detalle-leche',
  templateUrl: './detalle-leche.page.html',
  styleUrls: ['./detalle-leche.page.scss'],
})
export class DetalleLechePage implements OnInit {
  registro: BancoLecheRegistro | null = null;
  tiempoRestante = '';
  estaVencido = false;

  //* Lifecycle
  constructor(
    private readonly router: Router,
    private readonly alertController: AlertController,
    private readonly lsSvc: LocalStorageService,
    private readonly alertasSvc: AlertasService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.registro = navigation.extras.state.registro;
    }
  }

  ngOnInit() {
    if (this.registro) {
      this.calcularTiempoRestante();
    }
  }

  getTipoTexto(): string {
    switch (this.registro?.tipo) {
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

  getTemperatura(): string {
    switch (this.registro?.tipo) {
      case 'ambiente':
        return '≤ 25°C';
      case 'refrigerador':
        return '≤ 4°C';
      case 'congelador':
        return '−18°C';
      default:
        return '';
    }
  }

  async utilizarLeche(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Utilizar Leche',
      message: `¿Deseas utilizar la leche con folio ${this.registro?.folio}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Utilizar',
          handler: async () => {
            await this.actualizarStatus('usado');
            this.router.navigate(['/banco-leche']);
          },
        },
      ],
    });

    await alert.present();
  }

  async eliminarLeche(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Eliminar Registro',
      message: `¿Estás seguro de que deseas eliminar el registro ${this.registro?.folio}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.actualizarStatus('eliminado');
            this.router.navigate(['/banco-leche']);
          },
        },
      ],
    });

    await alert.present();
  }

  async cambiarTipoAlmacenamiento(): Promise<void> {
    if (!this.registro) {
      return;
    }

    // Validar que no esté en congelador (último nivel)
    if (this.registro.tipo === 'congelador') {
      this.alertasSvc.handlerToastMessagesAlert({
        message: 'La leche en congelador no puede cambiar de tipo',
        color: 'warning',
      });
      return;
    }

    // Validar que no esté vencido
    if (this.estaVencido) {
      this.alertasSvc.handlerToastMessagesAlert({
        message:
          'No se puede cambiar el tipo de almacenamiento de leche vencida',
        color: 'danger',
      });
      return;
    }

    // Validar que esté disponible
    if (this.registro.status !== 'disponible') {
      this.alertasSvc.handlerToastMessagesAlert({
        message: 'Solo se puede cambiar el tipo de leche disponible',
        color: 'warning',
      });
      return;
    }

    // Crear opciones de radio según el tipo actual
    const opcionesRadio: any[] = [];

    if (this.registro.tipo === 'ambiente') {
      opcionesRadio.push(
        {
          label: 'Refrigerador (≤ 4°C - 4 días)',
          type: 'radio',
          value: 'refrigerador',
        },
        {
          label: 'Congelador (−18°C - 6 meses)',
          type: 'radio',
          value: 'congelador',
        }
      );
    } else if (this.registro.tipo === 'refrigerador') {
      opcionesRadio.push({
        label: 'Congelador (−18°C - 6 meses)',
        type: 'radio',
        value: 'congelador',
      });
    }

    const alert = await this.alertController.create({
      backdropDismiss: false,
      mode: 'ios',
      header: 'Cambiar tipo de almacenamiento',
      subHeader: `Actual: ${this.getTipoTexto()}`,
      inputs: opcionesRadio,
      buttons: [
        {
          text: 'Cancelar',
          role: 'destructive',
        },
        {
          text: 'Cambiar',
          handler: async (nuevoTipo) => {
            if (!nuevoTipo) {
              this.alertasSvc.handlerToastMessagesAlert({
                message: 'Debes seleccionar un tipo',
                color: 'warning',
              });
              return false;
            }

            await this.cambiarTipo(nuevoTipo);
            this.alertasSvc.handlerToastMessagesAlert({
              message: `Cambiado a ${this.getTipoTextoFromString(nuevoTipo)}`,
              color: 'success',
            });
            this.router.navigate(['/banco-leche']);
            return true;
          },
        },
      ],
    });

    await alert.present();
  }

  getTipoTextoFromString(tipo: string): string {
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
  private async actualizarStatus(
    nuevoStatus: 'disponible' | 'usado' | 'eliminado' | 'expirado'
  ): Promise<void> {
    if (!this.registro) {
      return;
    }

    const res = await this.lsSvc.getFromLocalStorage(this.registro.tipo);
    const registros: BancoLecheRegistro[] = res ? JSON.parse(res) : [];

    const index = registros.findIndex((r) => r.id === this.registro.id);
    if (index !== -1) {
      registros[index].status = nuevoStatus;
      await this.lsSvc.setInLocalStorage(
        this.registro.tipo,
        JSON.stringify(registros)
      );
    }
  }

  private async cambiarTipo(
    nuevoTipo: 'ambiente' | 'refrigerador' | 'congelador'
  ): Promise<void> {
    if (!this.registro) {
      return;
    }

    // 1. Calcular el tiempo restante en el almacenamiento actual
    const ahora = DateTime.now();
    const vencimiento = DateTime.fromISO(
      `${this.registro.fechaVencimiento}T${this.registro.horaVencimiento}`
    );
    const horasRestantes = vencimiento.diff(ahora, 'hours').hours;

    // 2. Obtener la duración del nuevo tipo de almacenamiento
    const tipoAlmacenamiento = ALMACENAMIENTO_LECHE.find(
      (t) => t.tipo === nuevoTipo
    );
    if (!tipoAlmacenamiento) {
      return;
    }

    // 3. Sumar las horas restantes a la nueva duración
    const nuevaDuracionTotal =
      tipoAlmacenamiento.duracionHoras + horasRestantes;

    // 4. Calcular nueva fecha y hora de vencimiento
    const nuevoVencimiento = ahora.plus({ hours: nuevaDuracionTotal });

    // 5. Eliminar el registro del almacenamiento antiguo
    const resAntiguo = await this.lsSvc.getFromLocalStorage(this.registro.tipo);
    const registrosAntiguos: BancoLecheRegistro[] = resAntiguo
      ? JSON.parse(resAntiguo)
      : [];
    const registrosFiltrados = registrosAntiguos.filter(
      (r) => r.id !== this.registro.id
    );
    await this.lsSvc.setInLocalStorage(
      this.registro.tipo,
      JSON.stringify(registrosFiltrados)
    );

    // 6. Crear el nuevo registro con el nuevo tipo
    const nuevoRegistro: BancoLecheRegistro = {
      ...this.registro,
      tipo: nuevoTipo,
      duracionHoras: nuevaDuracionTotal,
      fechaVencimiento: nuevoVencimiento.toISODate()!,
      horaVencimiento: nuevoVencimiento.toFormat('HH:mm'),
    };

    // 7. Guardar en el nuevo almacenamiento
    const resNuevo = await this.lsSvc.getFromLocalStorage(nuevoTipo);
    const registrosNuevos: BancoLecheRegistro[] = resNuevo
      ? JSON.parse(resNuevo)
      : [];
    registrosNuevos.unshift(nuevoRegistro);
    await this.lsSvc.setInLocalStorage(
      nuevoTipo,
      JSON.stringify(registrosNuevos)
    );
  }

  private calcularTiempoRestante(): void {
    const ahora = DateTime.now();
    const vencimiento = DateTime.fromISO(
      `${this.registro.fechaVencimiento}T${this.registro.horaVencimiento}`
    );

    if (ahora > vencimiento) {
      this.estaVencido = true;
      this.tiempoRestante = 'VENCIDO';
      return;
    }

    const diff = vencimiento.diff(ahora, ['days', 'hours', 'minutes']);
    const dias = Math.floor(diff.days);
    const horas = Math.floor(diff.hours);
    const minutos = Math.floor(diff.minutes);

    if (dias > 0) {
      this.tiempoRestante = `${dias} día${dias > 1 ? 's' : ''} ${horas} hora${
        horas !== 1 ? 's' : ''
      }`;
    } else if (horas > 0) {
      this.tiempoRestante = `${horas} hora${
        horas !== 1 ? 's' : ''
      } ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
    } else {
      this.tiempoRestante = `${minutos} minuto${minutos !== 1 ? 's' : ''}`;
    }
  }
}
