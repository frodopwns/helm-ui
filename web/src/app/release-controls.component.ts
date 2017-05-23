import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MdDialog } from '@angular/material';
import {NotificationsService} from './angular2-notifications/simple-notifications.module';
import { AceEditorComponent } from 'ng2-ace-editor';
import 'brace'
import 'brace/mode/yaml'

import { AceDialogComponent } from './ace-dialog.component';
import { Release } from './release';
import { ReleaseService } from './release.service';


@Component({
  selector: 'release-controls',
  templateUrl: './release-controls.component.html',
  styleUrls: [ './release-controls.component.css' ]
})
export class ReleaseControlsComponent {
  @Input() release: Release;
  @Input() ParentReleases: Release[];
  @Output() outputEvent:EventEmitter<string>=new EventEmitter();

  dialogResp: string;
  loading: boolean;

  constructor(
    private releaseService: ReleaseService,
    private _dialog: MdDialog,
    private _notify: NotificationsService
  ) { }

  noteSuccess(message: string): void {
    this._notify.success(
       'Success',
       message,
       { }
    );
  }

  delete(): void {
    this.releaseService.delete(this.release.name)
      .then(response => {
      this.outputEvent.emit(this.release.name);
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
        this.toggleLoad();

        this.releaseService.updateValues(rel.name, result)
          .then(release => {
            for (var i = 0; i < this.ParentReleases.length; i++) {
              if (this.ParentReleases[i].name == release.name) {
                this.ParentReleases[i] = release;
              }
            }
            this.noteSuccess(`${release.name} successfully updated.`)
          });
      }
    })
  }

  toggleLoad(): void {
    this.loading = this.loading ? false: true; 
  }
}
