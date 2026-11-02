import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Flight, FlightStatus, FlightType } from './flight';

const API_URL = 'http://localhost:8000/api/flights';

@Injectable({ providedIn: 'root' })
export class FlightApiService {
  private http = inject(HttpClient);

  getFlights(query?: {
    type?:   FlightType;
    status?: FlightStatus | 'all';
    search?: string;
  }): Observable<Flight[]> {
    let params = new HttpParams();
    if (query?.type)                          params = params.set('type',   query.type);
    if (query?.status && query.status !== 'all') params = params.set('status', query.status);
    if (query?.search)                        params = params.set('search', query.search);
    return this.http.get<Flight[]>(API_URL, { params });
  }
}
