import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Flight, FlightType } from './flight';
import { FLIGHTS } from './flights';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  readonly flights: Flight[] = FLIGHTS;

  // Two-Way-Binding via [(ngModel)]
  searchText = '';
  activeType: 'all' | FlightType = 'all';

  // Getter = reaktiver computed State (kein useMemo nötig)
  get filteredFlights(): Flight[] {
    const q = this.searchText.trim().toLowerCase();
    return this.flights
      .filter((f) => this.activeType === 'all' || f.type === this.activeType)
      .filter((f) =>
        !q ||
        f.flightNumber.toLowerCase().includes(q) ||
        f.airline.toLowerCase().includes(q) ||
        f.airport.toLowerCase().includes(q)
      );
  }

  setType(type: 'all' | FlightType): void {
    this.activeType = type;
  }
}
