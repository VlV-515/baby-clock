import { AlertController, ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AlertasService {
  constructor(
    private readonly alertController: AlertController,
    private readonly toastController: ToastController
  ) {}
  public async handlerMessages({ message, color }): Promise<void> {
    let icon: string;
    if (color === 'success') {
      icon = 'checkmark-circle-outline';
    } else if (color === 'danger') {
      icon = 'trash-outline';
    }

    const toast = await this.toastController.create({
      header: '¡Información!',
      position: 'bottom',
      duration: 1500,
      mode: 'ios',
      message,
      icon,
      color,
    });

    await toast.present();
  }
  public async handlerConfirmAlert({
    message,
    btnCancelar = true,
  }): Promise<boolean> {
    let header = 'Información';
    const buttons = [];

    if (btnCancelar) {
      header = 'Confirmación';
      buttons.push({
        text: 'Cancelar',
        role: 'destructive',
      });
    }

    buttons.push({
      text: 'OK',
      role: 'confirm',
    });

    const alert = await this.alertController.create({
      mode: 'ios',
      header,
      message,
      buttons,
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();
    return role === 'confirm';
  }
}
