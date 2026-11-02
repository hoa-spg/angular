import { Component } from '@angular/core';
import { FlightListComponent } from './flight-list.component';
import { Flight } from './flight';
import { FLIGHTS } from './flights';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FlightListComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  get departures(): Flight[] {
    return FLIGHTS.filter((f) => f.type === 'departure')
      .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
  }

  get arrivals(): Flight[] {
    return FLIGHTS.filter((f) => f.type === 'arrival')
      .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
  }
}
