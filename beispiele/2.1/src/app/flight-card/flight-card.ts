import { Component, input, output } from '@angular/core';
import { Flight } from '../flight';
import { StatusLabelPipe } from '../status-label-pipe';

@Component({
  imports: [StatusLabelPipe],
  selector: 'app-flight-card',
  styleUrl: './flight-card.css',
  templateUrl: './flight-card.html',
})
export class FlightCard {
  flight = input.required<Flight>();
  // Output: meldet der Eltern-Komponente, dass die Karte angeklickt wurde
  selected = output<Flight>();
}
