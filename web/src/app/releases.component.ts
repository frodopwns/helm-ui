import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Title }     from '@angular/platform-browser';
import {Subscription} from "rxjs/Subscription";
import {MediaChange, ObservableMedia} from "@angular/flex-layout";

import { Release, STATUSES } from './release';
import { ReleaseService } from './release.service';

import { SearchService } from './search.service';

@Component({
  selector: 'my-releases',
  templateUrl: './releases.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [ './releases.component.css' ]
})
export class ReleasesComponent implements OnInit {
  @Input() title: string;
  releases: Release[];
  filtered: Release[] = [];
  selectedRelease: Release;
  watcher: Subscription;
  searcher: Subscription;
  relWatch: Subscription;
  activeMediaQuery: string = "";
  extraSmall: boolean;
  showListPane: boolean = true;
  showRelPane: boolean;

  constructor(
    private releaseService: ReleaseService,
    media: ObservableMedia,
    private router: Router,
    private titleService: Title,
    private search: SearchService
  ) {
    this.watcher = media.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : "";
      if ( change.mqAlias == 'xs') {
         this.extraSmall = true;
      } else {
          this.extraSmall = false;
          this.showRelPane = true;
      }
    });

    this.searcher = search.searchSent$.subscribe(
      terms => {
        this.filterReleases(terms);
    });

    this.relWatch = releaseService.releaseSent$.subscribe(
      rel => {
        let found = false;
        for (var i=0; i < this.releases.length; i++) {
          if (this.releases[i].name == rel.name) {
            found = true;
            this.releases[i] = rel
          }
        }
        if (!found) {
          this.releases.push(rel);
          this.filtered = Object.assign([], this.releases);
        }
    });
  }

  ngOnDestroy() {
    this.watcher.unsubscribe();
    this.searcher.unsubscribe();
  }

  getReleases(): void {
    this.releaseService.getReleases().then(
        releases => {
            this.releases = releases;
            this.selectedRelease = releases[0];
            this.filtered = Object.assign([], releases);
        }
    );
  }

  ngOnInit(): void {
    this.getReleases();
    if (!this.extraSmall) {
      this.showRelPane = true;
    }
    this.titleService.setTitle("I am the title");
  }

  filterReleases(value: string): void{
    if(!value) this.filtered = Object.assign([], this.releases);
    this.filtered = Object.assign([], this.releases).filter(
        item => (item.name.toLowerCase().indexOf(value.toLowerCase()) > -1 || 
            item.chart.metadata.name.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
            item.namespace.toLowerCase().indexOf(value.toLowerCase()) > -1)
    );
  }

  statusColor(status: number): string {
    switch (STATUSES[status]) {
        case 'UNKNOWN': // Error: Fallthrough case in switch.
            return 'grey';
        case 'DEPLOYED':
            return 'green';
        case 'DELETED':
            return 'black';
        case 'SUPERSEDED':
            return 'grey';
        case 'FAILED':
            return 'red';
        case 'UNKNOWN':
            return 'grey';
        case 'DELETING':
            return 'grey';
        default:
            return 'grey';
    }
  }

  onSelect(release: Release): void {
    this.selectedRelease = release;
    if (this.extraSmall) {
      this.showListPane = false;
      this.showRelPane = true;
      this.extraSmall = false;
      //this.router.navigate(['/release', release.name]);
    }
  }
  
  showReleasePane(): boolean {
    if (!this.showListPane) { 
      return false;
    }
    return this.extraSmall;
  }

  listPaneSize(): number {
    if (this.showListPane) {
      return 50;
    }
    return 0;
  }

  goBack(): void {
    this.showRelPane = false;
    this.showListPane = true;
    this.extraSmall = true;
  }

  onDeleteEvent(value: string){
   this.releases = this.releases.filter(rel => rel.name !== value)
   if (this.selectedRelease.name == value) {
     this.selectedRelease = this.releases[0];
   }
   this.filtered = Object.assign([], this.releases)
  }

  onEditEvent(rel: Release) {
    for (var i = 0; i < this.releases.length; i++) {
      if (this.releases[i].name == rel.name) {
        this.releases[i] = rel;
      }
    }
    this.filtered = Object.assign([], this.releases)

    if (this.selectedRelease.name == rel.name) {
      this.selectedRelease = rel;
    }
  }

}

