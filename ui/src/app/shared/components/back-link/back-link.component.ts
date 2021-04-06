import {Component} from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-back-link',
  templateUrl: './back-link.component.html',
  styleUrls: ['./back-link.component.sass']
})
export class BackLinkComponent  {

  constructor(private location: Location) {
  }

  async back(event) {
    event.preventDefault();
    this.location.back();
  }

}
