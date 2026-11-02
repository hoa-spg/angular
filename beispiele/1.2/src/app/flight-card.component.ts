import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Flight } from './flight';

@Component({
  selector: 'app-flight-card',
  standalone: true,
  templateUrl: './flight-card.component.html',
})
export class FlightCardComponent {
  @Input({ required: true }) flight!: Flight;
  @Output() select = new EventEmitter<Flight>();
}
