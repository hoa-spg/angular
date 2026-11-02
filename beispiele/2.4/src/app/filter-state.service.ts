import { Injectable } from '@angular/core';
import { FlightStatus } from './flight';

export interface FilterState {
  searchQuery: string;
  statusFilter: FlightStatus | 'all';
}

@Injectable({ providedIn: 'root' })
export class FilterStateService {
  private readonly key = 'angular-flugboard-filter';

  load(): FilterState {
    const raw = localStorage.getItem(this.key);
    if (!raw) {
      return { searchQuery: '', statusFilter: 'all' };
    }
    try {
      return JSON.parse(raw) as FilterState;
    } catch {
      return { searchQuery: '', statusFilter: 'all' };
    }
  }

  save(state: FilterState): void {
    localStorage.setItem(this.key, JSON.stringify(state));
  }
}
