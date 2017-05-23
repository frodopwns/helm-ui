import { Component, Optional, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';


@Component({
  template: `
    <ace-editor
      #editorInput
      [(text)]="data.config"
      [mode]="'yaml'"></ace-editor>
    <pre>{{ data.values }}</pre>
    <br />
    <button md-button (click)="dialogRef.close(editorInput.value)">
      <md-icon>save</md-icon> save
    </button>
    <button md-button (click)="dialogRef.close()">
      <md-icon>cancel</md-icon> cancel
    </button>
  `,
  styles: [`
    ace-editor {
      height: 10em;
      width: auto;
      font-family: "Courier New", Courier, monospace !important;
    }
    pre {
      width: auto;
      height: 10em;
      overflow: auto;
      background-color: #eeeeee;
      word-break: normal !important;
      word-wrap: normal !important;
      white-space: pre !important;
    }
  `],
})
export class AceDialogComponent {
  //text: string = 
  constructor( 
    @Optional() public dialogRef: MdDialogRef<AceDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any
  ) {}
}
