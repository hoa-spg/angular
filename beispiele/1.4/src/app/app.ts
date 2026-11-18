import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AirportHeader } from './airport-header/airport-header';
import { FlightCard } from './flight-card/flight-card';
import { Flight, FlightType } from './flight';
import { FLIGHTS } from './flights';

@Component({
  imports: [FormsModule, AirportHeader, FlightCard],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  flights: Flight[] = FLIGHTS;
  selectedFlight = signal<Flight | null>(null);

  // Suchtext und Typfilter werden im Template geändert
  searchText = signal('');
  activeType = signal<'all' | FlightType>('all');

  // computed: wird neu berechnet, sobald sich ein gelesenes Signal ändert
  filteredFlights = computed(() => {
    const q = this.searchText().trim().toLowerCase();
    return this.flights
      .filter((f) => this.activeType() === 'all' || f.type === this.activeType())
      .filter(
        (f) =>
          !q ||
          f.flightNumber.toLowerCase().includes(q) ||
          f.airline.toLowerCase().includes(q) ||
          f.airport.toLowerCase().includes(q),
      );
  });

  onFlightSelect(flight: Flight): void {
    this.selectedFlight.set(flight);
  }
}
