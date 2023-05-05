import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest, debounceTime, filter, interval, take } from 'rxjs';
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

import { toObservable, toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';

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

  from = signal('Hamburg'); // in Germany
  to = signal('Graz'); // in Austria

  from$ = toObservable(this.from);
  to$ = toObservable(this.to);

  criteria$ = combineLatest({
    from: this.from$, 
    to: this.to$,
    dummy: interval(1000)
  }).pipe(
    filter(c => c.from.length >= 3 && c.to.length >= 3),
    debounceTime(300)
  );

  criteria = toSignal(this.criteria$, {
    initialValue: {
      from: '',
      to: '',
      dummy: -1
    }
  });


  urgent = signal(false);

  flights = signal<Flight[]>([]);

  flightRoute = computed(() => this.from() + ' to ' + this.to());

  basket = signal<Record<number, boolean>>({
    3: true,
    5: true,
  });

  constructor() {

    this.criteria$
      // .pipe(takeUntilDestroyed())
      .subscribe(c => console.log('dummy$', c.dummy));

    effect(() => {
      console.log('dummy', this.criteria().dummy);
    })

    effect(() => {
      console.log('from', this.from()); // Paris  Paris
      console.log('to', this.to()); // Graz   New York
    });

    // effect(() => {
    //   this.to.set(this.from())
    // }, { allowSignalWrites: true});

    setTimeout(() => {
      this.from.set('Paris');
      // Glitch
      this.to.set('New York');
    }, 2000);

    effect(() => {
      this.search();
    });
  }

  async search() {
    const {from, to} = this.criteria();

    if (!from || !to) return;

    const flights = await this.flightService.findPromise(
      from,
      to,
      this.urgent(),
    );

    this.flights.set(flights);
  }

  delay(): void {
    const flights = this.flights();
    const date = new Date(flights[0].date);
    date.setTime(date.getTime() + 1000 * 60 * 15);

    // this.flights.mutate(flights => {
    //   flights[0].date = date.toISOString();
    // });

    this.flights.update((flights) => [
      { ...flights[0], date: date.toISOString() },
      ...flights.slice(1),
    ]);
  }
}
