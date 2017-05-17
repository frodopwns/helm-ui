import { Component, OnInit, Optional, Inject, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import {Subscription} from "rxjs/Subscription";
import {MediaChange, ObservableMedia} from "@angular/flex-layout";

import { Release, STATUSES } from './release';
import { ReleaseService } from './release.service';

@Component({
  selector: 'my-releases',
  templateUrl: './releases.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [ './releases.component.css' ]
})
export class ReleasesComponent implements OnInit {
  releases: Release[];
  selectedRelease: Release;
  watcher: Subscription;
  activeMediaQuery: string = "";
  extraSmall: boolean;
  showListPane: boolean = true;
  showRelPane: boolean;

  constructor(
    private releaseService: ReleaseService,
    media: ObservableMedia,
    private router: Router
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
  }


  ngOnDestroy() {
    this.watcher.unsubscribe();
  }

  loadMobileContent() { 
    // Do something special since the viewport is currently
    // using mobile display sizes
    console.log("THIS SHIT IS MOBILE");
  }

  getReleases(): void {
    this.releaseService.getReleases().then(
        releases => {
            this.releases = releases;
            this.selectedRelease = releases[0];
        }
    );
  }

  ngOnInit(): void {
    this.getReleases();
    if (!this.extraSmall) {
      this.showRelPane = true;
    }
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
      console.log("selected small yo")
      this.showListPane = false;
      this.showRelPane = true;
      this.extraSmall = false;
      //this.router.navigate(['/release', release.name]);
    }
  }
  showReleasePane(): boolean {
      return this.extraSmall;
  }
  listPaneSize(): number {
    if (this.showListPane) {
      return 70;
    }
    return 0;
  }
  goBack(): void {
    this.showRelPane = false;
    this.showListPane = true;
    this.extraSmall = true;
  }
  onComponentChange(value: string){
   console.log("I have a values!!!" + value);
   this.releases = this.releases.filter(rel => rel.name !== value)

  }

}

