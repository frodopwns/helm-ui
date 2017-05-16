import { Component } from '@angular/core';
import {NotificationsService} from './libs/angular2-notifications/simple-notifications.module';

@Component({
  selector: 'my-app',
  template: `
  <div class="title-bar">
    <a routerLink="/dashboard">
      <md-toolbar color="primary">
        <md-icon class="logo" color="accent">fingerprint</md-icon>
        <span class="title">{{title}}</span>
      </md-toolbar>
    </a>
  </div>
  <simple-notifications [options]="options"></simple-notifications>
  <router-outlet></router-outlet>

  <button (click)="create()">Create</button>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor( private _service: NotificationsService ) {}
  title = 'HelmUI';
  public options = {
        position: ["top", "left"],
        timeOut: 2000,
        clickToClose: true,
        lastOnBottom: true,
  };
  create() {
        this._service.success(
            'Some Title',
            'Some Content',
            {
                timeOut: 5000,
            }
        )
  }
}
