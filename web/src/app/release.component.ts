import { Component, OnInit, Optional, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';

import { Release, STATUSES } from './release';
import { ReleaseService } from './release.service';

import { DialogContentComponent } from './release-controls.component';

@Component({
  selector: 'release',
  templateUrl: './release.component.html',
  styleUrls: [ './release.component.css' ]
})
export class ReleaseComponent implements OnInit {
  @Input() release: Release;
  @Input() releases: Release[];
  showNotes: boolean;
  showHistory: boolean;
  dialogResp: string;
  loading: boolean;
  onRoute: boolean;

  constructor(
    private releaseService: ReleaseService,
    private _dialog: MdDialog,
    private location: Location,
    private route: ActivatedRoute
  ) { }

  initData(name: string): void {
    this.getRelease(name);
    this.getReleaseHistory(name);
  }

  ngOnInit(): void {
    let name = this.route.snapshot.params['name'];
    if (name) {
      this.onRoute = true;
      this.initData(name);
    }
  }

  ngOnChanges() {
    this.initData(this.release.name);
  }

  getRelease(name: string): void {
    this.releaseService.getRelease(name).then(release => this.release = release);
  }
  getReleaseHistory(name: string): void {
    this.releaseService.getReleaseHistory(name)
      .then(releases => {
        this.releases = releases.reverse();
      });
  }

  rollback(name: string, revision: number): void {
    if (!name || !revision) { return; }
    this.releaseService.rollback(name, revision)
      .then(release => {
        console.log(release);
        for (var i = 0; i < this.releases.length; i++) {
          if (this.releases[i].name == release.name) {
            this.releases[i] = release;
          }
        }
      });
  }
  openEditDialog(rel: Release) {
    let configData = rel.config.raw ? rel.config.raw.trim():"";
    const dialogRef = this._dialog.open(DialogContentComponent, {
      data: {'config':configData, 'values':rel.chart.values.raw},
    });
    dialogRef.afterClosed().subscribe(result => {
      this.dialogResp = result;
      if (result) {
        this.toggleLoad();

        this.releaseService.updateValues(rel.name, result)
          .then(release => {
            for (var i = 0; i < this.releases.length; i++) {
              if (this.releases[i].name == release.name) {
                this.releases[i] = release;
              }
            }
          });
      }
    })
  }

 getDiff(name: string, revision: number): void {
    if (!name) { return; }
    this.releaseService.diff(name, revision)
      .then(response => {
        this.openDiffDialog(response.diff);
      });
 }

 openDiffDialog(diff: string) {
   if (!diff) { diff = '<span>No change.</span>';}
    const dialogRef = this._dialog.open(DiffDialogComponent, {
      data: diff,
    });
    dialogRef.afterClosed().subscribe(result => {
      this.dialogResp = result;
    })
  }

  toggleLoad(): void {
    this.loading = this.loading ? false: true; 
  }
  toggleShowHistory(): void {
    this.showHistory = this.showHistory ? false:true;
  }
  toggleShowNotes(): void {
    this.showNotes = this.showNotes ? false:true;
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

  onComponentChange(value: string){
   console.log("I have a values!!!" + value);
   //this.releases = this.releases.filter(rel => rel.name !== value)

  }
  goBack(): void {
    if (this.onRoute) {
      this.location.back();
    }
  }
}

@Component({
  template: `
    <div [innerHTML]="data | safe: 'html'" class="diff-content"></div>
    <button color="accent" md-button (click)="dialogRef.close()">
      <md-icon>cancel</md-icon> cancel
    </button>
  `,
  styles: [`
    .diff-content {
      width: 50em;
      height: 10em;
    }
  `],
})
export class DiffDialogComponent {
  code: string;
  constructor( 
    @Optional() public dialogRef: MdDialogRef<DiffDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any
  ) { }
}
