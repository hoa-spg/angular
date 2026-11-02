import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Flight, FlightType } from './flight';

const API_URL = 'http://localhost:8000/api/flights';

@Injectable({ providedIn: 'root' })
export class FlightApiService {
  private http = inject(HttpClient);

  getFlights(type?: FlightType): Observable<Flight[]> {
    const params = type ? new HttpParams().set('type', type) : undefined;
    return this.http.get<Flight[]>(API_URL, { params });
  }

  getFlightById(id: number): Observable<Flight> {
    return this.http.get<Flight>(`${API_URL}/${id}`);
  }
}
