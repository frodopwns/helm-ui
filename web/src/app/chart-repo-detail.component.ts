// Keep the Input import for now, you'll remove it later:
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import { Router }            from '@angular/router';

import {NotificationsService} from './libs/angular2-notifications/simple-notifications.module';

import { ChartRepoService } from './chart-repo.service';
import { ChartRepo } from './chart-repo'
import { Chart } from './chart'

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'chart-repo-detail',
  templateUrl: './chart-repo-detail.component.html',
  styleUrls: [ './chart-repo-detail.component.css' ]
})

export class ChartRepoDetailComponent implements OnInit {

    repo: string;
    charts: Chart[];
    filtered: Chart[] = [];

    constructor(
      private chartRepoService: ChartRepoService,
      private route: ActivatedRoute,
      private location: Location,
      private router: Router,
      private _notify: NotificationsService
    ) {}

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

    toggleLoad(chart: Chart): void {
      chart.loading = chart.loading ? false : true;
    }

    install(name: string, repo: string): void {
      this.chartRepoService.install(name, repo)
        .then(release => {
          this.router.navigate(['/dashboard']);
          this.noteSuccess(`${name} installed successfully.`);
        });
    }

    goBack(): void {
      this.location.back();
    }
}