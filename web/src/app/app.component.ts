import { Component, OnInit } from '@angular/core';
import {NotificationsService} from './angular2-notifications/simple-notifications.module';
import {Title} from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';


@Component({
  selector: 'my-app',
  template: `
  <div>
      <md-toolbar fxLayout="column" color="primary">
        <span fxFlex="20">
          <a class="title-bar" routerLink="/dashboard">
            <span><md-icon class="logo" color="accent">fingerprint</md-icon></span>
            <span class="title">{{ title }}</span>
          </a>
        </span>
       <span fxFlex="60"></span>
        <span fxFlex="20"><search></search></span>
      </md-toolbar>
      <activity-bar></activity-bar>
    
  <simple-notifications [options]="options"></simple-notifications>
  <router-outlet></router-outlet>
  </div>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _service: NotificationsService,
    private titleService: Title
  ) { }
  title = 'HelmUI';
  public options = {
     position: ["top", "left"],
     timeOut: 5000,
     clickToClose: true,
     lastOnBottom: true,
  };

  ngOnInit() {
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      })
      .filter(route => route.outlet === 'primary')
      .mergeMap(route => route.data)
      .subscribe((event) => {
        this.titleService.setTitle(event['title']);
        this.title = event['title'];
      });
  }

}
