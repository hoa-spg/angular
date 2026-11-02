import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  Subject,
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  interval,
  map,
  merge,
  of,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { AddFlightFormComponent } from './add-flight-form.component';
import { FilterBarComponent } from './filter-bar.component';
import { FilterStateService } from './filter-state.service';
import { CreateFlightPayload, Flight, FlightStatus, FlightType } from './flight';
import { FlightApiService } from './flight-api.service';
import { FlightTableComponent } from './flight-table.component';

@Component({
  selector: 'app-flight-board-page',
  standalone: true,
  imports: [AddFlightFormComponent, FilterBarComponent, FlightTableComponent],
  templateUrl: './flight-board-page.component.html',
})
export class FlightBoardPageComponent implements OnInit, OnDestroy {
  private api           = inject(FlightApiService);
  private route         = inject(ActivatedRoute);
  private filterStorage = inject(FilterStateService);
  private destroy$      = new Subject<void>();

  private searchInput$  = new BehaviorSubject<string>('');
  private statusFilter$ = new BehaviorSubject<FlightStatus | 'all'>('all');
  private typeFilter$   = new BehaviorSubject<FlightType>('departure');
  private refresh$      = new Subject<void>();

  flights:        Flight[] = [];
  errorMessage  = '';
  isLoading     = true;
  showForm      = false;
  pageTitle     = 'Abflüge';
  lastUpdated   = '';

  searchQuery   = '';
  statusFilter: FlightStatus | 'all' = 'all';

  ngOnInit(): void {
    const stored = this.filterStorage.load();
    this.searchQuery  = stored.searchQuery;
    this.statusFilter = stored.statusFilter;
    this.searchInput$.next(this.searchQuery);
    this.statusFilter$.next(this.statusFilter);

    const debouncedSearch$ = this.searchInput$.pipe(
      debounceTime(250),
      distinctUntilChanged(),
    );

    const query$ = combineLatest([
      this.typeFilter$,
      this.statusFilter$,
      debouncedSearch$,
    ]).pipe(
      map(([type, status, search]) => ({
        type,
        status,
        search: search.trim() || undefined,
      })),
    );

    const trigger$ = merge(interval(30_000), this.refresh$).pipe(startWith(0));

    combineLatest([query$, trigger$])
      .pipe(
        tap(() => {
          this.errorMessage = '';
          this.isLoading    = true;
        }),
        switchMap(([query]) =>
          this.api.getFlights(query).pipe(
            catchError(() => {
              this.errorMessage =
                'Backend nicht erreichbar. Starte backend/ mit: deno task dev';
              return of([] as Flight[]);
            }),
          ),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe((flights) => {
        this.flights     = flights;
        this.isLoading   = false;
        this.lastUpdated = new Date().toLocaleTimeString('de-AT');
      });

    this.route.data.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.pageTitle = data['title'] as string;
      this.typeFilter$.next(data['type'] as FlightType);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refresh(): void {
    this.refresh$.next();
  }

  createFlight(payload: CreateFlightPayload): void {
    this.api
      .createFlight(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.showForm = false;
        this.refresh();
      });
  }

  deleteFlight(id: number): void {
    if (!window.confirm('Flug wirklich löschen?')) return;
    this.api
      .deleteFlight(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.refresh());
  }

  changeStatus(id: number, status: FlightStatus): void {
    this.api
      .patchFlightStatus(id, status)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.refresh());
  }

  updateSearch(value: string): void {
    this.searchQuery = value;
    this.persist();
    this.searchInput$.next(value);
  }

  updateStatusFilter(value: FlightStatus | 'all'): void {
    this.statusFilter = value;
    this.persist();
    this.statusFilter$.next(value);
  }

  resetFilters(): void {
    this.searchQuery  = '';
    this.statusFilter = 'all';
    this.persist();
    this.searchInput$.next('');
    this.statusFilter$.next('all');
  }

  private persist(): void {
    this.filterStorage.save({
      searchQuery:  this.searchQuery,
      statusFilter: this.statusFilter,
    });
  }
}
