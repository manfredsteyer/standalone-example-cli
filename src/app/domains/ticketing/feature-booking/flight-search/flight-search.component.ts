import {AsyncPipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {Component, WritableSignal, computed, effect, inject, signal} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Store} from "@ngrx/store";
import {combineLatest, debounceTime, filter, interval, switchMap, take, takeUntil, tap} from "rxjs";
import {toObservable, toSignal, takeUntilDestroyed} from "@angular/core/rxjs-interop";

import {ActivatedRoute} from "@angular/router";
import {BookingSlice, Flight, FlightService, delayFlight, loadFlights, selectFlights} from "../../data";
import {CityValidator} from "src/app/shared/util-common";
import {FlightCardComponent} from "../../ui-common";
import { ChangeDetectionStrategy } from "@angular/core";

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
  private route = inject(ActivatedRoute);

  from = signal(''); // in Germany
  to = signal(''); // in Austria
  urgent = signal(false);

  flightRoute = computed(() => `Route from ${this.from()} to ${this.to()}`);

  // flights: WritableSignal<Flight[]> = signal([]);

  basket: WritableSignal<Record<number, boolean>> = signal({
    3: true,
    5: true
  });

  // debouncedFrom = toSignal(toObservable(this.from).pipe(debounceTime(300)), { initialValue: '' });
  // debouncedTo = toSignal(toObservable(this.to).pipe(debounceTime(300)), { initialValue: '' })
  
  flights = toSignal(combineLatest([
    toObservable(this.from),
    toObservable(this.to),
    interval(1000),
  ]).pipe(
    takeUntilDestroyed(),
    tap(([from, to, interval]) => console.log('interval', interval)),
    filter(([from, to]) => from.length >= 3 && to.length >= 3),
    debounceTime(300),
    switchMap(([from, to]) => this.flightService.find(from, to))
  ), { initialValue: []});

  constructor() {

    // setTimeout(() => {
    //   this.from.set('Frankfurt');
    //   // Frankfurt - Graz   :: glitch
    //   this.to.set('München');
    //   // Frankfurt - München
    // }, 2000);

    // effect(() => {
    //   console.log(this.flightRoute());
    // });

    // effect(() => {
    //   this.search();
    // });

    this.route.paramMap.subscribe(p => {
      const from = p.get('from');
      const to = p.get('to');

      if (from && to) {
        this.from.set(from);
        this.to.set(to);
      }
    });
  }

  delay(): void {
    const flights = this.flights();
    const date = new Date(flights[0].date);
    date.setTime(date.getTime() + 1000 * 60 * 15);

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



