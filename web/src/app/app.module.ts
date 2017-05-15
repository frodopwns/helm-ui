import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppRoutingModule } from './app-routing.module';

import { AppComponent }         from './app.component';
import { ChartReposComponent }   from './chart-repos.component';
import { ChartRepoDetailComponent } from './chart-repo-detail.component';

import { ReleasesComponent }      from './releases.component';
import { ReleaseComponent }      from './release.component';

import { ReleaseService }          from './release.service';
import { ChartRepoService }          from './chart-repo.service';

import { CompBarComponent } from './comp-bar.component';

import { 
  ReleaseControlsComponent, 
  SafePipe, 
  UnEpochPipe, 
  StatusStringPipe, 
  DialogContentComponent 
} from './release-controls.component'; 

import { DiffDialogComponent } from './release.component';

import {AceEditorModule} from 'ng2-ace-editor';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    AceEditorModule,
  ],
  declarations: [
    AppComponent,
    ChartReposComponent,
    ReleasesComponent,
    ReleaseComponent,
    ChartRepoDetailComponent,
    DialogContentComponent,
    DiffDialogComponent,
    CompBarComponent,
    ReleaseControlsComponent,
    UnEpochPipe,
    StatusStringPipe,
    SafePipe
  ],
  providers: [ 
    ReleaseService,
    ChartRepoService
  ],
  entryComponents: [ DialogContentComponent, DiffDialogComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }