import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { APIURL } from './config/config';

import {NotificationsService} from './libs/angular2-notifications/simple-notifications.module';

import { Response } from './response';
import { Release } from './release';

@Injectable()
export class ReleaseService {

  private releasesUrl = APIURL + '/releases';

  constructor(
    private http: Http,
    private _service: NotificationsService
  ) { }

  noteErr(message: string): void {
    this._service.error(
      'Error',
      message,
      { 
        'timeOut': 5000
      }
    );
  }

  getReleases(): Promise<Release[]> {
    return this.http.get(this.releasesUrl)
               .toPromise()
               .then(response => response.json() as Release[])
               .catch(error => {
                 this.handleError(error);
                 this.noteErr("Failed to get releases.");
                });
  }

  getRelease(name: string): Promise<Release> {
    return this.http.get(this.releasesUrl + "/" + name)
               .toPromise()
               .then(response => response.json() as Release)
               .catch(error => {
                 this.handleError(error);
                 this.noteErr("Failed to get release: " + name);
                });
  }

  getReleaseHistory(name: string): Promise<Release[]> {
    return this.http.get(this.releasesUrl + "/" + name + "/history")
               .toPromise()
               .then(response => response.json() as Release[])
               .catch(error => {
                 this.handleError(error);
                 this.noteErr("Failed to get history for release: " + name);
                });
  }

  getChartReleases(name: string): Promise<Release[]> {
    return this.http.get(this.releasesUrl+"?chart="+name)
               .toPromise()
               .then(response => response.json() as Release[])
               .catch(error => {
                 this.handleError(error);
                 this.noteErr("Failed to get releases for chart: " + name);
                });
  }


  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
  
    return Promise.reject(error.message || error);
  }

  getReposSlowly(): Promise<Release[]> {
    return new Promise(resolve => {
      // Simulate server latency with 2 second delay
      setTimeout(() => resolve(this.getReleases()), 2000);
    });
  }

  private headers = new Headers({'Content-Type': 'application/json'});

  delete(name: string): Promise<Response> {
    return this.http
      .delete(this.releasesUrl + '/'+name)
      .toPromise()
      .then(res => res.json() as Response)
               .catch(error => {
                 this.handleError(error);
                 this.noteErr("Failed to delete release: " + name);
                });
  }

  rollback(name: string, revision: number): Promise<Release> {
    return this.http
      .post(this.releasesUrl+'/'+name+'/rollback/' + revision, JSON.stringify({name: name}), {headers: this.headers})
      .toPromise()
      .then(res => res.json() as Release)
               .catch(error => {
                 this.handleError(error);
                 this.noteErr(`Failed to roll back to revision ${revision} of ${name}`);
                });
  }

  diff(name: string, revision: number): Promise<Response> {
    return this.http
      .get(this.releasesUrl+'/'+name+'/diff/' + revision, {headers: this.headers})
      .toPromise()
      .then(res => res.json() as Response)
               .catch(error => {
                 this.handleError(error);
                 this.noteErr(`Failed to get diff for revision ${revision} of ${name}`);
                });
  }

  updateValues(name: string, data: string): Promise<Release> {
    return this.http
      .patch(this.releasesUrl + '/'+name, JSON.stringify({data: data}), {headers: this.headers})
      .toPromise()
      .then(res => res.json() as Release)
               .catch(error => {
                 this.handleError(error);
                 this.noteErr(`Failed to update ${name}`);
                });
  }

}
