// Keep the Input import for now, you'll remove it later:
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import { Router }            from '@angular/router';
import {NotificationsService} from './angular2-notifications/simple-notifications.module';
import {Subscription} from "rxjs/Subscription";

import { ActivityBarService } from './activity-bar.service';

import { ChartRepoService } from './chart-repo.service';
import { ChartRepo } from './chart-repo'
import { Chart } from './chart'
import { SearchService } from './search.service';
import 'rxjs/add/operator/switchMap';
import { ReleaseService } from './release.service';


@Component({
  selector: 'chart-repo-detail',
  templateUrl: './chart-repo-detail.component.html',
  styleUrls: [ './chart-repo-detail.component.css' ]
})

export class ChartRepoDetailComponent implements OnInit {

    repo: string;
    charts: Chart[];
    filtered: Chart[] = [];
    searcher: Subscription;
    loading: boolean;

    constructor(
      private chartRepoService: ChartRepoService,
      private route: ActivatedRoute,
      private location: Location,
      private router: Router,
      private _notify: NotificationsService,
      private search: SearchService,
      private activity: ActivityBarService,
      private releaseService: ReleaseService
    ) {
    this.searcher = search.searchSent$.subscribe(
      terms => {
        this.filterCharts(terms);
    });
  }

    ngOnInit(): void {
      this.route.params
        .switchMap((params: Params) => this.chartRepoService.getRepoCharts(params['name']))
        .subscribe(charts => {
          this.charts = charts
          this.filtered = Object.assign([], charts);
        });
      this.repo = this.route.snapshot.params['name'];
    }

    noteSuccess(message: string): void {
       this._notify.success(
         'Success',
         message,
         { }
       );
    }

    filterCharts(value: string): void{
      if(!value) this.filtered = Object.assign([], this.charts);
      this.filtered = Object.assign([], this.charts).filter(
          item => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1
      );
    }

    setLoad(on: boolean): void {
      this.loading = on;
      if (on) {
        this.activity.setActivity("loading");
      } else {
        this.activity.setActivity("done");
      }
    }

    install(name: string, repo: string): void {
      this.setLoad(true);
      this.router.navigate(['/dashboard']);
      this.chartRepoService.install(name, repo)
        .then(release => {
          this.setLoad(false);
          
          this.releaseService.sendRelease(release);
          this.noteSuccess(`${name} installed successfully.`);
        });
    }

    goBack(): void {
      this.location.back();
    }
}