import { Component } from '@angular/core';
import { Flight } from './flight';
import { FLIGHTS } from './flights';

@Component({
  imports: [],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  flights: Flight[] = FLIGHTS;
}
