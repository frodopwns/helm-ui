import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


import { ChartRepo } from './chart-repo';

import { ChartRepoService } from './chart-repo.service';

@Component({
  selector: 'chart-repos',
  templateUrl: './chart-repos.component.html',
  styleUrls: [ './chart-repos.component.css' ]
})
export class ChartReposComponent implements OnInit {

  repos: ChartRepo[];
  selectedRepo: ChartRepo;

  constructor(
    private chartRepoService: ChartRepoService,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.chartRepoService.getRepos()
      .then(repos => this.repos = repos);
  }

  onSelect(chartRepo: ChartRepo): void {
    this.selectedRepo = chartRepo;
  }

  gotoDetail(chartRepo: ChartRepo): void {
    this.router.navigate(['/chart-repos/detail', chartRepo.name]);
  }

  goBack(): void {
    this.location.back();
  }

  add(name: string, url: string): void {
    name = name.trim();
    if (!name) { return; }
    this.chartRepoService.create(name, url)
      .then(repo => {
        if (!this.repos) this.repos = [];
        this.repos.push(repo);
      });
  }

  delete(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.chartRepoService.delete(name)
      .then(repo => {
        this.repos = this.repos.filter(rep => rep.name !== name)
      });
  }

}
