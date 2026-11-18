import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddFlightForm } from './add-flight-form/add-flight-form';
import { AirportHeader } from './airport-header/airport-header';
import { FlightCard } from './flight-card/flight-card';
import { Flight, FlightType } from './flight';
import { FlightApi } from './flight-api';

@Component({
  imports: [FormsModule, AddFlightForm, AirportHeader, FlightCard],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  private api = inject(FlightApi);

  // Startwert: leere Liste – die Flüge kommen vom Backend
  flights = signal<Flight[]>([]);
  loading = signal(true);
  error = signal('');
  selectedFlight = signal<Flight | null>(null);

  // Suchtext und Typfilter werden im Template geändert
  searchText = signal('');
  activeType = signal<'all' | FlightType>('all');

  // computed: wird neu berechnet, sobald sich ein gelesenes Signal ändert
  filteredFlights = computed(() => {
    const q = this.searchText().trim().toLowerCase();
    return this.flights()
      .filter((f) => this.activeType() === 'all' || f.type === this.activeType())
      .filter(
        (f) =>
          !q ||
          f.flightNumber.toLowerCase().includes(q) ||
          f.airline.toLowerCase().includes(q) ||
          f.airport.toLowerCase().includes(q),
      );
  });

  // ngOnInit: läuft einmal, wenn die Komponente erstellt ist
  ngOnInit(): void {
    // subscribe startet den Request und legt fest, was mit der Antwort passiert
    this.api.getFlights().subscribe({
      next: (flights) => {
        this.flights.set(flights);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Backend nicht erreichbar – läuft „deno task dev“?');
        this.loading.set(false);
      },
    });
  }

  onFlightSelect(flight: Flight): void {
    this.selectedFlight.set(flight);
  }

  addFlight(data: Omit<Flight, 'id'>): void {
    // Das Backend vergibt die id und liefert den gespeicherten Flug zurück
    this.api.addFlight(data).subscribe((flight) => {
      this.flights.update((list) => [...list, flight]);
    });
  }
}
