import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import {
  Component,
  WritableSignal,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  firstValueFrom,
  combineLatest,
  debounceTime,
  filter,
  interval,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import {
  toObservable,
  toSignal,
  takeUntilDestroyed,
} from '@angular/core/rxjs-interop';

import { ActivatedRoute } from '@angular/router';
import {
  BookingSlice,
  Flight,
  FlightService,
  delayFlight,
  loadFlights,
  selectFlights,
} from '../../data';
import { CityValidator } from 'src/app/shared/util-common';
import { FlightCardComponent } from '../../ui-common';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  standalone: true,
  imports: [
    // CommonModule,
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
export class FlightSearchComponent {
  private flightService = inject(FlightService);
  private route = inject(ActivatedRoute);
  private store = inject(Store);

  from = signal(''); // in Germany
  to = signal(''); // in Austria
  urgent = signal(false);

  flightRoute = computed(() => `Route from ${this.from()} to ${this.to()}`);

  flights = toSignal(this.store.select(selectFlights), { initialValue: [] });

  basket: WritableSignal<Record<number, boolean>> = signal({
    3: true,
    5: true,
  });

  criteria$ = combineLatest({
    from: toObservable(this.from),
    to: toObservable(this.to)
  }).pipe(
    debounceTime(300)
  );

  criteria = toSignal(this.criteria$, { initialValue: { from: '', to: '' }});

  constructor() {
    effect(async () => {
      await this.search();
    });
  }

  async search() {

    const c = this.criteria();

    if (!c.from|| !c.from) return

    this.store.dispatch(loadFlights({from: c.from, to: c.to}));
  }

  delay(): void {
    const flights = this.flights();
    const id = flights[0].id;
    this.store.dispatch(delayFlight({id}));
    
    // const flights = this.flights();
    // const date = new Date(flights[0].date);
    // date.setTime(date.getTime() + 1000 * 60 * 15);

    // Mutable
    // this.flights.mutate(flights => {
    //   flights[0].date = date.toISOString()
    // });

    // this.flights.update(flights => ([
    //   { ...flights[0], date: date.toISOString() },
    //   ...flights.slice(1)
    // ]))
    // Immutable
    // const newFlight: Flight = { ...this.flights[0], date: date.toISOString()}
    // const newFlights = [newFlight, ...this.flights.slice(1)];
    // this.flights = newFlights;
  }
}
