import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateFlightPayload,
  Flight,
  FlightStatus,
  FlightType
} from './flight';

@Injectable({ providedIn: 'root' })
export class FlightApiService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/flights';

  getFlights(query?: {
    type?: FlightType;
    status?: FlightStatus | 'all';
    search?: string;
  }): Observable<Flight[]> {
    let params = new HttpParams();
    if (query?.type) {
      params = params.set('type', query.type);
    }
    if (query?.status && query.status !== 'all') {
      params = params.set('status', query.status);
    }
    if (query?.search) {
      params = params.set('search', query.search);
    }
    return this.http.get<Flight[]>(this.apiUrl, { params });
  }

  getFlightById(id: number): Observable<Flight> {
    return this.http.get<Flight>(`${this.apiUrl}/${id}`);
  }

  createFlight(payload: CreateFlightPayload): Observable<Flight> {
    return this.http.post<Flight>(this.apiUrl, payload);
  }

  deleteFlight(id: number): Observable<Flight> {
    return this.http.delete<Flight>(`${this.apiUrl}/${id}`);
  }

  patchFlightStatus(id: number, status: FlightStatus): Observable<Flight> {
    return this.http.patch<Flight>(`${this.apiUrl}/${id}`, { status });
  }
}
