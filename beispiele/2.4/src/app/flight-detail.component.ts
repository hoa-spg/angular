import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Flight } from './flight';
import { FlightApiService } from './flight-api.service';

@Component({
  selector: 'app-flight-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './flight-detail.component.html',
})
export class FlightDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api   = inject(FlightApiService);

  flight?: Flight;
  isLoading = true;
  error     = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getFlightById(id).subscribe({
      next: (flight) => {
        this.flight    = flight;
        this.isLoading = false;
      },
      error: () => {
        this.error     = 'Flug nicht gefunden.';
        this.isLoading = false;
      },
    });
  }
}
