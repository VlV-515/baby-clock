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
  public async handlerToastMessagesAlert({ message, color }): Promise<void> {
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
  public async handlerConfirmAlert({ message }): Promise<boolean> {
    const alert = await this.alertController.create({
      mode: 'ios',
      header: 'Confirmación',
      message,
      buttons: [
        {
          text: 'Cancelar',
          role: 'destructive',
        },
        {
          text: 'OK',
          role: 'confirm',
        },
      ],
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();
    return role === 'confirm';
  }
  public async handlerMessageAlert({
    message,
    header = 'Información',
  }): Promise<void> {
    const alert = await this.alertController.create({
      mode: 'ios',
      header,
      message,
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
        },
      ],
    });

    await alert.present();
  }
}
