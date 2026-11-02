import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'departures'
  },
  {
    path: 'departures',
    loadComponent: () =>
      import('./flight-board-page.component').then((m) => m.FlightBoardPageComponent),
    data: { type: 'departure', title: 'Abfluege' }
  },
  {
    path: 'arrivals',
    loadComponent: () =>
      import('./flight-board-page.component').then((m) => m.FlightBoardPageComponent),
    data: { type: 'arrival', title: 'Ankuenfte' }
  },
  {
    path: 'flight/:id',
    loadComponent: () =>
      import('./flight-detail.component').then((m) => m.FlightDetailComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
