import { Component } from '@angular/core';
import { Flight } from './flight';
import { FLIGHTS } from './flights';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
})
export class AppComponent {
  flights: Flight[] = FLIGHTS;
}
