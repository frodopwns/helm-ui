import { Component, OnInit } from '@angular/core';

import { Release, STATUSES } from './release';
import { ReleaseService } from './release.service';

@Component({
  selector: 'my-releases',
  templateUrl: './releases.component.html',
  styleUrls: [ './releases.component.css' ]
})
export class ReleasesComponent implements OnInit {
  releases: Release[];
  selectedRelease: Release;

  constructor(
    private releaseService: ReleaseService
  ) { }

  getReleases(): void {
    this.releaseService.getReleases().then(releases => this.releases = releases);
  }

  ngOnInit(): void {
    this.getReleases();
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
  }
  onComponentChange(value: string){
   console.log("I have a values!!!" + value);
   this.releases = this.releases.filter(rel => rel.name !== value)

  }

}

