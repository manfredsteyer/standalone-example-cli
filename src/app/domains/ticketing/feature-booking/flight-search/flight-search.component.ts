import {AsyncPipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {ChangeDetectionStrategy, Component, computed, effect, inject, signal} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Store} from "@ngrx/store";
import {combineLatest, debounceTime, filter, interval, startWith, take, takeUntil} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {BookingSlice, Flight, FlightService, delayFlight, loadFlights, selectFlights} from "../../data";
import {CityValidator} from "src/app/shared/util-common";
import {FlightCardComponent} from "../../ui-common";
import { toSignal, toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';

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

  private store = inject(Store);
  private flightService = inject(FlightService);

  // Signal <|--- WritableSignal

  from = signal('Hamburg'); // in Germany
  to = signal('Graz'); // in Austria
  
  from$ = toObservable(this.from);
  to$ = toObservable(this.to);

  criteria$ = combineLatest({
    from: this.from$, 
    to: this.to$,
    dummy: interval(1000),
  })
    .pipe(
      filter(combi => combi.from.length >= 3 && combi.to.length >= 3),
      debounceTime(300),
      // startWith
  );

  criteria = toSignal(this.criteria$, 
    { initialValue: { from: 'Hamburg', to: ' Graz', dummy: 0} });
  
  // criteria2 = toSignal(this.criteria$, { requireSync: true })

  flightRoute = computed(() => this.from() + ' to ' + this.to());
  
  urgent = signal(false);

  flights = toSignal(this.store.select(selectFlights), { requireSync: true });
  
  // NGRX 16: this.store.selectSignal(selectFlights)
  
  // flights = signal<Flight[]>([]);

  constructor() {

    // setTimeout(() => {
    //   this.from.set('London');
    //   // Glitch: London - Graz
    //   this.to.set('Paris');
    //   // London - Paris
    // }, 2000);

    effect(() => {
      // console.log(this.flightRoute());
      this.search();
      //console.log(this.criteria().dummy);
    });

    this.criteria$.pipe(takeUntilDestroyed()).subscribe(x => console.log('criteria$', x));


  }

  basket = signal<Record<number, boolean>>({
    3: true,
    5: true
  });

  async search() {

    const c = this.criteria();

    if (!c.from || !c.to) return;

    this.store.dispatch(loadFlights({ from: c.from, to: c.to }));
   
  }

  delay(): void {
    const flights = this.flights();
    const id = flights[0].id;

    this.store.dispatch(delayFlight({id}));


  }

}

