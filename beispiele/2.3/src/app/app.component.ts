import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  BehaviorSubject,
  Subject,
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  interval,
  merge,
  of,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs';
import { FlightApiService } from './flight-api.service';
import { Flight, FlightType } from './flight';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  private api      = inject(FlightApiService);
  private destroy$ = new Subject<void>();

  // Reaktiver State mit BehaviorSubject
  searchInput$ = new BehaviorSubject<string>('');
  typeFilter$  = new BehaviorSubject<'all' | FlightType>('all');
  refresh$     = new Subject<void>();

  flights:      Flight[] = [];
  isLoading   = true;
  isRefreshing = false;
  error        = '';
  lastUpdated  = '';

  // Getter für Template-Binding (kein [(ngModel)] auf Subject)
  get searchText(): string  { return this.searchInput$.value; }
  get activeType():  string { return this.typeFilter$.value; }

  ngOnInit(): void {
    const debouncedSearch$ = this.searchInput$.pipe(
      debounceTime(250),
      distinctUntilChanged(),
    );

    // Alle Filter kombinieren
    const query$ = combineLatest([this.typeFilter$, debouncedSearch$]);

    // Polling alle 30 Sekunden + manueller Refresh
    const trigger$ = merge(interval(30_000), this.refresh$).pipe(startWith(0));

    combineLatest([query$, trigger$])
      .pipe(
        switchMap(([[type, search]]) => {
          this.isRefreshing = true;
          this.error        = '';
          return this.api
            .getFlights({
              type:   type === 'all' ? undefined : type,
              search: search.trim() || undefined,
            })
            .pipe(
              catchError(() => {
                this.error =
                  'Backend nicht erreichbar. Starte backend/ mit: deno task dev';
                return of([] as Flight[]);
              }),
            );
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((flights) => {
        this.flights      = flights;
        this.isLoading    = false;
        this.isRefreshing = false;
        this.lastUpdated  = new Date().toLocaleTimeString('de-AT');
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setSearch(value: string): void { this.searchInput$.next(value); }
  setType(type: 'all' | FlightType): void { this.typeFilter$.next(type); }
  refresh(): void { this.refresh$.next(); }
}
