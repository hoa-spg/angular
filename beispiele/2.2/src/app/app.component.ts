import { Component, OnInit, inject } from '@angular/core';
import { FlightApiService } from './flight-api.service';
import { Flight, FlightType } from './flight';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private api = inject(FlightApiService);

  departures: Flight[] = [];
  arrivals:   Flight[] = [];
  isLoading = true;
  error     = '';

  ngOnInit(): void {
    this.loadFlights('departure');
    this.loadFlights('arrival');
  }

  private loadFlights(type: FlightType): void {
    this.api.getFlights(type).subscribe({
      next: (flights) => {
        if (type === 'departure') {
          this.departures = flights;
        } else {
          this.arrivals = flights;
        }
        this.isLoading = false;
      },
      error: () => {
        this.error =
          'Backend nicht erreichbar. Starte backend/ mit: deno task dev';
        this.isLoading = false;
      },
    });
  }
}
