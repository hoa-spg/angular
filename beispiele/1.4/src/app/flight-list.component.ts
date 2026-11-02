import { UpperCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Flight } from './flight';
import { StatusLabelPipe } from './status-label.pipe';

@Component({
  selector: 'app-flight-list',
  standalone: true,
  imports: [StatusLabelPipe, UpperCasePipe],
  templateUrl: './flight-list.component.html',
})
export class FlightListComponent {
  @Input({ required: true }) title = '';
  @Input({ required: true }) flights: Flight[] = [];
}
