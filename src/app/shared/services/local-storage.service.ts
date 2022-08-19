import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private storageGlobal: Storage | null = null;

  constructor(private readonly storage: Storage) {
    this.initLS();
  }
  async setInLocalStorage(key: string, value: any): Promise<any> {
    await this.storageGlobal.set(key, value);
  }
  async getFromLocalStorage(key: string): Promise<any> {
    return await this.storageGlobal.get(key);
  }
  async removeFromLocalStorage(key: string): Promise<any> {
    await this.storageGlobal.remove(key);
  }
  private async initLS(): Promise<void> {
    const storage = await this.storage.create();
    this.storageGlobal = storage;
  }
}
