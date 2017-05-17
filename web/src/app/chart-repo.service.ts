import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import { APIURL } from './config/config';

import 'rxjs/add/operator/toPromise';
import {NotificationsService} from './libs/angular2-notifications/simple-notifications.module';

import { ChartRepo } from './chart-repo';
import { Chart } from './chart';
import { Release } from './release';

@Injectable()
export class ChartRepoService {

  private reposUrl = APIURL + '/repos';

  constructor(
    private http: Http,
    private _service: NotificationsService
  ) { }

  noteErr(message: string): void {
    this._service.error(
      'Error',
      message,
      { }
    );
  }

  getRepos(): Promise<ChartRepo[]> {
    return this.http.get(this.reposUrl)
               .toPromise()
               .then(response => response.json() as ChartRepo[])
               .catch(error => {
                 this.handleError(error);
                 this.noteErr("Failed to get chart repos.");
                });
  }

  getRepoCharts(name: string): Promise<Chart[]> {
    return this.http.get(this.reposUrl+'/'+name+'/charts')
               .toPromise()
               .then(response => response.json() as Chart[])
               .catch(error => {
                 this.handleError(error);
                 this.noteErr(`Failed to get charts from repo: ${name}`);
                });
  }


  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  getReposSlowly(): Promise<ChartRepo[]> {
    return new Promise(resolve => {
      // Simulate server latency with 2 second delay
      setTimeout(() => resolve(this.getRepos()), 2000);
    });
  }

  private headers = new Headers({'Content-Type': 'application/json'});

  create(name: string, url: string): Promise<ChartRepo> {
    return this.http
      .post(this.reposUrl, JSON.stringify({name: name, url: url}), {headers: this.headers})
      .toPromise()
      .then(res => res.json() as ChartRepo)
      .catch(error => {
        this.handleError(error);
        this.noteErr(`Failed to add chart repo: ${name}`);
      });
  }

  install(chart: string, repo: string): Promise<Release> {
    return this.http
      .post(this.reposUrl+'/'+repo+'/charts/'+chart+'/install', JSON.stringify({name: name}), {headers: this.headers})
      .toPromise()
      .then(res => res.json() as Release)
               .catch(error => {
                 this.handleError(error);
                 this.noteErr(`Failed to install chart: ${chart}`);
                });
  }

  delete(name: string): Promise<ChartRepo> {
    return this.http
      .delete(this.reposUrl + '/'+name)
      .toPromise()
      .then(res => res.json() as ChartRepo)
               .catch(error => {
                 this.handleError(error);
                 this.noteErr(`Failed to delete chart repo: ${name}`);
                });
  }

  search(repo: string, term: string): Promise<Chart[]> {
    return this.http.get(this.reposUrl+'/'+repo+'/charts?name='+ term)
               .toPromise()
               .then(response => response.json() as Chart[])
               .catch(this.handleError);
  }


}
