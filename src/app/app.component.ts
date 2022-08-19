import { Component } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform, private sqlite: SQLite) {
    this.platform.ready().then(() => {
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
    });
  }
}
