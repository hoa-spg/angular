import { Component } from '@angular/core';
import { AddFlightFormComponent } from './add-flight-form.component';
import { Flight } from './flight';
import { FLIGHTS } from './flights';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AddFlightFormComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  flights: Flight[] = [...FLIGHTS];
  showForm = false;
  nextId = FLIGHTS.length + 1;

  addFlight(data: Omit<Flight, 'id'>): void {
    this.flights = [
      ...this.flights,
      { ...data, id: this.nextId++ },
    ];
    this.showForm = false;
  }

  deleteFlight(id: number): void {
    this.flights = this.flights.filter((f) => f.id !== id);
  }
}
