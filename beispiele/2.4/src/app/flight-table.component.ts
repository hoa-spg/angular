import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Flight, FlightStatus } from './flight';

@Component({
  selector: 'app-flight-table',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './flight-table.component.html',
})
export class FlightTableComponent {
  @Input({ required: true }) title   = '';
  @Input({ required: true }) flights: Flight[] = [];

  @Output() remove       = new EventEmitter<number>();
  @Output() statusChange = new EventEmitter<{ id: number; status: FlightStatus }>();
}
