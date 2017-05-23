import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class SearchService {
  // Observable string sources
  private searchTermSource = new Subject<string>();

  // Observable string streams
  searchSent$ = this.searchTermSource.asObservable();

  // Service message commands
  sendTerm(term: string) {
    this.searchTermSource.next(term);
  }

}
