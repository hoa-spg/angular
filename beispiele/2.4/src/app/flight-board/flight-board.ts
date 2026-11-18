import { DatePipe } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EMPTY, catchError, debounceTime, interval, startWith, switchMap } from 'rxjs';
import { AddFlightForm } from '../add-flight-form/add-flight-form';
import { FlightCard } from '../flight-card/flight-card';
import { Flight, FlightType } from '../flight';
import { FlightApi } from '../flight-api';

@Component({
  imports: [DatePipe, FormsModule, AddFlightForm, FlightCard],
  selector: 'app-flight-board',
  styleUrl: './flight-board.css',
  templateUrl: './flight-board.html',
})
export class FlightBoard implements OnInit {
  private api = inject(FlightApi);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  // Startwert: leere Liste – die Flüge kommen vom Backend
  flights = signal<Flight[]>([]);
  loading = signal(true);
  error = signal('');
  lastUpdated = signal<Date | null>(null);

  // Suchtext und Typfilter werden im Template geändert
  searchText = signal('');
  activeType = signal<'all' | FlightType>('all');

  // Suche erst anwenden, wenn 300 ms lang nicht getippt wurde
  private debouncedSearch = toSignal(toObservable(this.searchText).pipe(debounceTime(300)), {
    initialValue: '',
  });

  // computed: wird neu berechnet, sobald sich ein gelesenes Signal ändert
  filteredFlights = computed(() => {
    const q = this.debouncedSearch().trim().toLowerCase();
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
    // Sofort und danach alle 30 Sekunden die Flüge laden
    interval(30_000)
      .pipe(
        startWith(0),
        switchMap(() =>
          this.api.getFlights().pipe(
            // Fehler abfangen, damit der Stream weiterläuft
            catchError(() => {
              this.error.set('Backend nicht erreichbar – läuft „deno task dev“?');
              this.loading.set(false);
              return EMPTY;
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((flights) => {
        this.flights.set(flights);
        this.error.set('');
        this.loading.set(false);
        this.lastUpdated.set(new Date());
      });
  }

  // Klick auf eine Karte öffnet die Detailseite
  onFlightSelect(flight: Flight): void {
    this.router.navigate(['/flight', flight.id]);
  }

  addFlight(data: Omit<Flight, 'id'>): void {
    // Das Backend vergibt die id und liefert den gespeicherten Flug zurück
    this.api.addFlight(data).subscribe((flight) => {
      this.flights.update((list) => [...list, flight]);
    });
  }
}
