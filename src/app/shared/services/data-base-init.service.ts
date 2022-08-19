import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class DataBaseInit {
  constructor(private platform: Platform, private sqlite: SQLite) {
    this.platform.ready().then(() => {
      this.initDB();
    });
  }
  private initDB(): void {
    this.sqlite
      .create({
        name: 'data.db',
        location: 'default',
      })
      .then((db: SQLiteObject) => {
        db.executeSql('create table danceMoves(name VARCHAR(32))', [])
          .then(() => console.log('Executed SQL'))
          .catch((e) => console.log(e));
      })
      .catch((e) => console.log(e));
  }
}
