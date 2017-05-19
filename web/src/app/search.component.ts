import { Component, OnInit } from '@angular/core';
import { SearchService } from './search.service';

@Component({
  selector: 'search',
  template: `
  <div>
    <md-input-container>
      <input mdInput placeholder="search" #myInput (input)="send(myInput.value)" />
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
  title = 'HelmUI';
  public options = {
     position: ["top", "left"],
     timeOut: 5000,
     clickToClose: true,
     lastOnBottom: true,
  };

  constructor(private search: SearchService) {}

  ngOnInit() {
    console.log("search component init");
  }

  send(terms: string): void {
    console.log("sending");
    this.search.sendTerm(terms);
  }
}
