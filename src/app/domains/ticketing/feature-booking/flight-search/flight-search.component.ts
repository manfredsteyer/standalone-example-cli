import {AsyncPipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {ChangeDetectionStrategy, Component, computed, effect, inject, signal} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Store, select} from "@ngrx/store";
import {combineLatest, debounceTime, filter, interval, startWith, take, tap} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {BookingSlice, Flight, FlightService, delayFlight, loadFlights, selectFlights} from "../../data";
import {CityValidator} from "src/app/shared/util-common";
import {FlightCardComponent} from "../../ui-common";

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
export class FlightSearchComponent  {

  private flightService = inject(FlightService);
  private store = inject(Store);

  // Signal <|---- WriteableSignal

  from = signal('Hamburg'); // in Germany
  to = signal('Graz'); // in Austria

  from$ = toObservable(this.from);
  to$ = toObservable(this.to);

  criteria$ = combineLatest({
    from: this.from$,
    to: this.to$,
    // dummy: interval(1000)
  })
  .pipe(
    tap(x => console.log('counter$', x)),
    filter(combi => combi.from.length >= 3 && combi.to.length >= 3),
    debounceTime(300),
    // takeUntilDestroyed(),
    // startWith()
  );

  criteria = toSignal(this.criteria$, {
    initialValue: {
      from: 'Hamburg',
      to: 'Graz',
      dummy: -1
    }
  });

  // criteria2 = toSignal(this.criteria$, {
  //   requireSync: true
  // });


  flightRoute = computed(() => this.from() + ' to ' + this.to() );

  urgent = signal(false);

  //flights = signal<Flight[]>([]);

  flights = toSignal(this.store.select(selectFlights), {
    requireSync: true
  });

  // flights = this.store.selectSignal(selectFlights)

  basket = signal<Record<number, boolean>>({
    3: true,
    5: true
  });

  constructor() {

    this.criteria$.subscribe();

    // Hamburg - Graz

    setTimeout(() => {
      // Hamburg - Graz
      this.from.set('Paris');
      // Paris - Graz     // glitch ==> RxJS
      this.to.set('London');
      // Paris - London     
    }, 2000);

    effect(() => {


      // glitch-freeness
      //console.log('flightRoute', this.flightRoute())
    });

    effect(() => {

      // withoutTracking(...)
      // inject() --> DestroyContext 

      //console.log('counter', this.criteria().dummy);
      this.search();
    });

  }

  async search() {
    const c = this.criteria();

    if (!c.from || !c.to) return;

    this.store.dispatch(loadFlights({ from: c.from, to: c.to }));

    // const flights = await this.flightService.findPromise(c.from, c.to);
    // this.flights.set(flights);
  }

  delay(): void {
    const flights = this.flights();

    const id = flights[0].id;

    this.store.dispatch(delayFlight({ id }));


    // // this.flights.mutate(flights => {
    // //   flights[0].date = date.toISOString();
    // // });

    // this.flights.update(flights => [
    //   { ...flights[0], date: date.toISOString()  },
    //   ...flights.slice(1)
    // ])
  }

}

