import { Component, Optional, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  template: `
    <div [innerHTML]="data | safe: 'html'" class="diff-content"></div>
    <button md-button (click)="dialogRef.close()">
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
