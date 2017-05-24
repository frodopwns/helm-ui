import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import {Subscription} from "rxjs/Subscription";

import { ChartRepo } from './chart-repo';
import { ChartRepoService } from './chart-repo.service';
import { SearchService } from './search.service';

@Component({
  selector: 'chart-repos',
  templateUrl: './chart-repos.component.html',
  styleUrls: [ './chart-repos.component.css' ]
})
export class ChartReposComponent implements OnInit {

  repos: ChartRepo[];
  filtered: ChartRepo[] = [];
  selectedRepo: ChartRepo;
  searcher: Subscription;

  constructor(
    private chartRepoService: ChartRepoService,
    private router: Router,
    private location: Location,
    private search: SearchService
  ) {
    this.searcher = search.searchSent$.subscribe(
      terms => {
        this.filterRepos(terms);
    });
  }

  ngOnInit(): void {
    this.chartRepoService.getRepos()
      .then(repos => {
        this.repos = repos;
        this.filtered = Object.assign([], repos);
      });
  }
  ngOnDestroy() {
    this.searcher.unsubscribe();
  }
  onSelect(chartRepo: ChartRepo): void {
    this.selectedRepo = chartRepo;
  }

  gotoDetail(chartRepo: ChartRepo): void {
    this.router.navigate(['/chart-repos/detail', chartRepo.name]);
  }
  filterRepos(value: string): void{
    if(!value) this.filtered = Object.assign([], this.repos);
    this.filtered = Object.assign([], this.repos).filter(
        item => (item.name.toLowerCase().indexOf(value.toLowerCase()) > -1 || 
            item.url.toLowerCase().indexOf(value.toLowerCase()) > -1)
    );
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
        this.filtered = Object.assign([], this.repos);
      });
  }

  delete(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.chartRepoService.delete(name)
      .then(repo => {
        this.repos = this.repos.filter(rep => rep.name !== name)
        this.filtered = Object.assign([], this.repos);
      });
  }

}
