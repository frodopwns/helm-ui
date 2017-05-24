import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs/Subscription";

import { ActivityBarService } from './activity-bar.service';

@Component({
  selector: 'activity-bar',
  template: `
    <md-progress-bar
        class="activity-bar"
        [color]="color"
        [mode]="mode"
        value="100">
    </md-progress-bar>
  `,
  styleUrls: ['./app.component.css'],
})
export class ActivityBarComponent implements OnInit {
  color: string = 'primary';
  mode: string = 'determinate';
  colorWatcher: Subscription;
  activityWatcher: Subscription;

  constructor(private activity: ActivityBarService) {
    this.colorWatcher = activity.colorSet$.subscribe(
      color => {
        this.color = color;
    });
    this.activityWatcher = activity.activitySet$.subscribe(
      activity => {
        if (activity == "loading") {
          this.mode = "indeterminate";
        } else {
          this.mode = "determinate";
        }
    });
  }

  ngOnInit() {
    console.log("search component init");
  }

  send(terms: string): void {
    console.log("sending");
    //this.search.sendTerm(terms);
  }
}
