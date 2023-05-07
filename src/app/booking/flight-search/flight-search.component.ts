import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, Injector, NgZone, OnInit, runInInjectionContext, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CityValidator } from '@demo/shared';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { Flight, FlightService } from '@demo/data';
import { addMinutes } from 'src/app/date-utils';
import { createStore } from '../../solid-store';

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
  selector: 'flight-search',
  templateUrl: './flight-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlightSearchComponent implements OnInit {
  private flightService = inject(FlightService);

  private element = inject(ElementRef);
  private zone = inject(NgZone);

  from = signal('Hamburg');
  to = signal('Graz');
  flights = signal<Flight[]>([]);

  basket = signal<Record<number, boolean>>({ 1: true });
  urgent = signal(false);

  flightRoute = computed(() => this.from() + ' to ' + this.to());

  injector = inject(Injector);

  _store = createStore({
    counter: 0,
    flights: [] as Flight[]
  });

  get store() {
    return this._store[0];
  }

  get setStore() {
    return this._store[1];
  }

  constructor() {

    effect(() => {
      this.blink();
      console.log('flights array changed', this.store.flights)
    });

    effect(() => {
      console.log('route:', this.flightRoute());
    });

  }


  ngOnInit(): void {
    runInInjectionContext(this.injector, () => {
      effect(() => {
        console.log('route:', this.flightRoute());
      });
    });
  }

  async search(): Promise<void> {
    if (!this.from() || !this.to()) {
      return;
    }
    // const flights = await this.flightService.findAsPromise(this.from(), this.to());
    // this.flights.set(flights);

    const now = new Date().toISOString();
    console.log('store', this.store.flights);
    console.log('store', this.store.flights);

    console.log('counter', this.store.counter);
    console.log('counter', this.store.counter);

    this.setStore('flights', [
      { id: 1, from: 'A', to: 'B', date: now, delayed: false},
      { id: 2, from: 'B', to: 'C', date: now, delayed: false}
    ]);

    this.setStore('counter', c => c+1);

    console.log('store', this.store.flights);

    console.log('counter', this.store.counter);


  }
  // Just delay the first flight
  delay(): void {

    const f = this.store.flights[0];
    const date = addMinutes(f.date, 15);
    this.setStore('flights', 0, f => ({...f, date}));
    // this.flights.update(f => {
    //   const flight = f[0];
    //   const date = addMinutes(flight.date, 15);
    //   const updated = {...flight, date};

    //   return [
    //     updated,
    //     ...f.slice(1)
    //   ];
    // });

  }

  blink() {
    // Dirty Hack used to visualize the change detector
    this.element.nativeElement.firstChild.style.backgroundColor = 'crimson';

    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.element.nativeElement.firstChild.style.backgroundColor = 'white';
      }, 1000);
    });

    return null;
  }
}
