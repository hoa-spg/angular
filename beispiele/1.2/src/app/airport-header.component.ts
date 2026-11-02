import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-airport-header',
  standalone: true,
  templateUrl: './airport-header.component.html',
})
export class AirportHeaderComponent {
  @Input({ required: true }) airportName!: string;

  get currentTime(): string {
    return new Date().toLocaleTimeString('de-AT', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
