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
  public async handlerMessages({ message, icon, color }): Promise<void> {
    const toast = await this.toastController.create({
      header: 'Información',
      position: 'bottom',
      duration: 1500,
      mode: 'ios',
      message,
      icon,
      color,
    });

    await toast.present();
  }
  public async handlerConfirm({ message = '' }): Promise<boolean> {
    const alert = await this.alertController.create({
      header: 'Confirmacion!',
      message,
      mode: 'ios',
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
}
