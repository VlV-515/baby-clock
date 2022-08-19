import { Component } from '@angular/core';
import { DataBaseInit } from './shared/services/data-base-init.service';
import { LocalStorageService } from './shared/services/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private readonly dataBaseInitSvc: DataBaseInit,
    private readonly localStorageSvc: LocalStorageService
  ) {}
}
