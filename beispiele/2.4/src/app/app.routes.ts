import { Routes } from '@angular/router';
import { FlightBoard } from './flight-board/flight-board';

export const routes: Routes = [
  { path: '', component: FlightBoard },
  {
    path: 'flight/:id',
    // Lazy Loading: der Code der Detailseite wird erst beim ersten Aufruf geladen
    loadComponent: () => import('./flight-detail/flight-detail').then((m) => m.FlightDetail),
  },
  { path: '**', redirectTo: '' },
];
