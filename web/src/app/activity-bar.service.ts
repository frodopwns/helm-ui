import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class ActivityBarService {
  // Observable string sources
  private barColorSource = new Subject<string>();
  private barModeSource = new Subject<string>();
  private barActivitySource = new Subject<string>();

  // Observable string streams
  colorSet$ = this.barColorSource.asObservable();
  modeSet$ = this.barModeSource.asObservable();
  activitySet$ = this.barActivitySource.asObservable();

  // Service message commands
  setColor(color: string) {
    this.barColorSource.next(color);
  }
  setMode(mode: string) {
    this.barModeSource.next(mode);
  }
  setActivity(activity: string) {
    this.barActivitySource.next(activity)
  }
}
