import {Component, Input} from '@angular/core';


@Component({
  selector: 'app-error-state',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.sass']
})
export class ErrorComponent {
  @Input() message: string;

  constructor() {
  }


}
