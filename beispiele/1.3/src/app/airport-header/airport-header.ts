import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-airport-header',
  styleUrl: './airport-header.css',
  templateUrl: './airport-header.html',
})
export class AirportHeader {
  // Input: Der Wert kommt von der Eltern-Komponente
  airportName = input.required<string>();
}
