import { Component, OnInit } from '@angular/core';
import { SearchService } from './search.service';
import { Router }            from '@angular/router';

@Component({
  selector: 'search',
  template: `
  <div>
    <md-input-container>
      <input mdInput placeholder="search" [(ngModel)]='searchField' (input)="send()" />
      <span md-prefix>
        <md-icon>search</md-icon>
        &nbsp;
      </span>
    </md-input-container>
  </div>
  `,
  styleUrls: ['./app.component.css'],
})
export class SearchComponent implements OnInit {
  searchField: string = '';
  public options = {
     position: ["top", "left"],
     timeOut: 5000,
     clickToClose: true,
     lastOnBottom: true,
  };

  constructor(
    private search: SearchService,
    private router: Router
  ) {
    router.events.subscribe((val) => {
         this.searchField = '';
    });
  }

  ngOnInit() {
    console.log("search component init");
  }

  send(): void {
    console.log("sending");
    this.search.sendTerm(this.searchField);
  }
}
