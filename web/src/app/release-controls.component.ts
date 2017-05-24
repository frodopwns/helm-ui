import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MdDialog } from '@angular/material';
import {NotificationsService} from './angular2-notifications/simple-notifications.module';
import { AceEditorComponent } from 'ng2-ace-editor';
import 'brace'
import 'brace/mode/yaml'

import { AceDialogComponent } from './ace-dialog.component';
import { Release } from './release';
import { ReleaseService } from './release.service';
import { ActivityBarService } from './activity-bar.service';

@Component({
  selector: 'release-controls',
  templateUrl: './release-controls.component.html',
  styleUrls: [ './release-controls.component.css' ]
})
export class ReleaseControlsComponent {
  @Input() release: Release;
  @Input() ParentReleases: Release[];
  @Output() deleteEvent:EventEmitter<string>=new EventEmitter();
  @Output() editEvent:EventEmitter<Release>=new EventEmitter();

  dialogResp: string;
  loading: boolean;

  constructor(
    private releaseService: ReleaseService,
    private _dialog: MdDialog,
    private _notify: NotificationsService,
    private activity: ActivityBarService
  ) { }

  noteSuccess(message: string): void {
    this._notify.success(
       'Success',
       message,
       { }
    );
  }

  delete(): void {
    this.setLoad(true);
    this.releaseService.delete(this.release.name)
      .then(response => {
        this.deleteEvent.emit(this.release.name);
        this.setLoad(false);
        this.noteSuccess(`${this.release.name} successfully deleted.`)
    }).catch(error => this.loading=false);
  }

  openEditDialog(rel: Release) {
    let configData = rel.config.raw ? rel.config.raw.trim():"";
    const dialogRef = this._dialog.open(AceDialogComponent, {
      data: {'config':configData, 'values':rel.chart.values.raw},
    });
    dialogRef.afterClosed().subscribe(result => {
      this.dialogResp = result;
      if (result) {
        this.setLoad(true);

        this.releaseService.updateValues(rel.name, result)
          .then(rel => {
            // for (var i = 0; i < this.ParentReleases.length; i++) {
            //   if (this.ParentReleases[i].name == release.name) {
            //     this.ParentReleases[i] = release;
            //   }
            // }
            this.editEvent.emit(rel);
            this.setLoad(false);
            this.noteSuccess(`${rel.name} successfully updated.`)
          });
      }
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
}
