import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import {
  Component,
  DestroyRef,
  Injector,
  Input,
  OnInit,
  Signal,
  assertInInjectionContext,
  computed,
  effect,
  inject,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Flight, FlightService, selectFlights } from '../../data';
import { CityValidator } from 'src/app/shared/util-common';
import { FlightCardComponent } from '../../ui-common';
import { ChangeDetectionStrategy } from '@angular/core';
import { addMinutes } from 'src/app/shared/util-common/date-utils';
import { Store } from '@ngrx/store';
import { Observable, interval, of, takeUntil } from 'rxjs';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

function selectAllFlights(): Observable<Flight[]> {
  assertInInjectionContext(selectAllFlights);
  const store = inject(Store);
  return store.select(selectFlights);
}

function selectAllFlights2(injector: Injector): Observable<Flight[]> {
  let store: Store | undefined;
  runInInjectionContext(injector, () => {
    store = inject(Store);
  });
  if (store) {
    return store.select(selectFlights);
  }
  return of([]);
}

@Component({
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    AsyncPipe,
    JsonPipe,
    FormsModule,
    FlightCardComponent,
    CityValidator,
  ],
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightSearchComponent implements OnInit {
  private flightService = inject(FlightService);

  destroyRef = inject(DestroyRef);
  injector = inject(Injector);
  router = inject(Router);

  @Input() q = '';

  from = signal('Hamburg'); // in Germany
  to = signal('Graz'); // in Austria
  flightRoute = computed(() => this.from() + ' to ' + this.to());

  urgent = signal(false);
  flights = signal<Flight[]>([]);
  basket = signal<Record<number, boolean>>({
    3: true,
    5: true,
  });

  constructor() {
    // const sub = interval(1000).subscribe((counter) => console.log(counter));
    // const cleanup = this.destroyRef.onDestroy(() => {
    //   sub.unsubscribe();
    // });

    //cleanup();

    // interval(1000)
    //   .pipe(takeUntilDestroyed())
    //   .subscribe((counter) => console.log(counter));

    effect(() => {
      this.search();
    });
  }

  ngOnInit(): void {
    console.log(
      'lastSuccessfullNavigation',
      this.router.lastSuccessfulNavigation
    );

    // const flights$ = selectAllFlights();
    // const x = selectAllFlightsInInjectionContext(this.injector);

    if (this.q) {
      console.log('q');
      const [from, to] = this.q.split('-');
      this.from.set(from);
      this.to.set(to);
    }
  }

  async search() {
    if (!this.from() || !this.to()) return;
    const flights = await this.flightService.findPromise(
      this.from(),
      this.to()
    );
    this.flights.set(flights);
  }

  delay(): void {
    const flights = this.flights();
    const flight = flights[0];
    this.flights.update((flights) => [
      { ...flight, date: addMinutes(flight.date, 15) },
      ...flights.slice(1),
    ]);
  }
}
