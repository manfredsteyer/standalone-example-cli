import {AsyncPipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {ChangeDetectionStrategy, Component, Injectable, Injector, computed, effect, inject, signal} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Flight, FlightService} from "../../data";
import {CityValidator, addMinutes} from "src/app/shared/util-common";
import {FlightCardComponent} from "../../ui-common";
import { toObservable, toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest, debounceTime, filter, interval, startWith } from "rxjs";

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
export class FlightSearchComponent  {

  private flightService = inject(FlightService);

  from = signal('Paris'); 
  to = signal('London'); 

  from$ = toObservable(this.from);
  to$ = toObservable(this.to);

  criteria$ = combineLatest({
    from: this.from$,
    to: this.to$,
    counter: interval(1000),
  }).pipe(
    filter(c => c.from.length >= 3 && c.to.length >=3),
    debounceTime(300),
    startWith({
      from: '',
      to: '',
      counter: -1

    })
  )

  criteria = toSignal(this.criteria$, {
    initialValue: {
      from: '',
      to: '',
      counter: -1
    }
  });

  criteria2 = toSignal(this.criteria$, {
    requireSync: true,
  });


  flightsRoute = computed(() => this.from() + ' to ' + this.to());
  
  flights = signal<Flight[]>([]);

  constructor() {

    this.criteria$.pipe(takeUntilDestroyed()).subscribe(c => {
      console.log('counter$', c.counter);
    })

    effect(() => {
      console.log('counter', this.criteria().counter);
    });

    // Glitchfree-ness

    effect(() => {
      this.search();
    });

    // setTimeout(() => {
    //   this.from.set('Nürnberg'); // <-- Glitch
    //   this.from.set('Frankfurt');

    //   // Frankfurt - London     // <-- Glitch

    //   this.to.set('New York');

    //   // Frankfurt - New York

    // }, 2000);
  }

  async search(): Promise<void> {

    const { from, to } = this.criteria();

    if (!from || !to) return;
    const flights = await this.flightService.findPromise(from, to);
    this.flights.set(flights);
  }

  injector = inject(Injector);

  delay(): void {

    const date = addMinutes(this.flights()[0].date, 15);

    // this.flights.mutate(flights => {
    //   flights[0].date = date.toISOString();
    // });

    this.flights.update(flights => ([
      { ...flights[0], date: date.toISOString() },
      ...flights.slice(1)
    ]));

  }
}
