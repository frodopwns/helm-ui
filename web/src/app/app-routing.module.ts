import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChartReposComponent }   from './chart-repos.component';
import { ReleasesComponent }      from './releases.component';
import { ChartRepoDetailComponent } from './chart-repo-detail.component';
import { ReleaseComponent } from './release.component';

const routes: Routes = [
  { 
    path: 'dashboard', 
    redirectTo: '', 
    pathMatch: 'full' ,
    data: {'title': 'dashboard'}
  },
  { 
    path: 'chart-repos',  
    component: ChartReposComponent,
    data: {'title': 'chart repos'}
  },
  { 
    path: 'release/:name', 
    component: ReleaseComponent,
    data: {'title': 'release'}
  },
  { 
    path: 'chart-repos/detail/:name', 
    component: ChartRepoDetailComponent,
    data: {'title': 'charts'}
  },
  { 
    path: '',     
    component: ReleasesComponent,
    data: {'title': 'dashboard'}
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
