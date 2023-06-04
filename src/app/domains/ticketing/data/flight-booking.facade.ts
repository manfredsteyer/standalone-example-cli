import { Injectable, computed, inject } from '@angular/core';
import { FlightService } from './flight.service';
import { Flight } from './flight';
import { addMinutes } from 'src/app/shared/util-common';
import {
  signalStore,
  withState,
  withComputed,
} from '../../../ngrx-signal-store-poc';

const Store = signalStore(
  { providedIn: 'root' },
  withState({
    from: 'Paris',
    to: 'London',
    flights: [] as Flight[],
    basket: {} as Record<number, boolean>,
  }),
  withComputed(({ flights, basket }) => ({
    selected: computed(() => flights().filter((f) => basket()[f.id])),
  }))
);

@Injectable({ providedIn: 'root' })
export class FlightBookingFacade {
  private flightService = inject(FlightService);
  private store = inject(Store);

  // fetch root signals as readonly
  flights = this.store.flights;
  from = this.store.from;
  to = this.store.to;
  basket = this.store.basket;

  // fetch selected signal
  selected = this.store.selected;

  updateCriteria(from: string, to: string): void {
    this.store.update({ from });
    this.store.update({ to });
  }

  updateBasket(id: number, selected: boolean): void {
    this.store.update((state) => ({
      ...state,
      basket: {
        ...state.basket,
        [id]: selected,
      },
    }));
  }

  async load() {
    if (!this.from() || !this.to()) return;
    const flights = await this.flightService.findPromise(
      this.from(),
      this.to()
    );

    this.store.update({flights});
  }

  delay(): void {
    const flights = this.flights();
    const flight = flights[0];

    const date = addMinutes(flight.date, 15);
    const updFlight = { ...flight, date };
    const updFlights = [updFlight, ...this.store.flights().slice(1)];

    this.store.update({flights: updFlights});
  }
}
