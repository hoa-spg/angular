import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Flight } from './flight';

const API_URL = 'http://localhost:8000/api/flights';

@Service()
export class FlightApi {
  // inject(): Angular liefert die eine, gemeinsame HttpClient-Instanz
  private http = inject(HttpClient);

  getFlights(): Observable<Flight[]> {
    return this.http.get<Flight[]>(API_URL);
  }

  addFlight(data: Omit<Flight, 'id'>): Observable<Flight> {
    return this.http.post<Flight>(API_URL, data);
  }
}
