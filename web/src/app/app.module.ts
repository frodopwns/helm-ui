import { NgModule }      from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NotificationsService, SimpleNotificationsModule} from './angular2-notifications/simple-notifications.module';


import { AppRoutingModule } from './app-routing.module';

import { AppComponent }         from './app.component';
import { ChartReposComponent }   from './chart-repos.component';
import { ChartRepoDetailComponent } from './chart-repo-detail.component';

import { FlexLayoutModule } from "@angular/flex-layout";

import { ReleasesComponent }      from './releases.component';
import { ReleaseComponent }      from './release.component';

import { ReleaseService }          from './release.service';
import { ChartRepoService }          from './chart-repo.service';

import { CompBarComponent } from './comp-bar.component';
import { SearchComponent } from './search.component';
import { SearchService } from './search.service';

import { ActivityBarComponent } from './activity-bar.component';
import { ActivityBarService } from './activity-bar.service';

import { ReleaseControlsComponent } from './release-controls.component'; 
import { SafePipe } from './safe.pipe';
import { UnEpochPipe } from './unepoch.pipe';
import { StatusStringPipe } from './status.pipe';

import { AceDialogComponent } from './ace-dialog.component';
import { DiffDialogComponent } from './diff-dialog.component';
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
    FlexLayoutModule,
    SimpleNotificationsModule
  ],
  declarations: [
    AppComponent,
    ChartReposComponent,
    ReleasesComponent,
    ReleaseComponent,
    ChartRepoDetailComponent,
    AceDialogComponent,
    DiffDialogComponent,
    CompBarComponent,
    ReleaseControlsComponent,
    UnEpochPipe,
    StatusStringPipe,
    SafePipe,
    SearchComponent,
    ActivityBarComponent
  ],
  providers: [ 
    ReleaseService,
    ChartRepoService,
    NotificationsService,
    Title,
    SearchService,
    ActivityBarService
  ],
  entryComponents: [ AceDialogComponent, DiffDialogComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }