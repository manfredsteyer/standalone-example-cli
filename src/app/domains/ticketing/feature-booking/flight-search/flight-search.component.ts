import {AsyncPipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {ChangeDetectionStrategy, Component, Injector, computed, effect, inject, signal} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Flight, FlightService} from "../../data";
import {CityValidator, addMinutes} from "src/app/shared/util-common";
import {FlightCardComponent} from "../../ui-common";
import { toSignal, toObservable, takeUntilDestroyed} from '@angular/core/rxjs-interop';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html'
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
  })
  .pipe(
    filter(c => c.from.length >= 3 && c.to.length >= 3),
    debounceTime(300),
    startWith({ from: '', to: '', counter: -1 })
  );

  criteria = toSignal(this.criteria$, {
    requireSync: true,
  });

  flightRoute = computed(() => this.from() + ' to ' + this.to());

  flights = signal<Flight[]>([]);

  constructor() {

    // Glitch-freeness

    this.criteria$.pipe(takeUntilDestroyed()).subscribe(c => {
      console.log('counter$', c.counter);
    })

    effect(() => {
      // console.log('from', this.from());
      // console.log('to', this.to());
      // this.to.set(this.from());
      this.search();
    });

    effect(() => {
      console.log('counter', this.criteria().counter);
    })

    // Paris
    // London

    setTimeout(() => {
      this.from.set('Graz');

      // Graz
      // London

      this.to.set('Hamburg');

    }, 2000)

  }

  injector = inject(Injector);

  async search(): Promise<void> {
    const {from, to } = this.criteria();
    if (!from || !to) return;
    const flights = await this.flightService.findPromise(from, to);
    this.flights.set(flights);
  }

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
