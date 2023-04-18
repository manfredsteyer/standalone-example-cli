import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  combineLatest,
  debounceTime,
  filter,
  interval,
  startWith,
  take,
  tap,
} from 'rxjs';
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
import { toObservable, toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
export class FlightSearchComponent {
  private flightService = inject(FlightService);
  private store = inject(Store);

  // Signal <|--- WritableSignal

  from = signal('Hamburg'); // in Germany
  to = signal('Graz'); // in Austria

  from$ = toObservable(this.from);
  to$ = toObservable(this.to);

  criteria$ = combineLatest({
    from: this.from$,
    to: this.to$,
    dummy: interval(1000)
  }).pipe(
    filter((combi) => combi.from.length >= 3 && combi.to.length >= 3),
    debounceTime(300),
  );

  // criteria = toSignal(this.criteria$, {
  //   initialValue: {
  //     from: 'Graz',
  //     to: 'Hamburg',
  //     dummy: -1
  //   },
  // });

  flightRoute = computed(() => this.from() + ' to ' + this.to());

  urgent = signal(false);

  flights = toSignal(this.store.select(selectFlights), {
    requireSync: true,
  });

  basket = signal<Record<number, boolean>>({
    3: true,
    5: true,
  });

  constructor() {

    this.criteria$.pipe(takeUntilDestroyed()).subscribe(x => console.log(x));

    effect(() => {
      console.log('route', this.flightRoute());
    });

    setTimeout(() => {
      this.from.set('Paris');
      // Glitch: Paris - Graz   -- Push/Pull
      // Glitch-free!
      this.to.set('London');
    }, 2000);

    effect(() => {
      this.search();
    });

  }

  async search() {
  //   const c = this.criteria();
  //   if (!c.from || !c.to) return;
  //   this.store.dispatch(loadFlights({ from: c.from, to: c.to }));
  }

  delay(): void {
    const flights = this.flights();
    const id = flights[0].id;
    this.store.dispatch(delayFlight({ id }));
  }
}
