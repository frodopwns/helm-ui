import { Component, OnInit, Optional, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

import { Release } from './release';
import { ReleaseService } from './release.service';

@Component({
  selector: 'my-releases',
  templateUrl: './releases.component.html',
  styleUrls: [ './releases.component.css' ]
})
export class ReleasesComponent implements OnInit {
  releases: Release[];
  selectedRelease: Release;
  dialogResp: string;

  constructor(
    private router: Router,
    private releaseService: ReleaseService,
    private _dialog: MdDialog
  ) { }

  getReleases(): void {
    this.releaseService.getReleases().then(releases => this.releases = releases);
  }

  ngOnInit(): void {
    this.getReleases();
  }

  onSelect(release: Release): void {
    this.selectedRelease = release;
  }

  gotoDetail(): void {
    this.router.navigate(['/detail', this.selectedRelease.name]);
  }

  // add(name: string): void {
  //   name = name.trim();
  //   if (!name) { return; }
  //   this.heroService.create(name)
  //     .then(hero => {
  //       this.heroes.push(hero);
  //       this.selectedHero = null;
  //     });
  // }

  delete(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.releaseService.delete(name)
      .then(response => {
        this.releases = this.releases.filter(rel => rel.name !== name)
      });
  }

  openEditDialog(name: string, config: string, values: string) {
    const dialogRef = this._dialog.open(DialogContentComponent, {
      data: {'config':config, 'values':values},
    });
    dialogRef.afterClosed().subscribe(result => {
      this.dialogResp = result;
      if (result) {
        console.log(result);
        this.releaseService.updateValues(name, result)
      }
    })
  }

}


@Component({
  template: `
    <textarea #editorInput>
{{ data.config }}
    </textarea>
    <pre>
{{ data.values }}
    </pre>
    <br />
    <button color="accent" md-button (click)="dialogRef.close(editorInput.value)">
      <md-icon>save</md-icon> save
    </button>
    <button color="accent" md-button (click)="dialogRef.close()">
      <md-icon>cancel</md-icon> cancel
    </button>
  `,
  styles: [`
    textarea {
      width: 50em;
      height: 10em;
    }
    pre {
      width: 50em;
      height: 10em;
      overflow: auto;
      background-color: #eeeeee;
      word-break: normal !important;
      word-wrap: normal !important;
      white-space: pre !important;
    }
  `],
})
export class DialogContentComponent {
  code: string;
  constructor( 
    @Optional() public dialogRef: MdDialogRef<DialogContentComponent>,
    @Inject(MD_DIALOG_DATA) public data: any
  ) { }
}