import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlightStatus } from './flight';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filter-bar.component.html',
})
export class FilterBarComponent {
  @Input({ required: true }) searchQuery   = '';
  @Input({ required: true }) statusFilter: FlightStatus | 'all' = 'all';

  @Output() searchQueryChange   = new EventEmitter<string>();
  @Output() statusFilterChange  = new EventEmitter<FlightStatus | 'all'>();
  @Output() reset               = new EventEmitter<void>();
}
