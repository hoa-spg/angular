import { Pipe, PipeTransform } from '@angular/core';
import { FlightStatus } from './flight';

@Pipe({
  name: 'statusLabel',
})
export class StatusLabelPipe implements PipeTransform {
  private readonly labels: Record<FlightStatus, string> = {
    'on-time': 'Pünktlich',
    delayed: 'Verspätet',
    boarding: 'Boarding',
    departed: 'Gestartet',
    landed: 'Gelandet',
    cancelled: 'Gestrichen',
  };

  // transform: Eingabewert → angezeigter Text
  transform(status: FlightStatus): string {
    return this.labels[status];
  }
}
