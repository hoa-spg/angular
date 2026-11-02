import { Pipe, PipeTransform } from '@angular/core';
import { FlightStatus } from './flight';

/**
 * Wandelt einen FlightStatus in ein lesbares Label mit Emoji um.
 * Verwendung im Template: {{ flight.status | statusLabel }}
 */
@Pipe({
  name: 'statusLabel',
  standalone: true,
})
export class StatusLabelPipe implements PipeTransform {
  private readonly labels: Record<FlightStatus, string> = {
    'on-time':  '✓ Pünktlich',
    'delayed':  '⏱ Verspätet',
    'boarding': '→ Boarding',
    'departed': '↑ Abgeflogen',
    'landed':   '↓ Gelandet',
    'cancelled': '✕ Storniert',
  };

  transform(status: FlightStatus): string {
    return this.labels[status] ?? status;
  }
}
