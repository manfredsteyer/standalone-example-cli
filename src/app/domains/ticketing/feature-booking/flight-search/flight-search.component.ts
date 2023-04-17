import {AsyncPipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {ChangeDetectionStrategy, Component, computed, effect, inject, signal} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Store, select} from "@ngrx/store";
import {combineLatest, debounce, debounceTime, filter, interval, take, takeUntil} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {BookingSlice, Flight, FlightService, delayFlight, loadFlights, selectFlights} from "../../data";
import {CityValidator} from "src/app/shared/util-common";
import {FlightCardComponent} from "../../ui-common";
import { toObservable, toSignal, takeUntilDestroyed} from '@angular/core/rxjs-interop';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlightSearchComponent  {

  private flightService = inject(FlightService);
  store = inject(Store);

  from = signal('Hamburg'); // in Germany
  to = signal('Graz'); // in Austria

  flightRoute = computed(() => this.from() + ' to ' + this.to());

  from$ = toObservable(this.from);
  to$ = toObservable(this.to);

  criteria$ = combineLatest({from: this.from$, to: this.to$, /*counter: interval(1000)*/}).pipe(
    takeUntilDestroyed(),
    filter(({from, to}) => from.length >= 3 && to.length >= 3),
    debounceTime(300),
  );

  criteria = toSignal(this.criteria$, { initialValue: {from: 'Graz', to: 'Hamburg'/*, counter: -1*/} })

  urgent = signal(false);

  flights = toSignal(this.store.select(selectFlights), { requireSync: true });
  // this.store.selectSignal(selectFlights)

  basket = signal<Record<number, boolean>>({
    3: true,
    5: true
  });

  constructor() {
    // Demo: glitch-freeness

    effect(() => {
      console.log('route', this.flightRoute());
    });

    effect(() => {
      console.log('criteria', this.criteria());
    });


    this.criteria$.subscribe(c => {
      console.log('criteria$', c);
    })

    effect(async () => {
      await this.search();
    });

    // setTimeout(() => {
    //   this.from.set('Wien');
    //   // Current State: Wien - Graz -- glitch!!
    //   this.to.set('Frankfurt');

    // }, 2000);

  }

  async search() {
    const c = this.criteria();

    this.store.dispatch(loadFlights({ from: c.from, to: c.to }));

  }

  delay(): void {
    const flights = this.flights();
    const id = flights[0].id;

    this.store.dispatch(delayFlight({id}));

    // const date = new Date(flights[0].date);
    // date.setTime(date.getTime() + 1000 * 60 * 15);

    // this.flights.mutate(flights => {
    //   flights[0].date = date.toISOString();
    // });

    // Immutables
    // this.flights.update(flights => ([
    //   { ...flights[0], date: date.toISOString() },
    //   ...flights.slice(1)
    // ]));

    // flights[0].date = date.toISOString();
    // this.flights.set(flights);
  }

}

