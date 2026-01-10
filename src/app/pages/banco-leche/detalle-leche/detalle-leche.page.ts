import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DateTime } from 'luxon';
import { BancoLecheRegistro } from '../interfaces/banco-leche.interface';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

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
    private readonly lsSvc: LocalStorageService
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
