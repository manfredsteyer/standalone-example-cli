import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CityValidator } from '@demo/shared';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { Flight, FlightService } from '@demo/data';
import { combineLatest, debounceTime, filter } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

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
})
export class FlightSearchComponent implements OnInit {
  private flightService = inject(FlightService);

  from = signal('Hamburg');
  to = signal('Graz');
  flights = signal<Flight[]>([]);

  basket = signal<Record<number, boolean>>({ 1: true });
  urgent = signal(false);

  flightRoute = computed(() => this.from() + ' to ' + this.to());

  from$ = toObservable(this.from);
  to$ = toObservable(this.to);

  criteria$ = combineLatest({ from: this.from$, to: this.to$ }).pipe(
    filter(combi => combi.from.length >= 3 && combi.to.length >= 3),
    debounceTime(300),
  );

  criteria = toSignal(this.criteria$, { 
    initialValue: {
      from: '',
      to: '',
    }
  });

  // criteria2 = toSignal(this.criteria$, { 
  //   requireSync: true
  // });

  constructor() {
    effect(() => {
      console.log('route:', this.flightRoute());
    });

    effect(() => {
      this.search();
    });
  }

  async search() {
    const {from, to} = this.criteria();

    if (!from || !to) {
      return;
    }

    const flights = await this.flightService.findAsPromise(from, to);
    this.flights.set(flights);
  }

  ngOnInit(): void {}
}
