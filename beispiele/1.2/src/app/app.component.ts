import { Component } from '@angular/core';
import { AirportHeaderComponent } from './airport-header.component';
import { FlightCardComponent } from './flight-card.component';
import { Flight } from './flight';
import { FLIGHTS } from './flights';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AirportHeaderComponent, FlightCardComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  flights: Flight[] = FLIGHTS;
  selectedFlight: Flight | null = null;

  onFlightSelect(flight: Flight): void {
    this.selectedFlight = flight;
  }
}
