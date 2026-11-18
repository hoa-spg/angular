import { Component, signal } from '@angular/core';
import { AirportHeader } from './airport-header/airport-header';
import { FlightCard } from './flight-card/flight-card';
import { Flight } from './flight';
import { FLIGHTS } from './flights';

@Component({
  imports: [AirportHeader, FlightCard],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  flights: Flight[] = FLIGHTS;
  // Signal: Angular aktualisiert die Anzeige, sobald sich der Wert ändert
  selectedFlight = signal<Flight | null>(null);

  onFlightSelect(flight: Flight): void {
    this.selectedFlight.set(flight);
  }
}
