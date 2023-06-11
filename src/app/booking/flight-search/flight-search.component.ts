import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CityValidator } from '@demo/shared';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { Flight, FlightService } from '@demo/data';
import { addMinutes } from 'src/app/date-utils';
import { createStore } from 'src/app/utils';
import { firstValueFrom } from 'rxjs';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightSearchComponent {
  private flightService = inject(FlightService);

  store = createStore({
    criteria: {
      from: 'Hamburg',
      to: 'Graz',
      urgent: false,
    },
    flights: [] as Flight[],
    basket: {
      3: true,
      5: true,
    } as Record<number, boolean>,
  });

  //flights = this.store.select((s) => s.flights);
  flights = this.store.select('flights');
  criteria = this.store.select((s) => s.criteria);
  basket = this.store.select((s) => s.basket);

  // flightsWritable = this.store.selectWritable(s => s.flights);

  // flightsW = this.store.selectWritable(s => s.flights);

  flightRoute = computed(
    () => this.criteria().from + ' to ' + this.criteria().to
  );

  async search() {
    const from = this.criteria().from;
    const to = this.criteria().to;
    const urgent = this.criteria().urgent;

    if (!from || !to) return;

    const flights = await firstValueFrom(
      this.flightService.find(from, to, urgent)
    );

    this.store.update((s) => s.flights, flights);

    // Alternative (the string is type safe, btw):
    this.store.update('flights', flights);

    // In this example, we need an entry in basked for each flight
    // const basket = flights.reduce((acc, f) => ({ ...acc, [f.id]: false }), {});
    // this.store.update((s) => s.basket, basket);

    // Alternative (the string is type safe, btw):
    // this.store.update('basket', basket);

    // TODO: Update: Just signals! 

    // TODO: Make flattening work again
    // Example for flattening (removing all nested signals):
    // const flat = flatten(this.store.select((s) => s.flights()));
    // console.log('flat flights', flat);
  }

  delay(): void {
    this.store.update(
      (s) => s.flights()[0],
      (flight) => ({...flight, date: addMinutes(flight.date, 15)})
    );

    // this.flightsWritable.set([]);

    // console.log('flightW', this.flightsW);
    //this.flightsW.set([]);

    // const flight = this.flights()[0]();
    // const updated = {...flight, date: addMinutes(flight.date, 15)};
    // this.store.update('flights', 0, updated);
  }

  updateBasket(flightId: number, selected: boolean) {
    this.store.update('basket', { [flightId]: selected });
  }

}
