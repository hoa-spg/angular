import { Component, OnInit, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Flight } from '../flight';
import { FlightApi } from '../flight-api';
import { StatusLabelPipe } from '../status-label-pipe';

@Component({
  imports: [RouterLink, StatusLabelPipe],
  selector: 'app-flight-detail',
  styleUrl: './flight-detail.css',
  templateUrl: './flight-detail.html',
})
export class FlightDetail implements OnInit {
  private api = inject(FlightApi);

  // Wert des Routen-Parameters :id aus der URL /flight/:id
  id = input.required<string>();

  flight = signal<Flight | null>(null);
  error = signal('');

  ngOnInit(): void {
    this.api.getFlight(Number(this.id())).subscribe({
      next: (flight) => this.flight.set(flight),
      error: () => this.error.set('Flug nicht gefunden.'),
    });
  }
}
