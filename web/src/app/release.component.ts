import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MdDialog } from '@angular/material';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import { Router } from '@angular/router';

import { Release, STATUSES } from './release';
import { ReleaseService } from './release.service';

import { AceDialogComponent } from './ace-dialog.component';
import { DiffDialogComponent } from './diff-dialog.component';
import { ActivityBarService } from './activity-bar.service';

@Component({
  selector: 'release',
  templateUrl: './release.component.html',
  styleUrls: [ './release.component.css' ]
})
export class ReleaseComponent implements OnInit {
  @Input() release: Release;
  @Input() releases: Release[];
  @Output() editEvent:EventEmitter<Release>=new EventEmitter();
  @Output() deleteEvent:EventEmitter<string>=new EventEmitter();

  showNotes: boolean;
  showHistory: boolean;
  dialogResp: string;
  loading: boolean;
  onRoute: boolean;

  constructor(
    private releaseService: ReleaseService,
    private _dialog: MdDialog,
    private location: Location,
    private route: ActivatedRoute,
    private activity: ActivityBarService,
    private router: Router
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
    this.setLoad(true);
    this.releaseService.rollback(name, revision)
      .then(release => {
        this.release = release;
        this.setLoad(false);
        this.editEvent.emit(release);
      });
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

  setLoad(on: boolean): void {
    this.loading = on;
    if (on) {
      this.activity.setActivity("loading");
    } else {
      this.activity.setActivity("done");
    }
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

  onChange(value: Release){
    this.release = value;
    if (this.onRoute) {
      this.getReleaseHistory(value.name);
    } else {
      this.editEvent.emit(value);
    }
  }
  onDelete(value: string){
    if (this.onRoute) {
      this.router.navigate(['/dashboard']);
    } else {
      this.deleteEvent.emit(value);
    }
  }
  goBack(): void {
    if (this.onRoute) {
      this.location.back();
    }
  }
}
