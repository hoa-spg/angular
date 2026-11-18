import { Component, input, output } from '@angular/core';
import { Flight } from '../flight';

@Component({
  imports: [],
  selector: 'app-flight-card',
  styleUrl: './flight-card.css',
  templateUrl: './flight-card.html',
})
export class FlightCard {
  flight = input.required<Flight>();
  // Output: meldet der Eltern-Komponente, dass die Karte angeklickt wurde
  selected = output<Flight>();
}
